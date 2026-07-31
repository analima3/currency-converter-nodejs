import { AppError } from "./app-error.ts";
import { ErrorCode } from "./error-codes.ts";
import { HttpStatus } from "./http-status.ts";

export class ExternalApiError extends AppError {
    constructor() {
        super({
            code: ErrorCode.EXTERNAL_API_ERROR,
            message: 'Falha ao tentar recuperar a taxa de câmbio.',
            statusCode: HttpStatus.BAD_GATEWAY
        })
    }    
}
