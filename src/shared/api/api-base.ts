import {getAuthHeaders} from "@/shared/lib/auth-token";
import {ApiClientError} from "./api-client-error";
import {parseFailResponseFromJson} from "./api-fail-parser";
import {HttpMethod} from "@/shared/api/api-http-method";
import {SuccessResponse} from "@/shared/api/api-types";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? '';

if (!BASE_URL) {
    console.warn('API base URL is not configured. Set NEXT_PUBLIC_BACKEND_API_URL in your env file.');
}

export const apiBase = async <T> (
    endpoint: string,
    options: RequestInit= {}
) : Promise<SuccessResponse<T>> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
                ...(options.headers ?? {}),
            },
            method: options.method ?? HttpMethod.GET,
            body: options.body,
            cache: 'no-store'
        }
    )

    if (!response.ok) {
        let raw: unknown;
        try {
            raw = await response.json();
        } catch {
            raw = null;
        }
        throw new ApiClientError(parseFailResponseFromJson(raw));
    }
    const successResponse = (await response.json()) as SuccessResponse<T>;
    return successResponse;
}