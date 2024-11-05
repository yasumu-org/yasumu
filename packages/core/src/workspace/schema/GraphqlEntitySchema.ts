import { t } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';

export const GraphqlEntitySchema = t.script(WorkspaceModuleType.GraphQL, {
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
    body: t.objectValue(t.string()),
  }),
  Response: t.objectBlock({
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
