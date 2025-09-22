import createHttpError from "http-errors";

export class NotFoundException extends createHttpError.NotFound {
    constructor(message?: string) {
        super(message || 'Resource not found');
        this.name = 'NotFoundException';
    }
}

export class BadRequestException extends createHttpError.BadRequest {
    constructor(message?: string) {
        super(message || 'Bad Request');
        this.name = 'BadRequestException';
    }
}

export class InternalServerErrorException extends createHttpError.InternalServerError {
    constructor(message?: string) {
        super(message || 'Internal Server Error');
        this.name = 'InternalServerErrorException';
    }
}
export class UnauthorizedException extends createHttpError.Unauthorized {
    constructor(message?: string) {
        super(message || 'Unauthorized');
        this.name = 'UnauthorizedException';
    }
}