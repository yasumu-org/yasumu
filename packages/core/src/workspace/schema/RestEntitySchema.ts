import { t } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';

export const RestEntitySchema = t.script(WorkspaceModuleType.Rest, {
  Metadata: t.objectBlock({
    name: t.objectValue(t.string()),
    id: t.objectValue(t.string()),
    createdAt: t.objectValue(t.number()),
    path: t.objectValue(t.string()),
    method: t.objectValue(t.string()),
  }),
  Request: t.objectBlock({
    url: t.objectValue(t.string()),
    headers: t.objectValue(
      t.list(
        t.object({
          key: t.objectValue(t.string()),
          value: t.objectValue(t.string()),
        }),
      ),
    ),
    body: t.optionalObjectValue(t.string()),
  }),
  Response: t.objectBlock({
    status: t.optionalObjectValue(t.number()),
    time: t.optionalObjectValue(t.number()),
    size: t.optionalObjectValue(t.number()),
    headers: t.optionalObjectValue(
      t.list(
        t.object({
          key: t.objectValue(t.string()),
          value: t.objectValue(t.string()),
        }),
      ),
    ),
    body: t.optionalObjectValue(t.string()),
  }),
  BeforeRequest: t.optionalCodeBlock(),
  AfterResponse: t.optionalCodeBlock(),
  Test: t.optionalCodeBlock(),
});
