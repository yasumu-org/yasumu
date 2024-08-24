import { Yasumu } from './yasumu';

export function evaluateUnsafe<T>(script: string, contextData: string): T {
  const yasumu = Yasumu;

  void yasumu;

  // TODO: use tanxium runtime to evaluate the script
  return eval(`let fn = (async function() {
      let window = undefined;
      let context = ${contextData};
      let globalThis = { Yasumu: yasumu, context };
      let global = globalThis;
      let self = globalThis;
      let document = undefined;
      let location = undefined;
      let navigator = undefined;
      let fetch = undefined;
      let Request = undefined;
      let Response = undefined;
      let Headers = undefined;
      let AbortController = undefined;
      let FormData = undefined;
      let URLSearchParams = undefined;
      let FileReader = undefined;
      let WebSocket = undefined;
      let EventSource = undefined;
      let eventTarget = undefined;
      let XMLHttpRequest = undefined;
      let requestAnimationFrame = undefined;
      let cancelAnimationFrame = undefined;
      let eval = undefined;
      ${script}
    });

    fn.toString = () => "function() { [native code] }";
    fn();`);
}
