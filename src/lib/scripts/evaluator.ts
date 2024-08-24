import { toast } from 'sonner';
import { Yasumu as YasumuCore } from '../yasumu';

export function evaluateScript(script: string, context: Record<string, unknown>, scriptType: string) {
  queueMicrotask(async () => {
    try {
      const Yasumu = context;
      void Yasumu;
      await YasumuCore.scripts.run(script, '{}');
    } catch (e) {
      try {
        toast.error(`${scriptType} failed to run`, {
          description: String(e),
        });
      } catch {}
    }
  });
}
