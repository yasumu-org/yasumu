export class YasumuSchemaUtils {
    static isWhitespace(text: string) {
        return text.trim().length === 0;
    }

    static isNumericChar(char: string) {
        if (char === "") {
            return false;
        }
        const codePoint = char.codePointAt(0)!;
        return codePoint >= 48 && codePoint <= 57;
    }

    static isAlphabeticChar(char: string) {
        if (char === "") {
            return false;
        }
        const codePoint = char.codePointAt(0)!;
        return (
            (codePoint >= 65 && codePoint <= 90) ||
            (codePoint >= 97 && codePoint <= 122)
        );
    }

    static isAlphaNumericChar(char: string) {
        return this.isNumericChar(char) || this.isAlphabeticChar(char);
    }

    static maybeParseInt(value: string, radix?: number) {
        try {
            return parseInt(value, radix);
        } catch (_) {
            return;
        }
    }

    static enum<T extends string>(values: readonly T[]) {
        return values.reduce(
            (pv, cv) => {
                pv[cv] = cv;
                return pv;
            },
            {} as { [K in T]: K },
        );
    }
}
