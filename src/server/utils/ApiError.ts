export class ApiError extends Error {
    constructor(statusCode: number, message: object) {
        super(message.toString());
    }
}
