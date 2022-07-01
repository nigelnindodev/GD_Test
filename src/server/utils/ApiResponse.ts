export class ApiResponse {
    statusCode: number;
    response: object;
    constructor(statusCode: number, response: object) {
        this.statusCode = statusCode;
        this.response = response;
    }
}