import {knexInstance, TABLE_NAMES} from "../db_instance";

import {
    createReservation,
    deleteReservation,
    getAllReservationsFromDb,
    getReservationByTitleId,
    Reservations
} from "../models/Reservations";
import {isEmailvalid} from "../utils/general_utils_service";
import {ApiError} from "../utils/ApiError";
import { findTitle, findTitleById, updateTitle } from "../models/Titles";
import {ApiResponse} from "../utils/ApiResponse";

/*eslint-disable */
const Joi = require("joi");
/*eslint-enable */

export async function getAllReservations(): Promise<ApiResponse> {
    console.log("GET all reservations request");
    //return new ApiResponse(200, knexInstance<Reservations>(TABLE_NAMES.RESERVATIONS));
    return new ApiResponse(200, await getAllReservationsFromDb());
}

export async function getReservation(id: number): Promise<ApiResponse> {
    console.log(`GET single reservation with id: ${id}`);

    // find the title based off id
    //const title = await findTitleById(id);

    const reservation = await getReservationByTitleId(id);

    if (reservation) {
        return new ApiResponse(200, reservation);
    } else {
        return new ApiResponse(404, {details: `No reservation found with title id ${id}`});
    }
}

export async function processCreateReservation(ctx): Promise<ApiResponse> {
    const expectedSchema = Joi.object({
        email: Joi.string().required(),
        title: Joi.string().required()
    });

    const { error, value } = expectedSchema.validate(ctx.request.body);
    // validate body
    if (error || ctx.request.body == undefined) {
        const message = "Unexpected or missing body for creation of a reservation";
        console.log(message);
        //throw new ApiError(400, {details: error});
        return new ApiResponse(400, {details: error});
    }

    // validate email
    if (!isEmailvalid(value.email)) {
        //throw new ApiError(400, {details: "Invalid email address"});
        return new ApiResponse(400, {details: "Invalid email address"});
    }

    // find the title from the db
    const title = await findTitle(value.title);

    console.log(title);

    if (title == undefined) {
        //throw new ApiError(404, {details: "No title found"});
        return new ApiResponse(404, {details: "No title found"});
    }

    if (title.available) {
        // create reservation
        const reservation = await createReservation(value.email, value.title, title.id);

        // update title to reserved
        await updateTitle({available: false}, title.id);
        return new ApiResponse(201, reservation);
    } else {
        // throw error
        //  throw new ApiError(403, {details: "Title already booked"})
        return new ApiResponse(403, {details: "Title already booked"});
    }
}

export async function processDeleteReservation(id: number): Promise<ApiResponse> {
    // find the title based off id
    const title = await findTitleById(id);
    
    if (title) {
        // find out if title has a reservation
        if (title.available) {
            //throw new ApiError(404, {details: `No reservation found for title with id ${id}`});
            return new ApiResponse(404, {details: `No reservation found for title with id ${id}`});
        } else {
            //delete the reservation
            await deleteReservation(title.id);
            // looked up here to find the appropriate status code for a deleted resource [https://stackoverflow.com/a/2342589] I usually will not delete resources

            // mark the book as available
            await updateTitle({available: true}, title.id);
            return new ApiResponse(200, {details: `Reservation with id ${id} deleted successfully`});
        }
    } else {
        //throw new ApiError(404, {details: `No title found with id ${id}`})
        return new ApiResponse(404, {details: `No title found with id ${id}`});
    }
}
