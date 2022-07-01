/*eslint-disable */
import {ApiError} from "../utils/ApiError";
import {createTitle} from "../models/Titles";
import {ApiResponse} from "../utils/ApiResponse";

const Joi = require("joi");
/*eslint-enable */

export async function processCreateTitle(ctx): Promise<ApiResponse> {
    const expectedSchema = Joi.object({
       title: Joi.string().required()
    });

    console.log("Showing body");
    console.log(ctx.request.body);

    const { error, value } = expectedSchema.validate(ctx.request.body);
    if (error || ctx.request.body == undefined) {
        const message = "Unexpected or missing body for creation of a title"
        console.error(message);
        // throw new ApiError(400, {details: error});
        return new ApiResponse(400, {details: message, error});
    } else {
        try {
            const result = await createTitle(value.title);
            return new ApiResponse(201, result);
        } catch (e) {
            console.error("An error occurred while creating a new title", e);
            //throw e;
            return new ApiResponse(500, e);
        }
    }
}