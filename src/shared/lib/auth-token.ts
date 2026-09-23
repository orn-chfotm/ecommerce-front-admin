/** localStorage 키 (로그인 성공 시 저장하는 값과 동일) */
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

const AUTH_CHANGED_EVENT = "auth-token-changed";

function isBrowser(): boolean {
    return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
    if (!isBrowser()) {
        return null;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    if (!isBrowser()) {
        return null;
    }
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function hasAccessToken(): boolean {
    return Boolean(getAccessToken());
}

export function setAuthTokens(accessToken: string, refreshToken: string): void {
    if (!isBrowser()) {
        return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearAuthTokens(): void {
    if (!isBrowser()) {
        return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

/** api 통신 시 Authorization 헤더에 붙일 값 */
export function getAuthHeaders(): Record<string, string> {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return {};
    }
    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

export function subscribeAuthChange(listener: () => void): () => void {
    if (!isBrowser()) {
        return () => undefined;
    }
    window.addEventListener(AUTH_CHANGED_EVENT, listener);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, listener);
}
