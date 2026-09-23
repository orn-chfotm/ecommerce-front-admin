type MessageValue = string | { [key: string]: MessageValue };

const message = {
    success: {
        default: "처리가 완료되었습니다."
    },
    fail: {
        default: "요청 처리 중 오류가 발생했습니다."
    }
} as const satisfies Record<string, MessageValue>;

type MessagePath<T> = {
    [K in keyof T & string]:
        T[K] extends string
            ? [K]
            : T[K] extends Record<string, unknown>
                ? [K, ...MessagePath<T[K]>]
                : never;
}[keyof T & string];

function resolve(keys: readonly string[]): string | undefined {
    let current: MessageValue = message;
    for (const key of keys) {
        if (typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, key)) {
            return undefined;
        }
        current = current[key];
    }
    return typeof current === "string" ? current : undefined;
}

export function getMessage(
    ...keys: MessagePath<typeof message>
): string {
    const found = resolve(keys);
    if (found === undefined) {
        console.error("message key를 확인해주세요:", keys.join("."));
        return message.fail.default;
    }

    return found;
}
