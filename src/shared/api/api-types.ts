interface Response {
    timestamp: string,
    status: number,
    message?: string,
}

export interface SuccessResponse<T> extends Response {
    data: T
}

export interface FailResponse extends Response {
    code: string;
    data?: ValidationError[]
}

export interface ValidationError {
    field: string;
    message: string;
}
