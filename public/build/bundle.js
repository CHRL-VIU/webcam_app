var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function o(e){e.forEach(t)}function s(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(t,n,o){t.$$.on_destroy.push(function(t,...n){if(null==t)return e;const o=t.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(n,o))}function l(e,t,n,o){return e[1]&&o?function(e,t){for(const n in t)e[n]=t[n];return e}(n.ctx.slice(),e[1](o(t))):n.ctx}function c(e,t,n,o,s,r,a){const c=function(e,t,n,o){if(e[2]&&o){const s=e[2](o(n));if(void 0===t.dirty)return s;if("object"==typeof s){const e=[],n=Math.max(t.dirty.length,s.length);for(let o=0;o<n;o+=1)e[o]=t.dirty[o]|s[o];return e}return t.dirty|s}return t.dirty}(t,o,s,r);if(c){const s=l(t,n,o,a);e.p(s,c)}}function i(e,t,n=t){return e.set(n),t}function u(e,t){e.appendChild(t)}function f(e,t,n){e.insertBefore(t,n||null)}function p(e){e.parentNode.removeChild(e)}function m(e){return document.createElement(e)}function d(e){return document.createTextNode(e)}function g(){return d(" ")}function h(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function $(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function v(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function w(e,t){e.value=null==t?"":t}let b;function x(e){b=e}function y(){if(!b)throw new Error("Function called outside component initialization");return b}function k(e){y().$$.on_mount.push(e)}function j(){const e=y();return(t,n)=>{const o=e.$$.callbacks[t];if(o){const s=function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(t,n);o.slice().forEach(t=>{t.call(e,s)})}}}const C=[],_=[],M=[],N=[],T=Promise.resolve();let E=!1;function P(e){M.push(e)}let H=!1;const q=new Set;function L(){if(!H){H=!0;do{for(let e=0;e<C.length;e+=1){const t=C[e];x(t),A(t.$$)}for(C.length=0;_.length;)_.pop()();for(let e=0;e<M.length;e+=1){const t=M[e];q.has(t)||(q.add(t),t())}M.length=0}while(C.length);for(;N.length;)N.pop()();E=!1,H=!1,q.clear()}}function A(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(P)}}const S=new Set;let z;function U(e,t){e&&e.i&&(S.delete(e),e.i(t))}function Y(e,t,n,o){if(e&&e.o){if(S.has(e))return;S.add(e),z.c.push(()=>{S.delete(e),o&&(n&&e.d(1),o())}),e.o(t)}}function B(e){e&&e.c()}function J(e,n,r){const{fragment:a,on_mount:l,on_destroy:c,after_update:i}=e.$$;a&&a.m(n,r),P(()=>{const n=l.map(t).filter(s);c?c.push(...n):o(n),e.$$.on_mount=[]}),i.forEach(P)}function O(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function D(e,t){-1===e.$$.dirty[0]&&(C.push(e),E||(E=!0,T.then(L)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function F(t,s,r,a,l,c,i=[-1]){const u=b;x(t);const f=s.props||{},m=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:l,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:n(),dirty:i};let d=!1;if(m.ctx=r?r(t,f,(e,n,...o)=>{const s=o.length?o[0]:n;return m.ctx&&l(m.ctx[e],m.ctx[e]=s)&&(m.bound[e]&&m.bound[e](s),d&&D(t,e)),n}):[],m.update(),d=!0,o(m.before_update),m.fragment=!!a&&a(m.ctx),s.target){if(s.hydrate){const e=function(e){return Array.from(e.childNodes)}(s.target);m.fragment&&m.fragment.l(e),e.forEach(p)}else m.fragment&&m.fragment.c();s.intro&&U(t.$$.fragment),J(t,s.target,s.anchor),L()}x(u)}class I{$destroy(){O(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}const K=[];function R(t,n=e){let o;const s=[];function a(e){if(r(t,e)&&(t=e,o)){const e=!K.length;for(let e=0;e<s.length;e+=1){const n=s[e];n[1](),K.push(n,t)}if(e){for(let e=0;e<K.length;e+=2)K[e][0](K[e+1]);K.length=0}}}return{set:a,update:function(e){a(e(t))},subscribe:function(r,l=e){const c=[r,l];return s.push(c),1===s.length&&(o=n(a)||e),r(t),()=>{const e=s.indexOf(c);-1!==e&&s.splice(e,1),0===s.length&&(o(),o=null)}}}}let W=R([]);const G=R(0),Q=R(0);function V(t){let n,o;return{c(){n=m("img"),n.src!==(o=""+(Z+t[0]))&&$(n,"src",o),$(n,"alt","slideshow"),$(n,"class","svelte-11wgpvo")},m(e,t){f(e,n,t)},p(e,[t]){1&t&&n.src!==(o=""+(Z+e[0]))&&$(n,"src",o)},i:e,o:e,d(e){e&&p(n)}}}const Z="http://www.viu-hydromet-wx.ca/webcam_images/";function X(e,t,n){let{image:o={}}=t;return e.$set=e=>{"image"in e&&n(0,o=e.image)},[o]}class ee extends I{constructor(e){super(),F(this,e,X,V,r,{image:0})}}const te={};var ne=function(e){var t=new e,n=t;return{get:function(){var o=t;return o.next?t=o.next:(t=new e,n=t),o.next=null,o},release:function(e){n.next=e,n=e}}};function oe(){}function se(){this.value=null,this.callback=oe,this.next=null,this.release=oe,this.context=null;var e=this;this.worked=function(t,n){var o=e.callback;e.value=null,e.callback=oe,o.call(e.context,t,n),e.release(e)}}var re=function(e,t,n){"function"==typeof e&&(n=t,t=e,e=null);var o=ne(se),s=null,r=null,a=0,l={push:function(n,i){var u=o.get();u.context=e,u.release=c,u.value=n,u.callback=i||oe,a===l.concurrency||l.paused?r?(r.next=u,r=u):(s=u,r=u,l.saturated()):(a++,t.call(e,u.value,u.worked))},drain:oe,saturated:oe,pause:function(){l.paused=!0},paused:!1,concurrency:n,running:function(){return a},resume:function(){if(!l.paused)return;l.paused=!1;for(var e=0;e<l.concurrency;e++)a++,c()},idle:function(){return 0===a&&0===l.length()},length:function(){var e=s,t=0;for(;e;)e=e.next,t++;return t},getQueue:function(){var e=s,t=[];for(;e;)t.push(e.value),e=e.next;return t},unshift:function(n,i){var u=o.get();u.context=e,u.release=c,u.value=n,u.callback=i||oe,a===l.concurrency||l.paused?s?(u.next=s,s=u):(s=u,r=u,l.saturated()):(a++,t.call(e,u.value,u.worked))},empty:oe,kill:function(){s=null,r=null,l.drain=oe},killAndDrain:function(){s=null,r=null,l.drain(),l.drain=oe}};return l;function c(n){n&&o.release(n);var c=s;c?l.paused?a--:(r===s&&(r=null),s=c.next,c.next=null,t.call(e,c.value,c.worked),null===r&&l.empty()):0==--a&&l.drain()}};class ae{constructor(e){this.queue=new re(this,e,1),this.queue.pause()}send(e,t=[]){this.queue.push([e,t])}start(){this.queue.resume()}stop(){this.queue.kill()}}function le(e){let t;const n=e[13].default,o=function(e,t,n,o){if(e){const s=l(e,t,n,o);return e[0](s)}}(n,e,e[12],null);return{c(){o&&o.c()},m(e,n){o&&o.m(e,n),t=!0},p(e,t){o&&o.p&&4096&t&&c(o,n,e,e[12],t,null,null)},i(e){t||(U(o,e),t=!0)},o(e){Y(o,e),t=!1},d(e){o&&o.d(e)}}}function ce(e){let t,n,s=e[0]&&le(e);return{c(){t=m("div"),s&&s.c(),$(t,"class","svelte-1kuj9kb")},m(o,r){f(o,t,r),s&&s.m(t,null),e[14](t),n=!0},p(e,[n]){e[0]?s?(s.p(e,n),1&n&&U(s,1)):(s=le(e),s.c(),U(s,1),s.m(t,null)):s&&(z={r:0,c:[],p:z},Y(s,1,1,()=>{s=null}),z.r||o(z.c),z=z.p)},i(e){n||(U(s),n=!0)},o(e){Y(s),n=!1},d(n){n&&p(t),s&&s.d(),e[14](null)}}}function ie(e,t,n){var o,s;o=te,s={getMap:()=>i,getMapbox:()=>l},y().$$.context.set(o,s);const r=j();let a,l,c,{map:i=null}=t,{version:u="v1.11.0"}=t,{options:f={}}=t,{accessToken:p}=t,{style:m="mapbox://styles/mapbox/streets-v11"}=t;function d(){window.mapboxgl.accessToken=p,l=window.mapboxgl;const e=Object.assign({container:a,style:m},f),t=new l.Map(e);t.on("dragend",()=>r("recentre",{center:t.getCenter()})),t.on("load",()=>{n(0,i=t),c.start(),r("ready")})}function g(e,t){const[n,o]=e;i[n].apply(i,o),t(null)}k(async()=>(c=new ae(g),function(e,t,n){let o=e.length;function s(){o=--o,o<1&&n()}t()?n():e.forEach(({type:e,url:t,options:n={async:!0,defer:!0}})=>{const o="script"===e,r=document.createElement(o?"script":"link");o?(r.src=t,r.async=n.async,r.defer=n.defer):(r.rel="stylesheet",r.href=t),r.onload=s,document.body.appendChild(r)})}([{type:"script",url:`//api.mapbox.com/mapbox-gl-js/${u}/mapbox-gl.js`},{type:"style",url:`//api.mapbox.com/mapbox-gl-js/${u}/mapbox-gl.css`}],()=>!!window.mapboxgl,d),()=>{c.stop(),i.remove()}));let{$$slots:h={},$$scope:$}=t;return e.$set=e=>{"map"in e&&n(0,i=e.map),"version"in e&&n(2,u=e.version),"options"in e&&n(3,f=e.options),"accessToken"in e&&n(4,p=e.accessToken),"style"in e&&n(5,m=e.style),"$$scope"in e&&n(12,$=e.$$scope)},[i,a,u,f,p,m,function(e,t){c.send("setCenter",[e]),t&&Number.isInteger(t)&&c.send("setZoom",[t])},function(e){c.send("fitBounds",[e])},function(e){c.send("flyTo",[e])},function(){c.send("resize")},function(){return i},function(){return l},$,h,function(e){_[e?"unshift":"push"](()=>{a=e,n(1,a)})}]}class ue extends I{constructor(e){super(),F(this,e,ie,ce,r,{map:0,version:2,options:3,accessToken:4,style:5,setCenter:6,fitBounds:7,flyTo:8,resize:9,getMap:10,getMapbox:11})}get setCenter(){return this.$$.ctx[6]}get fitBounds(){return this.$$.ctx[7]}get flyTo(){return this.$$.ctx[8]}get resize(){return this.$$.ctx[9]}get getMap(){return this.$$.ctx[10]}get getMapbox(){return this.$$.ctx[11]}}function fe(){return Math.round(255*Math.random())}function pe(e,t,n){const{getMap:o,getMapbox:s}=(r=te,y().$$.context.get(r));var r;const a=o(),l=s();let{lat:c}=t,{lng:i}=t,{label:u="Marker"}=t,{popupClassName:f="beyonk-mapbox-popup"}=t,{color:p=fe()}=t,m=null;return k(()=>{const e=new l.Popup({offset:25,className:f}).setText(u);return m=new l.Marker({color:p}).setLngLat([i,c]).setPopup(e).addTo(a),()=>m.remove()}),e.$set=e=>{"lat"in e&&n(0,c=e.lat),"lng"in e&&n(1,i=e.lng),"label"in e&&n(2,u=e.label),"popupClassName"in e&&n(3,f=e.popupClassName),"color"in e&&n(4,p=e.color)},[c,i,u,f,p,function(){return m}]}class me extends I{constructor(e){super(),F(this,e,pe,null,r,{lat:0,lng:1,label:2,popupClassName:3,color:4,getMarker:5})}get getMarker(){return this.$$.ctx[5]}}const de=[{name:"Plummer Hut",elevation:2680,coords:[-125.165,51.37333],lon:-125.165,lat:51.37333},{name:"Klinaklini",elevation:1532,coords:[-125.77,51.38],lon:-125.77,lat:51.38},{name:"Homathko",elevation:1481,coords:[-124.95,51.102],lon:-124.95,lat:51.102},{name:"Perseverance",elevation:970,coords:[-125.131,49.594],lon:-125.131,lat:49.594},{name:"Upper Cruickshank",elevation:1348,coords:[-125.36099,49.668914],lon:-125.36099,lat:49.668914},{name:"Upper Skeena",elevation:1546,coords:[-127.6573,56.53839],lon:-127.6573,lat:56.53839}];function ge(t){let n,o,s,r,a,l,c,i,u,m,d,h;return n=new me({props:{lat:de[0].lat,lng:de[0].lon,label:de[0].name}}),s=new me({props:{lat:de[1].lat,lng:de[1].lon,label:de[1].name}}),a=new me({props:{lat:de[2].lat,lng:de[2].lon,label:de[2].name}}),c=new me({props:{lat:de[3].lat,lng:de[3].lon,label:de[3].name}}),u=new me({props:{lat:de[4].lat,lng:de[4].lon,label:de[4].name}}),d=new me({props:{lat:de[5].lat,lng:de[5].lon,label:de[5].name}}),{c(){B(n.$$.fragment),o=g(),B(s.$$.fragment),r=g(),B(a.$$.fragment),l=g(),B(c.$$.fragment),i=g(),B(u.$$.fragment),m=g(),B(d.$$.fragment)},m(e,t){J(n,e,t),f(e,o,t),J(s,e,t),f(e,r,t),J(a,e,t),f(e,l,t),J(c,e,t),f(e,i,t),J(u,e,t),f(e,m,t),J(d,e,t),h=!0},p:e,i(e){h||(U(n.$$.fragment,e),U(s.$$.fragment,e),U(a.$$.fragment,e),U(c.$$.fragment,e),U(u.$$.fragment,e),U(d.$$.fragment,e),h=!0)},o(e){Y(n.$$.fragment,e),Y(s.$$.fragment,e),Y(a.$$.fragment,e),Y(c.$$.fragment,e),Y(u.$$.fragment,e),Y(d.$$.fragment,e),h=!1},d(e){O(n,e),e&&p(o),O(s,e),e&&p(r),O(a,e),e&&p(l),O(c,e),e&&p(i),O(u,e),e&&p(m),O(d,e)}}}function he(e){let t,n,s,r,a,l,c,i,b,x,y,k,j,C,_,M,N,T,E,P,H,q,L,A,S,z,D,F,I,K,R,W,G,Q,V,Z,X,te,ne,oe,se,re,ae,le,ce,ie,fe,pe,me,de=e[6][e[4]]+"";return Q=new ee({props:{image:e[6][e[4]]}}),ie=new ue({props:{accessToken:"pk.eyJ1IjoiYWNlYnVsc2siLCJhIjoiY2tpYW93dmRsMDU4bjJzcWZqaHl2aGVvMCJ9.GFkPep4T-Yir4Q0pRPTbDA",style:"mapbox://styles/mapbox/outdoors-v11",$$slots:{default:[ge]},$$scope:{ctx:e}}}),e[17](ie),ie.$on("ready",e[7]),{c(){var o,u,f;t=m("div"),t.innerHTML='<a href="http://www.viu-hydromet-wx.ca/" class="logo"><img src="images/chrl-logo-text.png" alt="CHRL logo" style="width:250px;height:75x;"></a>',n=g(),s=m("div"),r=m("button"),r.textContent="Plummer",a=g(),l=m("button"),l.textContent="Klinaklini",c=g(),i=m("button"),i.textContent="Homathko",b=g(),x=m("button"),x.textContent="Perseverance",y=g(),k=m("button"),k.textContent="Cruickshank",j=g(),C=m("button"),C.textContent="Skeena",_=g(),M=m("div"),N=m("div"),T=m("div"),E=m("div"),P=m("figure"),H=m("p"),q=d("Station: "),L=d(e[1]),A=m("br"),S=d("\n            Coordinates: "),z=d(e[3]),D=m("br"),F=d("\n            Elevation: "),I=d(e[2]),K=m("br"),R=d("\n            Filename: "),W=d(de),G=g(),B(Q.$$.fragment),V=g(),Z=m("div"),X=m("input"),te=g(),ne=m("br"),oe=g(),se=m("button"),se.textContent="Previous",re=g(),ae=m("button"),ae.textContent="Next",le=g(),ce=m("div"),B(ie.$$.fragment),$(t,"class","header"),$(H,"class","filename svelte-ynoo9f"),$(X,"type","range"),$(X,"min","0"),$(X,"max",e[5]),$(X,"step","1"),$(X,"class","slider svelte-ynoo9f"),$(Z,"class","rangecontainer svelte-ynoo9f"),$(P,"class","slideshow svelte-ynoo9f"),$(E,"class","body svelte-ynoo9f"),o="text-align",u="center",E.style.setProperty(o,u,f?"important":""),$(T,"class","mainimage svelte-ynoo9f"),$(N,"id","one"),$(N,"class","svelte-ynoo9f"),$(ce,"id","two"),$(ce,"class","svelte-ynoo9f"),$(M,"class","wrapper svelte-ynoo9f")},m(o,p){f(o,t,p),f(o,n,p),f(o,s,p),u(s,r),u(s,a),u(s,l),u(s,c),u(s,i),u(s,b),u(s,x),u(s,y),u(s,k),u(s,j),u(s,C),f(o,_,p),f(o,M,p),u(M,N),u(N,T),u(T,E),u(E,P),u(P,H),u(H,q),u(H,L),u(H,A),u(H,S),u(H,z),u(H,D),u(H,F),u(H,I),u(H,K),u(H,R),u(H,W),u(P,G),J(Q,P,null),u(P,V),u(P,Z),u(Z,X),w(X,e[4]),u(Z,te),u(Z,ne),u(Z,oe),u(Z,se),u(Z,re),u(Z,ae),u(M,le),u(M,ce),J(ie,ce,null),fe=!0,pe||(me=[h(r,"click",e[10]),h(l,"click",e[11]),h(i,"click",e[12]),h(x,"click",e[13]),h(k,"click",e[14]),h(C,"click",e[15]),h(X,"change",e[16]),h(X,"input",e[16]),h(se,"click",e[8]),h(ae,"click",e[9])],pe=!0)},p(e,[t]){(!fe||2&t)&&v(L,e[1]),(!fe||8&t)&&v(z,e[3]),(!fe||4&t)&&v(I,e[2]),(!fe||80&t)&&de!==(de=e[6][e[4]]+"")&&v(W,de);const n={};80&t&&(n.image=e[6][e[4]]),Q.$set(n),(!fe||32&t)&&$(X,"max",e[5]),16&t&&w(X,e[4]);const o={};2097152&t&&(o.$$scope={dirty:t,ctx:e}),ie.$set(o)},i(e){fe||(U(Q.$$.fragment,e),U(ie.$$.fragment,e),fe=!0)},o(e){Y(Q.$$.fragment,e),Y(ie.$$.fragment,e),fe=!1},d(r){r&&p(t),r&&p(n),r&&p(s),r&&p(_),r&&p(M),O(Q),e[17](null),O(ie),pe=!1,o(me)}}}function $e(e,t,n){let o,s,r,l;a(e,Q,e=>n(4,o=e)),a(e,G,e=>n(5,s=e)),a(e,W,e=>n(6,r=e));let c="Plummer Hut",u="",f="",p="",m="";return k(async()=>{let e=await fetch("http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer");e=await e.json(),i(W,r=e),i(G,s=e.length-1),i(Q,o=s),n(1,c="Plummer Hut"),u=[r[o].slice(-18,-14),r[o].slice(-14,-12),r[o].slice(-12,-10)].join("-"),f=[r[o].slice(-10,-8),r[o].slice(-8,-6),r[o].slice(-6,-4)].join(":"),n(2,p=[de[0].elevation," m"].join("")),n(3,m=de[0].coords)}),[l,c,p,m,o,s,r,function(){l.setCenter([-126,53.5],4)},function(){o>0&&i(Q,o--,o)},function(){o<s&&i(Q,o++,o)},async function(){let e=await fetch("http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer");e=await e.json(),i(W,r=e),i(G,s=e.length-1),i(Q,o=s),l.setCenter(de[0].coords,9),n(1,c="Plummer Hut"),u=[r[o].slice(-18,-14),r[o].slice(-14,-12),r[o].slice(-12,-10)].join("-"),f=[r[o].slice(-10,-8),r[o].slice(-8,-6),r[o].slice(-6,-4)].join(":"),n(2,p=[de[0].elevation," m"].join("")),n(3,m=de[0].coords)},async function(){let e=await fetch("http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=klinaklini");e=await e.json(),i(W,r=e),i(G,s=e.length-1),i(Q,o=s),l.setCenter(de[1].coords,9),n(1,c="Klinaklini"),u=[r[o].slice(-18,-14),r[o].slice(-14,-12),r[o].slice(-12,-10)].join("-"),f=[r[o].slice(-10,-8),r[o].slice(-8,-6),r[o].slice(-6,-4)].join(":"),n(2,p=[de[1].elevation," m"].join("")),n(3,m=de[1].coords)},async function(){let e=await fetch("http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=homathko");e=await e.json(),i(W,r=e),i(G,s=e.length-1),i(Q,o=s),l.setCenter(de[2].coords,9),n(1,c="Homathko"),u=[r[o].slice(-18,-14),r[o].slice(-14,-12),r[o].slice(-12,-10)].join("-"),f=[r[o].slice(-10,-8),r[o].slice(-8,-6),r[o].slice(-6,-4)].join(":"),n(2,p=[de[2].elevation," m"].join("")),n(3,m=de[2].coords)},async function(){let e=await fetch("http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=perseverance");e=await e.json(),i(W,r=e),i(G,s=e.length-1),i(Q,o=s),l.setCenter(de[3].coords,9),n(1,c="Perseverance"),u=[r[o].slice(-18,-14),r[o].slice(-14,-12),r[o].slice(-12,-10)].join("-"),f=[r[o].slice(-10,-8),r[o].slice(-8,-6),r[o].slice(-6,-4)].join(":"),n(2,p=[de[3].elevation," m"].join("")),n(3,m=de[3].coords)},async function(){let e=await fetch("http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=cruickshank");e=await e.json(),i(W,r=e),i(G,s=e.length-1),i(Q,o=s),l.setCenter(de[4].coords,9),n(1,c="Upper Cruickshank"),u=[r[o].slice(-18,-14),r[o].slice(-14,-12),r[o].slice(-12,-10)].join("-"),f=[r[o].slice(-10,-8),r[o].slice(-8,-6),r[o].slice(-6,-4)].join(":"),n(2,p=[de[4].elevation," m"].join("")),n(3,m=de[4].coords)},async function(){let e=await fetch("http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=skeena");e=await e.json(),i(W,r=e),i(G,s=e.length-1),i(Q,o=s),l.setCenter(de[5].coords,5),n(1,c="Upper Skeena"),u=[r[o].slice(-18,-14),r[o].slice(-14,-12),r[o].slice(-12,-10)].join("-"),f=[r[o].slice(-10,-8),r[o].slice(-8,-6),r[o].slice(-6,-4)].join(":"),n(2,p=[de[5].elevation," m"].join("")),n(3,m=de[5].coords)},function(){var e;e=this.value,o=""===e?void 0:+e,Q.set(o)},function(e){_[e?"unshift":"push"](()=>{l=e,n(0,l)})}]}class ve extends I{constructor(e){super(),F(this,e,$e,he,r,{})}}function we(t){let n,o,s;return o=new ve({}),{c(){n=m("div"),B(o.$$.fragment),$(n,"class","mainimage")},m(e,t){f(e,n,t),J(o,n,null),s=!0},p:e,i(e){s||(U(o.$$.fragment,e),s=!0)},o(e){Y(o.$$.fragment,e),s=!1},d(e){e&&p(n),O(o)}}}return new class extends I{constructor(e){super(),F(this,e,null,we,r,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
