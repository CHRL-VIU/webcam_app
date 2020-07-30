
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let images = writable([]);
    const numImages =  writable(0);
    const slide_id = writable(0);
    const userStn = writable("plummer");

    /* src/Image.svelte generated by Svelte v3.24.0 */
    const file = "src/Image.svelte";

    function create_fragment(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "" + (imgPath + /*image*/ ctx[0]))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "slideshow");
    			attr_dev(img, "class", "svelte-1gozjln");
    			add_location(img, file, 7, 2, 148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*image*/ 1 && img.src !== (img_src_value = "" + (imgPath + /*image*/ ctx[0]))) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const imgPath = "http://www.viu-hydromet-wx.ca/webcam_images/";

    function instance($$self, $$props, $$invalidate) {
    	let { image = {} } = $$props;
    	const writable_props = ["image"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Image", $$slots, []);

    	$$self.$set = $$props => {
    		if ("image" in $$props) $$invalidate(0, image = $$props.image);
    	};

    	$$self.$capture_state = () => ({ images, image, imgPath });

    	$$self.$inject_state = $$props => {
    		if ("image" in $$props) $$invalidate(0, image = $$props.image);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [image];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { image: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get image() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Images.svelte generated by Svelte v3.24.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/Images.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let t6;
    	let button3;
    	let t8;
    	let div5;
    	let div3;
    	let div2;
    	let h5;
    	let t9;
    	let t10_value = /*$images*/ ctx[0][/*$slide_id*/ ctx[2]] + "";
    	let t10;
    	let t11;
    	let image;
    	let t12;
    	let div4;
    	let input;
    	let t13;
    	let small1;
    	let t14;
    	let small0;
    	let current;
    	let mounted;
    	let dispose;

    	image = new Image({
    			props: {
    				image: /*$images*/ ctx[0][/*$slide_id*/ ctx[2]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Plummer";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Klinaklini";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "Homathko";
    			t6 = space();
    			button3 = element("button");
    			button3.textContent = "Perseverance";
    			t8 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h5 = element("h5");
    			t9 = text("Filename: ");
    			t10 = text(t10_value);
    			t11 = space();
    			create_component(image.$$.fragment);
    			t12 = space();
    			div4 = element("div");
    			input = element("input");
    			t13 = space();
    			small1 = element("small");
    			t14 = text("Note: You can use the blue circle to quickly scrub through the images or use the keyboard arrows to go one at a time. ");
    			small0 = element("small");
    			if (img.src !== (img_src_value = "images/chrl-logo-text.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "CHRL logo");
    			set_style(img, "width", "184px");
    			set_style(img, "height", "48px");
    			add_location(img, file$1, 50, 8, 1557);
    			attr_dev(a, "href", "http://www.viu-hydromet-wx.ca/");
    			attr_dev(a, "class", "logo svelte-9ioti8");
    			add_location(a, file$1, 49, 4, 1494);
    			add_location(button0, file$1, 53, 8, 1697);
    			add_location(button1, file$1, 56, 12, 1776);
    			add_location(button2, file$1, 59, 12, 1859);
    			add_location(button3, file$1, 62, 12, 1941);
    			attr_dev(div0, "class", "header-right svelte-9ioti8");
    			add_location(div0, file$1, 52, 4, 1662);
    			attr_dev(div1, "class", "header svelte-9ioti8");
    			add_location(div1, file$1, 48, 0, 1469);
    			set_style(h5, "word-wrap", "break-word");
    			set_style(h5, "margin-top", "0.2em");
    			set_style(h5, "margin-bottom", "0.2em");
    			add_location(h5, file$1, 73, 2, 2108);
    			attr_dev(div2, "id", "filename");
    			add_location(div2, file$1, 72, 0, 2084);
    			attr_dev(div3, "class", "slideshow");
    			add_location(div3, file$1, 71, 0, 2058);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", /*$numImages*/ ctx[1]);
    			attr_dev(input, "step", "1");
    			attr_dev(input, "class", "slider svelte-9ioti8");
    			add_location(input, file$1, 78, 0, 2300);
    			add_location(small0, file$1, 79, 126, 2520);
    			add_location(small1, file$1, 79, 0, 2394);
    			attr_dev(div4, "class", "rangecontainer svelte-9ioti8");
    			add_location(div4, file$1, 77, 0, 2270);
    			attr_dev(div5, "class", "body");
    			add_location(div5, file$1, 70, 0, 2037);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a);
    			append_dev(a, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t2);
    			append_dev(div0, button1);
    			append_dev(div0, t4);
    			append_dev(div0, button2);
    			append_dev(div0, t6);
    			append_dev(div0, button3);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h5);
    			append_dev(h5, t9);
    			append_dev(h5, t10);
    			append_dev(div3, t11);
    			mount_component(image, div3, null);
    			append_dev(div5, t12);
    			append_dev(div5, div4);
    			append_dev(div4, input);
    			set_input_value(input, /*$slide_id*/ ctx[2]);
    			append_dev(div4, t13);
    			append_dev(div4, small1);
    			append_dev(small1, t14);
    			append_dev(small1, small0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*plum*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*klina*/ ctx[4], false, false, false),
    					listen_dev(button2, "click", /*homath*/ ctx[5], false, false, false),
    					listen_dev(button3, "click", /*perse*/ ctx[6], false, false, false),
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[7]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$images, $slide_id*/ 5) && t10_value !== (t10_value = /*$images*/ ctx[0][/*$slide_id*/ ctx[2]] + "")) set_data_dev(t10, t10_value);
    			const image_changes = {};
    			if (dirty & /*$images, $slide_id*/ 5) image_changes.image = /*$images*/ ctx[0][/*$slide_id*/ ctx[2]];
    			image.$set(image_changes);

    			if (!current || dirty & /*$numImages*/ 2) {
    				attr_dev(input, "max", /*$numImages*/ ctx[1]);
    			}

    			if (dirty & /*$slide_id*/ 4) {
    				set_input_value(input, /*$slide_id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div5);
    			destroy_component(image);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $images;
    	let $numImages;
    	let $slide_id;
    	validate_store(images, "images");
    	component_subscribe($$self, images, $$value => $$invalidate(0, $images = $$value));
    	validate_store(numImages, "numImages");
    	component_subscribe($$self, numImages, $$value => $$invalidate(1, $numImages = $$value));
    	validate_store(slide_id, "slide_id");
    	component_subscribe($$self, slide_id, $$value => $$invalidate(2, $slide_id = $$value));

    	onMount(async () => {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    	});

    	async function plum() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		console.log(url);
    	}

    	async function klina() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=klinaklini";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		console.log(url);
    	}

    	async function homath() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=homathko";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		console.log(url);
    	}

    	async function perse() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=perseverance";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		console.log(url);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Images> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Images", $$slots, []);

    	function input_change_input_handler() {
    		$slide_id = to_number(this.value);
    		slide_id.set($slide_id);
    	}

    	$$self.$capture_state = () => ({
    		images,
    		numImages,
    		slide_id,
    		userStn,
    		onMount,
    		tick,
    		Image,
    		writable,
    		plum,
    		klina,
    		homath,
    		perse,
    		$images,
    		$numImages,
    		$slide_id
    	});

    	return [
    		$images,
    		$numImages,
    		$slide_id,
    		plum,
    		klina,
    		homath,
    		perse,
    		input_change_input_handler
    	];
    }

    class Images extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Images",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$2 = "src/App.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let images;
    	let current;
    	images = new Images({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(images.$$.fragment);
    			attr_dev(div, "class", "mainimage");
    			add_location(div, file$2, 5, 0, 58);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(images, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(images.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(images.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(images);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Images });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
