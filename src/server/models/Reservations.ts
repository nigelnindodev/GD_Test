import {knexInstance, TABLE_NAMES} from "../db_instance";
import { cleanUpTitle } from "../utils/general_utils_service";

export interface Reservations {
    id: number;
    email: string,
    title: string,
    titleId: number
    createdAt: Date,
    updatedAt: Date
}

export async function createReservation(email: string, title: string, titleId: number) {
    return knexInstance.returning("*").insert({
       email,
       title: cleanUpTitle(title),
       titleId
    }).into(TABLE_NAMES.RESERVATIONS);
}

export async function deleteReservation(id: number) {
    console.log("Calling delete reservation function")
    const result = await knexInstance(TABLE_NAMES.RESERVATIONS).where({
       titleId: id
    }).del();
    console.log(result);
}

export async function getReservationByTitleId(titleId: number) {
    const result = await knexInstance(TABLE_NAMES.RESERVATIONS).select().where({
        titleId: titleId
    }).first();
    console.log(result);
    return result;
}

export async function getAllReservationsFromDb() {
    return knexInstance(TABLE_NAMES.RESERVATIONS).select();
}
