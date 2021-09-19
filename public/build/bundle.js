
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
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
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    			attr_dev(img, "class", "svelte-11wgpvo");
    			add_location(img, file, 6, 2, 108);
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

    	$$self.$capture_state = () => ({ image, imgPath });

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

    function loader (urls, test, callback) {
      let remaining = urls.length;

      function maybeCallback () {
        remaining = --remaining;
        if (remaining < 1) {
          callback();
        }
      }

      if (!test()) {
        urls.forEach(({ type, url, options = { async: true, defer: true }}) => {
          const isScript = type === 'script';
          const tag = document.createElement(isScript ? 'script': 'link');
          if (isScript) {
            tag.src = url;
            tag.async = options.async;
            tag.defer = options.defer;
          } else {
            tag.rel = 'stylesheet';
    		    tag.href = url;
          }
          tag.onload = maybeCallback;
          document.body.appendChild(tag);
        });
      } else {
        callback();
      }
    }

    const contextKey = {};

    function reusify (Constructor) {
      var head = new Constructor();
      var tail = head;

      function get () {
        var current = head;

        if (current.next) {
          head = current.next;
        } else {
          head = new Constructor();
          tail = head;
        }

        current.next = null;

        return current
      }

      function release (obj) {
        tail.next = obj;
        tail = obj;
      }

      return {
        get: get,
        release: release
      }
    }

    var reusify_1 = reusify;

    function fastqueue (context, worker, concurrency) {
      if (typeof context === 'function') {
        concurrency = worker;
        worker = context;
        context = null;
      }

      var cache = reusify_1(Task);
      var queueHead = null;
      var queueTail = null;
      var _running = 0;

      var self = {
        push: push,
        drain: noop$1,
        saturated: noop$1,
        pause: pause,
        paused: false,
        concurrency: concurrency,
        running: running,
        resume: resume,
        idle: idle,
        length: length,
        getQueue: getQueue,
        unshift: unshift,
        empty: noop$1,
        kill: kill,
        killAndDrain: killAndDrain
      };

      return self

      function running () {
        return _running
      }

      function pause () {
        self.paused = true;
      }

      function length () {
        var current = queueHead;
        var counter = 0;

        while (current) {
          current = current.next;
          counter++;
        }

        return counter
      }

      function getQueue () {
        var current = queueHead;
        var tasks = [];

        while (current) {
          tasks.push(current.value);
          current = current.next;
        }

        return tasks
      }

      function resume () {
        if (!self.paused) return
        self.paused = false;
        for (var i = 0; i < self.concurrency; i++) {
          _running++;
          release();
        }
      }

      function idle () {
        return _running === 0 && self.length() === 0
      }

      function push (value, done) {
        var current = cache.get();

        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop$1;

        if (_running === self.concurrency || self.paused) {
          if (queueTail) {
            queueTail.next = current;
            queueTail = current;
          } else {
            queueHead = current;
            queueTail = current;
            self.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }

      function unshift (value, done) {
        var current = cache.get();

        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop$1;

        if (_running === self.concurrency || self.paused) {
          if (queueHead) {
            current.next = queueHead;
            queueHead = current;
          } else {
            queueHead = current;
            queueTail = current;
            self.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }

      function release (holder) {
        if (holder) {
          cache.release(holder);
        }
        var next = queueHead;
        if (next) {
          if (!self.paused) {
            if (queueTail === queueHead) {
              queueTail = null;
            }
            queueHead = next.next;
            next.next = null;
            worker.call(context, next.value, next.worked);
            if (queueTail === null) {
              self.empty();
            }
          } else {
            _running--;
          }
        } else if (--_running === 0) {
          self.drain();
        }
      }

      function kill () {
        queueHead = null;
        queueTail = null;
        self.drain = noop$1;
      }

      function killAndDrain () {
        queueHead = null;
        queueTail = null;
        self.drain();
        self.drain = noop$1;
      }
    }

    function noop$1 () {}

    function Task () {
      this.value = null;
      this.callback = noop$1;
      this.next = null;
      this.release = noop$1;
      this.context = null;

      var self = this;

      this.worked = function worked (err, result) {
        var callback = self.callback;
        self.value = null;
        self.callback = noop$1;
        callback.call(self.context, err, result);
        self.release(self);
      };
    }

    var queue = fastqueue;

    class EventQueue {
      constructor (worker) {
        this.queue = new queue(this, worker, 1);
        this.queue.pause();
      }

      send (command, params = []) {
        this.queue.push([ command, params ]);
      }

      start () {
        this.queue.resume();
      }

      stop () {
        this.queue.kill();
      }
    }

    /* node_modules/@beyonk/svelte-mapbox/src/Map.svelte generated by Svelte v3.24.0 */

    const { Object: Object_1 } = globals;
    const file$1 = "node_modules/@beyonk/svelte-mapbox/src/Map.svelte";

    // (2:2) {#if map}
    function create_if_block(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(2:2) {#if map}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	let if_block = /*map*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "svelte-1kuj9kb");
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[14](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*map*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*map*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[14](null);
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
    	setContext(contextKey, {
    		getMap: () => map,
    		getMapbox: () => mapbox
    	});

    	const dispatch = createEventDispatcher();
    	let { map = null } = $$props;
    	let { version = "v1.11.0" } = $$props;
    	let container;
    	let mapbox;
    	let queue;
    	let { options = {} } = $$props;
    	let { accessToken } = $$props;
    	let { style = "mapbox://styles/mapbox/streets-v11" } = $$props;

    	function setCenter(center, zoom) {
    		queue.send("setCenter", [center]);

    		if (zoom && Number.isInteger(zoom)) {
    			queue.send("setZoom", [zoom]);
    		}
    	}

    	function fitBounds(bbox) {
    		queue.send("fitBounds", [bbox]);
    	}

    	function flyTo(destination) {
    		queue.send("flyTo", [destination]);
    	}

    	function resize() {
    		queue.send("resize");
    	}

    	function getMap() {
    		return map;
    	}

    	function getMapbox() {
    		return mapbox;
    	}

    	function onAvailable() {
    		window.mapboxgl.accessToken = accessToken;
    		mapbox = window.mapboxgl;
    		const optionsWithDefaults = Object.assign({ container, style }, options);
    		const el = new mapbox.Map(optionsWithDefaults);
    		el.on("dragend", () => dispatch("recentre", { center: el.getCenter() }));

    		el.on("load", () => {
    			$$invalidate(0, map = el);
    			queue.start();
    			dispatch("ready");
    		});
    	}

    	function worker(cmd, cb) {
    		const [command, params] = cmd;
    		map[command].apply(map, params);
    		cb(null);
    	}

    	onMount(async () => {
    		queue = new EventQueue(worker);

    		loader(
    			[
    				{
    					type: "script",
    					url: `//api.mapbox.com/mapbox-gl-js/${version}/mapbox-gl.js`
    				},
    				{
    					type: "style",
    					url: `//api.mapbox.com/mapbox-gl-js/${version}/mapbox-gl.css`
    				}
    			],
    			() => !!window.mapboxgl,
    			onAvailable
    		);

    		return () => {
    			queue.stop();
    			map.remove();
    		};
    	});

    	const writable_props = ["map", "version", "options", "accessToken", "style"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Map", $$slots, ['default']);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			container = $$value;
    			$$invalidate(1, container);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("map" in $$props) $$invalidate(0, map = $$props.map);
    		if ("version" in $$props) $$invalidate(2, version = $$props.version);
    		if ("options" in $$props) $$invalidate(3, options = $$props.options);
    		if ("accessToken" in $$props) $$invalidate(4, accessToken = $$props.accessToken);
    		if ("style" in $$props) $$invalidate(5, style = $$props.style);
    		if ("$$scope" in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		loader,
    		onMount,
    		createEventDispatcher,
    		setContext,
    		contextKey,
    		EventQueue,
    		dispatch,
    		map,
    		version,
    		container,
    		mapbox,
    		queue,
    		options,
    		accessToken,
    		style,
    		setCenter,
    		fitBounds,
    		flyTo,
    		resize,
    		getMap,
    		getMapbox,
    		onAvailable,
    		worker
    	});

    	$$self.$inject_state = $$props => {
    		if ("map" in $$props) $$invalidate(0, map = $$props.map);
    		if ("version" in $$props) $$invalidate(2, version = $$props.version);
    		if ("container" in $$props) $$invalidate(1, container = $$props.container);
    		if ("mapbox" in $$props) mapbox = $$props.mapbox;
    		if ("queue" in $$props) queue = $$props.queue;
    		if ("options" in $$props) $$invalidate(3, options = $$props.options);
    		if ("accessToken" in $$props) $$invalidate(4, accessToken = $$props.accessToken);
    		if ("style" in $$props) $$invalidate(5, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		map,
    		container,
    		version,
    		options,
    		accessToken,
    		style,
    		setCenter,
    		fitBounds,
    		flyTo,
    		resize,
    		getMap,
    		getMapbox,
    		$$scope,
    		$$slots,
    		div_binding
    	];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			map: 0,
    			version: 2,
    			options: 3,
    			accessToken: 4,
    			style: 5,
    			setCenter: 6,
    			fitBounds: 7,
    			flyTo: 8,
    			resize: 9,
    			getMap: 10,
    			getMapbox: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*accessToken*/ ctx[4] === undefined && !("accessToken" in props)) {
    			console.warn("<Map> was created without expected prop 'accessToken'");
    		}
    	}

    	get map() {
    		throw new Error("<Map>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set map(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get version() {
    		throw new Error("<Map>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Map>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accessToken() {
    		throw new Error("<Map>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessToken(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Map>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setCenter() {
    		return this.$$.ctx[6];
    	}

    	set setCenter(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fitBounds() {
    		return this.$$.ctx[7];
    	}

    	set fitBounds(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flyTo() {
    		return this.$$.ctx[8];
    	}

    	set flyTo(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resize() {
    		return this.$$.ctx[9];
    	}

    	set resize(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getMap() {
    		return this.$$.ctx[10];
    	}

    	set getMap(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getMapbox() {
    		return this.$$.ctx[11];
    	}

    	set getMapbox(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@beyonk/svelte-mapbox/src/Marker.svelte generated by Svelte v3.24.0 */

    function create_fragment$2(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    function randomColour() {
    	return Math.round(Math.random() * 255);
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const { getMap, getMapbox } = getContext(contextKey);
    	const map = getMap();
    	const mapbox = getMapbox();
    	let { lat } = $$props;
    	let { lng } = $$props;
    	let { label = "Marker" } = $$props;
    	let { popupClassName = "beyonk-mapbox-popup" } = $$props;
    	let { color = randomColour() } = $$props;
    	let marker = null;

    	onMount(() => {
    		const popup = new mapbox.Popup({ offset: 25, className: popupClassName }).setText(label);
    		marker = new mapbox.Marker({ color }).setLngLat([lng, lat]).setPopup(popup).addTo(map);
    		return () => marker.remove();
    	});

    	function getMarker() {
    		return marker;
    	}

    	const writable_props = ["lat", "lng", "label", "popupClassName", "color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Marker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Marker", $$slots, []);

    	$$self.$set = $$props => {
    		if ("lat" in $$props) $$invalidate(0, lat = $$props.lat);
    		if ("lng" in $$props) $$invalidate(1, lng = $$props.lng);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("popupClassName" in $$props) $$invalidate(3, popupClassName = $$props.popupClassName);
    		if ("color" in $$props) $$invalidate(4, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		contextKey,
    		getMap,
    		getMapbox,
    		map,
    		mapbox,
    		randomColour,
    		lat,
    		lng,
    		label,
    		popupClassName,
    		color,
    		marker,
    		getMarker
    	});

    	$$self.$inject_state = $$props => {
    		if ("lat" in $$props) $$invalidate(0, lat = $$props.lat);
    		if ("lng" in $$props) $$invalidate(1, lng = $$props.lng);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("popupClassName" in $$props) $$invalidate(3, popupClassName = $$props.popupClassName);
    		if ("color" in $$props) $$invalidate(4, color = $$props.color);
    		if ("marker" in $$props) marker = $$props.marker;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lat, lng, label, popupClassName, color, getMarker];
    }

    class Marker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			lat: 0,
    			lng: 1,
    			label: 2,
    			popupClassName: 3,
    			color: 4,
    			getMarker: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Marker",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lat*/ ctx[0] === undefined && !("lat" in props)) {
    			console.warn("<Marker> was created without expected prop 'lat'");
    		}

    		if (/*lng*/ ctx[1] === undefined && !("lng" in props)) {
    			console.warn("<Marker> was created without expected prop 'lng'");
    		}
    	}

    	get lat() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lat(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lng() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lng(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get popupClassName() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set popupClassName(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Marker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getMarker() {
    		return this.$$.ctx[5];
    	}

    	set getMarker(value) {
    		throw new Error("<Marker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // for map
    const accessToken =
        'pk.eyJ1IjoiYWNlYnVsc2siLCJhIjoiY2tpYW93dmRsMDU4bjJzcWZqaHl2aGVvMCJ9.GFkPep4T-Yir4Q0pRPTbDA';

    // coordinates for mapping
    const listItems = [
        {
            name: "Plummer Hut",
            elevation: 2680,
            coords: [-125.16500, 51.37333],
            lon: -125.16500,
            lat: 51.37333
        },
        {
            name: "Klinaklini",
            elevation: 1532,
            coords: [-125.77, 51.38],
            lon: -125.77,
            lat: 51.38
        },
        {
            name: "Homathko",
            elevation: 1481,
            coords: [-124.95, 51.102],
            lon: -124.95,
            lat: 51.102
        },
        {
            name: "Perseverance",
            elevation: 970,
            coords: [-125.131, 49.594],
            lon: -125.131,
            lat: 49.594
        },
        {
            name: "Upper Cruickshank",
            elevation: 1348,
            coords: [-125.360990, 49.668914],
            lon: -125.360990,
            lat: 49.668914
        },
        {
            name: "Upper Skeena",
            elevation: 1546,
            coords: [-127.65730, 56.53839],
            lon: -127.65730,
            lat: 56.53839
        }
    ];

    /* src/Images.svelte generated by Svelte v3.24.0 */
    const file$2 = "src/Images.svelte";

    // (337:6) <Map         {accessToken}         style="mapbox://styles/mapbox/outdoors-v11"         bind:this={mapComponent}         on:ready={onReady}>
    function create_default_slot(ctx) {
    	let marker0;
    	let t0;
    	let marker1;
    	let t1;
    	let marker2;
    	let t2;
    	let marker3;
    	let t3;
    	let marker4;
    	let t4;
    	let marker5;
    	let current;

    	marker0 = new Marker({
    			props: {
    				lat: listItems[0].lat,
    				lng: listItems[0].lon,
    				label: listItems[0].name
    			},
    			$$inline: true
    		});

    	marker1 = new Marker({
    			props: {
    				lat: listItems[1].lat,
    				lng: listItems[1].lon,
    				label: listItems[1].name
    			},
    			$$inline: true
    		});

    	marker2 = new Marker({
    			props: {
    				lat: listItems[2].lat,
    				lng: listItems[2].lon,
    				label: listItems[2].name
    			},
    			$$inline: true
    		});

    	marker3 = new Marker({
    			props: {
    				lat: listItems[3].lat,
    				lng: listItems[3].lon,
    				label: listItems[3].name
    			},
    			$$inline: true
    		});

    	marker4 = new Marker({
    			props: {
    				lat: listItems[4].lat,
    				lng: listItems[4].lon,
    				label: listItems[4].name
    			},
    			$$inline: true
    		});

    	marker5 = new Marker({
    			props: {
    				lat: listItems[5].lat,
    				lng: listItems[5].lon,
    				label: listItems[5].name
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(marker0.$$.fragment);
    			t0 = space();
    			create_component(marker1.$$.fragment);
    			t1 = space();
    			create_component(marker2.$$.fragment);
    			t2 = space();
    			create_component(marker3.$$.fragment);
    			t3 = space();
    			create_component(marker4.$$.fragment);
    			t4 = space();
    			create_component(marker5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(marker0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(marker1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(marker2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(marker3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(marker4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(marker5, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marker0.$$.fragment, local);
    			transition_in(marker1.$$.fragment, local);
    			transition_in(marker2.$$.fragment, local);
    			transition_in(marker3.$$.fragment, local);
    			transition_in(marker4.$$.fragment, local);
    			transition_in(marker5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marker0.$$.fragment, local);
    			transition_out(marker1.$$.fragment, local);
    			transition_out(marker2.$$.fragment, local);
    			transition_out(marker3.$$.fragment, local);
    			transition_out(marker4.$$.fragment, local);
    			transition_out(marker5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(marker0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(marker1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(marker2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(marker3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(marker4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(marker5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(337:6) <Map         {accessToken}         style=\\\"mapbox://styles/mapbox/outdoors-v11\\\"         bind:this={mapComponent}         on:ready={onReady}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let t6;
    	let button3;
    	let t8;
    	let button4;
    	let t10;
    	let button5;
    	let t12;
    	let div7;
    	let div5;
    	let div4;
    	let div3;
    	let figure;
    	let p;
    	let t13;
    	let t14;
    	let br0;
    	let t15;
    	let t16;
    	let br1;
    	let t17;
    	let t18;
    	let br2;
    	let t19;
    	let t20_value = /*$images*/ ctx[6][/*$slide_id*/ ctx[4]] + "";
    	let t20;
    	let t21;
    	let image;
    	let t22;
    	let div2;
    	let input;
    	let t23;
    	let br3;
    	let t24;
    	let button6;
    	let t26;
    	let button7;
    	let t28;
    	let div6;
    	let map;
    	let current;
    	let mounted;
    	let dispose;

    	image = new Image({
    			props: {
    				image: /*$images*/ ctx[6][/*$slide_id*/ ctx[4]]
    			},
    			$$inline: true
    		});

    	let map_props = {
    		accessToken,
    		style: "mapbox://styles/mapbox/outdoors-v11",
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	map = new Map$1({ props: map_props, $$inline: true });
    	/*map_binding*/ ctx[17](map);
    	map.$on("ready", /*onReady*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
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
    			button4 = element("button");
    			button4.textContent = "Cruickshank";
    			t10 = space();
    			button5 = element("button");
    			button5.textContent = "Skeena";
    			t12 = space();
    			div7 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			figure = element("figure");
    			p = element("p");
    			t13 = text("Station: ");
    			t14 = text(/*currentCam*/ ctx[1]);
    			br0 = element("br");
    			t15 = text("\n            Coordinates: ");
    			t16 = text(/*curCoords*/ ctx[3]);
    			br1 = element("br");
    			t17 = text("\n            Elevation: ");
    			t18 = text(/*curElevation*/ ctx[2]);
    			br2 = element("br");
    			t19 = text("\n            Filename: ");
    			t20 = text(t20_value);
    			t21 = space();
    			create_component(image.$$.fragment);
    			t22 = space();
    			div2 = element("div");
    			input = element("input");
    			t23 = space();
    			br3 = element("br");
    			t24 = space();
    			button6 = element("button");
    			button6.textContent = "Previous";
    			t26 = space();
    			button7 = element("button");
    			button7.textContent = "Next";
    			t28 = space();
    			div6 = element("div");
    			create_component(map.$$.fragment);
    			if (img.src !== (img_src_value = "images/chrl-logo-text.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "CHRL logo");
    			set_style(img, "width", "250px");
    			set_style(img, "height", "75x");
    			add_location(img, file$2, 283, 4, 8960);
    			attr_dev(a, "href", "http://www.viu-hydromet-wx.ca/");
    			attr_dev(a, "class", "logo");
    			add_location(a, file$2, 282, 2, 8901);
    			attr_dev(div0, "class", "header");
    			add_location(div0, file$2, 281, 0, 8878);
    			add_location(button0, file$2, 291, 2, 9089);
    			add_location(button1, file$2, 293, 2, 9135);
    			add_location(button2, file$2, 295, 2, 9185);
    			add_location(button3, file$2, 297, 2, 9234);
    			add_location(button4, file$2, 299, 2, 9286);
    			add_location(button5, file$2, 301, 2, 9338);
    			add_location(div1, file$2, 290, 0, 9081);
    			add_location(br0, file$2, 313, 33, 9689);
    			add_location(br1, file$2, 314, 36, 9732);
    			add_location(br2, file$2, 315, 37, 9776);
    			attr_dev(p, "class", "filename svelte-ynoo9f");
    			add_location(p, file$2, 312, 10, 9634);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", /*$numImages*/ ctx[5]);
    			attr_dev(input, "step", "1");
    			attr_dev(input, "class", "slider svelte-ynoo9f");
    			add_location(input, file$2, 320, 12, 9939);
    			add_location(br3, file$2, 327, 12, 10130);
    			add_location(button6, file$2, 328, 12, 10149);
    			add_location(button7, file$2, 329, 12, 10210);
    			attr_dev(div2, "class", "rangecontainer svelte-ynoo9f");
    			add_location(div2, file$2, 319, 10, 9898);
    			attr_dev(figure, "class", "slideshow svelte-ynoo9f");
    			add_location(figure, file$2, 311, 8, 9597);
    			attr_dev(div3, "class", "body svelte-ynoo9f");
    			set_style(div3, "text-align", "center");
    			add_location(div3, file$2, 310, 6, 9543);
    			attr_dev(div4, "class", "mainimage svelte-ynoo9f");
    			add_location(div4, file$2, 309, 6, 9513);
    			attr_dev(div5, "id", "one");
    			attr_dev(div5, "class", "svelte-ynoo9f");
    			add_location(div5, file$2, 308, 2, 9492);
    			attr_dev(div6, "id", "two");
    			attr_dev(div6, "class", "svelte-ynoo9f");
    			add_location(div6, file$2, 335, 2, 10323);
    			attr_dev(div7, "class", "wrapper svelte-ynoo9f");
    			add_location(div7, file$2, 307, 0, 9468);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, a);
    			append_dev(a, img);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(div1, t2);
    			append_dev(div1, button1);
    			append_dev(div1, t4);
    			append_dev(div1, button2);
    			append_dev(div1, t6);
    			append_dev(div1, button3);
    			append_dev(div1, t8);
    			append_dev(div1, button4);
    			append_dev(div1, t10);
    			append_dev(div1, button5);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, figure);
    			append_dev(figure, p);
    			append_dev(p, t13);
    			append_dev(p, t14);
    			append_dev(p, br0);
    			append_dev(p, t15);
    			append_dev(p, t16);
    			append_dev(p, br1);
    			append_dev(p, t17);
    			append_dev(p, t18);
    			append_dev(p, br2);
    			append_dev(p, t19);
    			append_dev(p, t20);
    			append_dev(figure, t21);
    			mount_component(image, figure, null);
    			append_dev(figure, t22);
    			append_dev(figure, div2);
    			append_dev(div2, input);
    			set_input_value(input, /*$slide_id*/ ctx[4]);
    			append_dev(div2, t23);
    			append_dev(div2, br3);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(div7, t28);
    			append_dev(div7, div6);
    			mount_component(map, div6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*plum*/ ctx[10], false, false, false),
    					listen_dev(button1, "click", /*klina*/ ctx[11], false, false, false),
    					listen_dev(button2, "click", /*homath*/ ctx[12], false, false, false),
    					listen_dev(button3, "click", /*perse*/ ctx[13], false, false, false),
    					listen_dev(button4, "click", /*cruick*/ ctx[14], false, false, false),
    					listen_dev(button5, "click", /*skeena*/ ctx[15], false, false, false),
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[16]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[16]),
    					listen_dev(button6, "click", /*prevImage*/ ctx[8], false, false, false),
    					listen_dev(button7, "click", /*nextImage*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*currentCam*/ 2) set_data_dev(t14, /*currentCam*/ ctx[1]);
    			if (!current || dirty & /*curCoords*/ 8) set_data_dev(t16, /*curCoords*/ ctx[3]);
    			if (!current || dirty & /*curElevation*/ 4) set_data_dev(t18, /*curElevation*/ ctx[2]);
    			if ((!current || dirty & /*$images, $slide_id*/ 80) && t20_value !== (t20_value = /*$images*/ ctx[6][/*$slide_id*/ ctx[4]] + "")) set_data_dev(t20, t20_value);
    			const image_changes = {};
    			if (dirty & /*$images, $slide_id*/ 80) image_changes.image = /*$images*/ ctx[6][/*$slide_id*/ ctx[4]];
    			image.$set(image_changes);

    			if (!current || dirty & /*$numImages*/ 32) {
    				attr_dev(input, "max", /*$numImages*/ ctx[5]);
    			}

    			if (dirty & /*$slide_id*/ 16) {
    				set_input_value(input, /*$slide_id*/ ctx[4]);
    			}

    			const map_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				map_changes.$$scope = { dirty, ctx };
    			}

    			map.$set(map_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			transition_in(map.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			transition_out(map.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div7);
    			destroy_component(image);
    			/*map_binding*/ ctx[17](null);
    			destroy_component(map);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $slide_id;
    	let $numImages;
    	let $images;
    	validate_store(slide_id, "slide_id");
    	component_subscribe($$self, slide_id, $$value => $$invalidate(4, $slide_id = $$value));
    	validate_store(numImages, "numImages");
    	component_subscribe($$self, numImages, $$value => $$invalidate(5, $numImages = $$value));
    	validate_store(images, "images");
    	component_subscribe($$self, images, $$value => $$invalidate(6, $images = $$value));
    	let mapComponent;
    	let currentCam = "Plummer Hut";
    	let curDate = "";
    	let curTime = "";
    	let curDateTime = "";
    	let curElevation = "";
    	let curCoords = "";

    	// let reactDateTime = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");
    	function onReady() {
    		mapComponent.setCenter([-126, 53.5], 4);
    	}

    	// functions for next and previous buttons
    	function prevImage() {
    		if ($slide_id > 0) {
    			set_store_value(slide_id, $slide_id--, $slide_id);
    		}
    	}

    	function nextImage() {
    		if ($slide_id < $numImages) {
    			set_store_value(slide_id, $slide_id++, $slide_id);
    		}
    	}

    	// initiate reactive functions for each station
    	onMount(async () => {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		set_store_value(slide_id, $slide_id = $numImages);
    		$$invalidate(1, currentCam = "Plummer Hut");

    		curDate = [
    			$images[$slide_id].slice(-18, -14),
    			$images[$slide_id].slice(-14, -12),
    			$images[$slide_id].slice(-12, -10)
    		].join("-");

    		curTime = [
    			$images[$slide_id].slice(-10, -8),
    			$images[$slide_id].slice(-8, -6),
    			$images[$slide_id].slice(-6, -4)
    		].join(":");

    		curDateTime = [curDate, curTime, "UTC"].join(" ");
    		$$invalidate(2, curElevation = [listItems[0].elevation, " m"].join(""));
    		$$invalidate(3, curCoords = listItems[0].coords);
    	});

    	async function plum() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		set_store_value(slide_id, $slide_id = $numImages);
    		mapComponent.setCenter(listItems[0].coords, 9);
    		$$invalidate(1, currentCam = "Plummer Hut");

    		curDate = [
    			$images[$slide_id].slice(-18, -14),
    			$images[$slide_id].slice(-14, -12),
    			$images[$slide_id].slice(-12, -10)
    		].join("-");

    		curTime = [
    			$images[$slide_id].slice(-10, -8),
    			$images[$slide_id].slice(-8, -6),
    			$images[$slide_id].slice(-6, -4)
    		].join(":");

    		curDateTime = [curDate, curTime, "UTC"].join(" ");
    		$$invalidate(2, curElevation = [listItems[0].elevation, " m"].join(""));
    		$$invalidate(3, curCoords = listItems[0].coords);
    	}

    	async function klina() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=klinaklini";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		set_store_value(slide_id, $slide_id = $numImages);
    		mapComponent.setCenter(listItems[1].coords, 9);
    		$$invalidate(1, currentCam = "Klinaklini");

    		curDate = [
    			$images[$slide_id].slice(-18, -14),
    			$images[$slide_id].slice(-14, -12),
    			$images[$slide_id].slice(-12, -10)
    		].join("-");

    		curTime = [
    			$images[$slide_id].slice(-10, -8),
    			$images[$slide_id].slice(-8, -6),
    			$images[$slide_id].slice(-6, -4)
    		].join(":");

    		curDateTime = [curDate, curTime, "UTC"].join(" ");
    		$$invalidate(2, curElevation = [listItems[1].elevation, " m"].join(""));
    		$$invalidate(3, curCoords = listItems[1].coords);
    	}

    	async function homath() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=homathko";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		set_store_value(slide_id, $slide_id = $numImages);
    		mapComponent.setCenter(listItems[2].coords, 9);
    		$$invalidate(1, currentCam = "Homathko");

    		curDate = [
    			$images[$slide_id].slice(-18, -14),
    			$images[$slide_id].slice(-14, -12),
    			$images[$slide_id].slice(-12, -10)
    		].join("-");

    		curTime = [
    			$images[$slide_id].slice(-10, -8),
    			$images[$slide_id].slice(-8, -6),
    			$images[$slide_id].slice(-6, -4)
    		].join(":");

    		curDateTime = [curDate, curTime, "UTC"].join(" ");
    		$$invalidate(2, curElevation = [listItems[2].elevation, " m"].join(""));
    		$$invalidate(3, curCoords = listItems[2].coords);
    	}

    	async function perse() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=perseverance";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		set_store_value(slide_id, $slide_id = $numImages);
    		mapComponent.setCenter(listItems[3].coords, 9);
    		$$invalidate(1, currentCam = "Perseverance");

    		curDate = [
    			$images[$slide_id].slice(-18, -14),
    			$images[$slide_id].slice(-14, -12),
    			$images[$slide_id].slice(-12, -10)
    		].join("-");

    		curTime = [
    			$images[$slide_id].slice(-10, -8),
    			$images[$slide_id].slice(-8, -6),
    			$images[$slide_id].slice(-6, -4)
    		].join(":");

    		curDateTime = [curDate, curTime, "UTC"].join(" ");
    		$$invalidate(2, curElevation = [listItems[3].elevation, " m"].join(""));
    		$$invalidate(3, curCoords = listItems[3].coords);
    	}

    	async function cruick() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=cruickshank";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		set_store_value(slide_id, $slide_id = $numImages);
    		mapComponent.setCenter(listItems[4].coords, 9);
    		$$invalidate(1, currentCam = "Upper Cruickshank");

    		curDate = [
    			$images[$slide_id].slice(-18, -14),
    			$images[$slide_id].slice(-14, -12),
    			$images[$slide_id].slice(-12, -10)
    		].join("-");

    		curTime = [
    			$images[$slide_id].slice(-10, -8),
    			$images[$slide_id].slice(-8, -6),
    			$images[$slide_id].slice(-6, -4)
    		].join(":");

    		curDateTime = [curDate, curTime, "UTC"].join(" ");
    		$$invalidate(2, curElevation = [listItems[4].elevation, " m"].join(""));
    		$$invalidate(3, curCoords = listItems[4].coords);
    	}

    	async function skeena() {
    		const url = "http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=skeena";
    		let res = await fetch(url);
    		res = await res.json();
    		set_store_value(images, $images = res);
    		set_store_value(numImages, $numImages = res.length - 1);
    		set_store_value(slide_id, $slide_id = $numImages);
    		mapComponent.setCenter(listItems[5].coords, 5);
    		$$invalidate(1, currentCam = "Upper Skeena");

    		curDate = [
    			$images[$slide_id].slice(-18, -14),
    			$images[$slide_id].slice(-14, -12),
    			$images[$slide_id].slice(-12, -10)
    		].join("-");

    		curTime = [
    			$images[$slide_id].slice(-10, -8),
    			$images[$slide_id].slice(-8, -6),
    			$images[$slide_id].slice(-6, -4)
    		].join(":");

    		curDateTime = [curDate, curTime, "UTC"].join(" ");
    		$$invalidate(2, curElevation = [listItems[5].elevation, " m"].join(""));
    		$$invalidate(3, curCoords = listItems[5].coords);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Images> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Images", $$slots, []);

    	function input_change_input_handler() {
    		$slide_id = to_number(this.value);
    		slide_id.set($slide_id);
    	}

    	function map_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			mapComponent = $$value;
    			$$invalidate(0, mapComponent);
    		});
    	}

    	$$self.$capture_state = () => ({
    		images,
    		numImages,
    		slide_id,
    		onMount,
    		Image,
    		Map: Map$1,
    		Marker,
    		accessToken,
    		listItems,
    		mapComponent,
    		currentCam,
    		curDate,
    		curTime,
    		curDateTime,
    		curElevation,
    		curCoords,
    		onReady,
    		prevImage,
    		nextImage,
    		plum,
    		klina,
    		homath,
    		perse,
    		cruick,
    		skeena,
    		$slide_id,
    		$numImages,
    		$images
    	});

    	$$self.$inject_state = $$props => {
    		if ("mapComponent" in $$props) $$invalidate(0, mapComponent = $$props.mapComponent);
    		if ("currentCam" in $$props) $$invalidate(1, currentCam = $$props.currentCam);
    		if ("curDate" in $$props) curDate = $$props.curDate;
    		if ("curTime" in $$props) curTime = $$props.curTime;
    		if ("curDateTime" in $$props) curDateTime = $$props.curDateTime;
    		if ("curElevation" in $$props) $$invalidate(2, curElevation = $$props.curElevation);
    		if ("curCoords" in $$props) $$invalidate(3, curCoords = $$props.curCoords);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mapComponent,
    		currentCam,
    		curElevation,
    		curCoords,
    		$slide_id,
    		$numImages,
    		$images,
    		onReady,
    		prevImage,
    		nextImage,
    		plum,
    		klina,
    		homath,
    		perse,
    		cruick,
    		skeena,
    		input_change_input_handler,
    		map_binding
    	];
    }

    class Images extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Images",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$3 = "src/App.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let images;
    	let current;
    	images = new Images({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(images.$$.fragment);
    			attr_dev(div, "class", "mainimage");
    			add_location(div, file$3, 5, 0, 58);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
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
