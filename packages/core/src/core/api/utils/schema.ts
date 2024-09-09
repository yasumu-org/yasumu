import { YasumuSchemaScript, YasumuSchemaScriptActions } from '@yasumu/schema';

export class YasumuSchemaUtilities {
  /**
   * Serialize Yasumu schema to YSL (Yasumu Schema Language) format
   * @param value The value to serialize
   * @returns The serialized value
   */
  public stringify(value: YasumuSchemaScript): string {
    return YasumuSchemaScriptActions.serialize(value);
  }

  /**
   * Parse YSL (Yasumu Schema Language) to Yasumu schema
   * @param content The content to parse
   * @returns The parsed value
   */
  public parse(content: string): YasumuSchemaScript {
    return YasumuSchemaScriptActions.parse(content);
  }
}
