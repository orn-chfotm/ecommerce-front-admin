import type {FailResponse, ValidationError} from "./api-types";

const DEFAULT_ALERT = "요청 처리 중 오류가 발생했습니다.";

/**
 * 백엔드 에러 본문 {@link FailResponse} (평면 JSON)을 담습니다.
 */
export class ApiClientError extends Error {
    public readonly body: FailResponse;

    constructor(failResponse: FailResponse) {
        super(failResponse.message ?? DEFAULT_ALERT);
        this.body = failResponse;
        this.name = "ApiClientError";
    }

    get isValidationFailed(): boolean {
        return (this.body.data?.length ?? 0) > 0;
    }

    /** validation이면 첫 필드 message, 아니면 서버 message */
    get alertMessage(): string {
        if (this.isValidationFailed) {
            return this.body.data![0].message;
        }
        return this.body.message ?? DEFAULT_ALERT;
    }

    get firstValidationLine(): string {
        return this.body.data?.[0]?.message ?? this.body.message ?? DEFAULT_ALERT;
    }

    get allFieldLines(): string {
        if (!this.body.data?.length) {
            return "";
        }
        return this.body.data.map((e: ValidationError) => `${e.field}: ${e.message}`).join("\n");
    }
}
