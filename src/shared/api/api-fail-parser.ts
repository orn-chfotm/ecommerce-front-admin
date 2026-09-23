import type {FailResponse, ValidationError} from "./api-types";
import {getMessage} from "@/shared/lib/common-message";

/**
 * HTTP error JSON을 {@link FailResponse}로 맞춥니다.
 * - 평면: `{ timestamp, status, message, data? }` (현재 백엔드)
 * - 레거시 래퍼: `{ body: FailResponse }` 호환
 */
export function parseFailResponseFromJson(raw: unknown): FailResponse {
    const now = new Date().toISOString();
    const defaultMsg = getMessage('fail', 'default');

    if (raw != null && typeof raw === "object") {
        const o = raw as Record<string, unknown>;
        if ("body" in o && o.body != null && typeof o.body === "object") {
            return normalizeFailResponse(o.body as Record<string, unknown>, now, defaultMsg);
        }
        return normalizeFailResponse(o, now, defaultMsg);
    }

    return {code: "", timestamp: now, status: 0, message: defaultMsg};
}

function normalizeFailResponse(
    o: Record<string, unknown>,
    now: string,
    defaultMsg: string,
): FailResponse {
    const data = o.data;
    const validationList: ValidationError[] | undefined = Array.isArray(data)
        ? (data as ValidationError[])
        : undefined;

    return {
        code: typeof o.code === 'string' ? o.code : "",
        timestamp: typeof o.timestamp === "string" ? o.timestamp : now,
        status: typeof o.status === "number" ? o.status : 0,
        message: typeof o.message === "string" ? o.message : defaultMsg,
        data: validationList,
    };
}
