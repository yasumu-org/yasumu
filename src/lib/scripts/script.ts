export function prepareScript(code: string, ctx: string) {
  return `
  var Headers=function(){var e,t,r,n,s,o,a,i=Object.create,u=Object.defineProperty,l=Object.getOwnPropertyDescriptor,c=Object.getOwnPropertyNames,f=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty,d=(a=null!=(o=(n={"node_modules/set-cookie-parser/lib/set-cookie.js"(e,t){"use strict";var r={decodeValues:!0,map:!1,silent:!1};function n(e){return"string"==typeof e&&!!e.trim()}function s(e,t){var s,o,a,i,u=e.split(";").filter(n),l=(s=u.shift(),o="",a="",(i=s.split("=")).length>1?(o=i.shift(),a=i.join("=")):a=s,{name:o,value:a}),c=l.name,f=l.value;t=t?Object.assign({},r,t):r;try{f=t.decodeValues?decodeURIComponent(f):f}catch(h){console.error("set-cookie-parser encountered an error while decoding a cookie with value '"+f+"'. Set options.decodeValues to false to disable this feature.",h)}var d={name:c,value:f};return u.forEach(function(e){var t=e.split("="),r=t.shift().trimLeft().toLowerCase(),n=t.join("=");"expires"===r?d.expires=new Date(n):"max-age"===r?d.maxAge=parseInt(n,10):"secure"===r?d.secure=!0:"httponly"===r?d.httpOnly=!0:"samesite"===r?d.sameSite=n:d[r]=n}),d}function o(e,t){if(t=t?Object.assign({},r,t):r,!e)return t.map?{}:[];if(e.headers){if("function"==typeof e.headers.getSetCookie)e=e.headers.getSetCookie();else if(e.headers["set-cookie"])e=e.headers["set-cookie"];else{var o=e.headers[Object.keys(e.headers).find(function(e){return"set-cookie"===e.toLowerCase()})];o||!e.headers.cookie||t.silent||console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."),e=o}}return(Array.isArray(e)||(e=[e]),(t=t?Object.assign({},r,t):r).map)?e.filter(n).reduce(function(e,r){var n=s(r,t);return e[n.name]=n,e},{}):e.filter(n).map(function(e){return s(e,t)})}t.exports=o,t.exports.parse=o,t.exports.parseString=s,t.exports.splitCookiesString=function e(t){if(Array.isArray(t))return t;if("string"!=typeof t)return[];var r,n,s,o,a,i=[],u=0;function l(){for(;u<t.length&&/\s/.test(t.charAt(u));)u+=1;return u<t.length}function c(){return"="!==(n=t.charAt(u))&&";"!==n&&","!==n}for(;u<t.length;){for(r=u,a=!1;l();)if(","===(n=t.charAt(u))){for(s=u,u+=1,l(),o=u;u<t.length&&c();)u+=1;u<t.length&&"="===t.charAt(u)?(a=!0,u=o,i.push(t.substring(r,s)),r=u):u=s+1}else u+=1;(!a||u>=t.length)&&i.push(t.substring(r,t.length))}return i}}},function e(){return s||(0,n[c(n)[0]])((s={exports:{}}).exports,s),s.exports})())?i(f(o)):{},((e,t,r,n)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let s of c(t))h.call(e,s)||void 0===s||u(e,s,{get:()=>t[s],enumerable:!(n=l(t,s))||n.enumerable});return e})(o&&o.__esModule?a:u(a,"default",{value:o,enumerable:!0}),o)),p=/[^a-z0-9\-#$%&'*+.^_\`|~]/i;function m(e){if(p.test(e)||""===e.trim())throw TypeError("Invalid character in header field name");return e.trim().toLowerCase()}var g=["\n","\r","	"," ",],x=RegExp(\`(^[\${g.join("")}]|$[\${g.join("")}])\`,"g");function y(e){let t=e.replace(x,"");return t}function k(e){if("string"!=typeof e||0===e.length)return!1;for(let t=0;t<e.length;t++){let r=e.charCodeAt(t);if(r>127||!v(r))return!1}return!0}function v(e){return![127,32,"(",")","<",">","@",",",";",":","\\",'"',"/","[","]","?","=","{","}"].includes(e)}function w(e){if("string"!=typeof e||e.trim()!==e)return!1;for(let t=0;t<e.length;t++){let r=e.charCodeAt(t);if(0===r||10===r||13===r)return!1}return!0}var Y=Symbol("normalizedHeaders"),$=Symbol("rawHeaderNames"),_=class n{constructor(s){this[e]={},this[t]=new Map,this[r]="Headers",["Headers","HeadersPolyfill"].includes(s?.constructor.name)||s instanceof n||void 0!==globalThis.Headers&&s instanceof globalThis.Headers?s.forEach((e,t)=>{this.append(t,e)},this):Array.isArray(s)?s.forEach(([e,t])=>{this.append(e,Array.isArray(t)?t.join(", "):t)}):s&&Object.getOwnPropertyNames(s).forEach(e=>{let t=s[e];this.append(e,Array.isArray(t)?t.join(", "):t)})}[(e=Y,t=$,r=Symbol.toStringTag,Symbol.iterator)](){return this.entries()}*keys(){for(let[e]of this.entries())yield e}*values(){for(let[,e]of this.entries())yield e}*entries(){let e=Object.keys(this[Y]).sort((e,t)=>e.localeCompare(t));for(let t of e)if("set-cookie"===t)for(let r of this.getSetCookie())yield[t,r];else yield[t,this.get(t)]}has(e){if(!k(e))throw TypeError(\`Invalid header name "\${e}"\`);return this[Y].hasOwnProperty(m(e))}get(e){if(!k(e))throw TypeError(\`Invalid header name "\${e}"\`);return this[Y][m(e)]??null}set(e,t){if(!k(e)||!w(t))return;let r=m(e),n=y(t);this[Y][r]=y(n),this[$].set(r,e)}append(e,t){if(!k(e)||!w(t))return;let r=m(e),n=y(t),s=this.has(r)?\`\${this.get(r)}, \${n}\`:n;this.set(e,s)}delete(e){if(!k(e)||!this.has(e))return;let t=m(e);delete this[Y][t],this[$].delete(t)}forEach(e,t){for(let[r,n]of this.entries())e.call(t,n,r,this)}getSetCookie(){let e=this.get("set-cookie");return null===e?[]:""===e?[""]:(0,d.splitCookiesString)(e)}toJSON(){return Object.fromEntries(this.entries())}};function C(e){let t={};for(let[r,n]of e.entries())t[e[$].get(r)]=n;return t}function j(e){let t=function e(t){let r=[];return t.forEach((e,t)=>{let n=e.includes(",")?e.split(",").map(e=>e.trim()):e;r.push([t,n])}),r}(e),r=t.map(([e,t])=>{let r=[].concat(t);return\`\${e}: \${r.join(", ")}\`});return r.join("\r\n")}var H=["user-agent"];function S(e){let t={};return e.forEach((e,r)=>{let n=!H.includes(r.toLowerCase())&&e.includes(",");t[r]=n?e.split(",").map(e=>e.trim()):e}),t}function b(e){let t=e.trim().split(/[\r\n]+/);return t.reduce((e,t)=>{if(""===t.trim())return e;let r=t.split(": "),n=r.shift(),s=r.join(": ");return e.append(n,s),e},new _)}function A(e){let t=new _;return e.forEach(([e,r])=>{let n=[].concat(r);n.forEach(r=>{t.append(e,r)})}),t}function E(e,t,r){return Object.keys(e).reduce((r,n)=>t(r,n,e[n]),r)}function q(e){return E(e,(e,t,r)=>{let n=[].concat(r).filter(Boolean);return n.forEach(r=>{e.append(t,r)}),e},new _)}function O(e){return e.map(([e,t])=>[e,[].concat(t).join(", ")])}function P(e){return E(e,(e,t,r)=>(e[t]=[].concat(r).join(", "),e),{})}return _}();

  var Yasumu = Object.preventExtensions({
    context: {
      data: ${ctx},
      __meta: {
        store: {},
        requestHeaders: null,
        console: []
      },
    },
    request: {
      get url() {
        return Yasumu.context.data.request.url;
      },
      get method() {
        return Yasumu.context.data.request.method;
      },
      get headers() {
        Yasumu.context.__meta.requestHeaders = new Headers(Yasumu.context.data.request.headers);
        return Yasumu.context.__meta.requestHeaders;
      },
    },
    response: {
      get url() {
        return Yasumu.context.data.response.url;
      },
      get method() {
        return Yasumu.context.data.response.method;
      },
      get headers() {
        return new Headers(Yasumu.context.data.response.headers);
      },
      get status() {
        return Yasumu.context.data.response.status;
      },
      get statusText() {
        return Yasumu.context.data.response.statusText;
      },
      get bodyText() {
        return Yasumu.context.data.response.bodyText;
      },
      get responseTime() {
        return Yasumu.context.data.response.responseTime;
      },
    },
    store: {
      get(key) {
        return Yasumu.context.__meta.store[key];
      },
      set(key, value) {
        Yasumu.context.__meta.store[key] = value;
      },
      remove(key) {
        delete Yasumu.context.__meta.store[key];
      },
      has(key) {
        return key in Yasumu.context.__meta.store;
      },
      count() {
        return Object.keys(Yasumu.context.__meta.store).length;
      },
      clear() {
        Yasumu.context.__meta.store = {};
      },
      entries() {
        return Object.entries(Yasumu.context.__meta.store);
      },
    },
  });

  var console = {
    inspect(obj) {
      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return obj;
      }

      if (obj === null) {
        return null;
      }

      if (typeof obj === 'symbol') {
        return \`Symbol(\${obj.description})\`;
      }

      if (typeof obj === 'function') {
        return \`function \${obj.name}() { [native code] }\`;
      }

      return JSON.stringify(obj, null, 2);
    },
    log(...args) {
      Yasumu.context.__meta.console.push({ type: 'log', args: args.map((arg) => console.inspect(arg)) });
    },
    error(...args) {
      Yasumu.context.__meta.console.push({ type: 'error', args: args.map((arg) => console.inspect(arg)) });
    },
    warn(...args) {
      Yasumu.context.__meta.console.push({ type: 'warn', args: args.map((arg) => console.inspect(arg)) });
    },
    info(...args) {
      Yasumu.context.__meta.console.push({ type: 'info', args: args.map((arg) => console.inspect(arg)) });
    },
  };

  function YasumuScriptVm() {
    ${code}
  }
  YasumuScriptVm.toString = () => "function() { [native code] }";
  void YasumuScriptVm();
  JSON.stringify(Yasumu.context.__meta)
  `;
}
