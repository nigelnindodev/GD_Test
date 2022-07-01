import {knexInstance, TABLE_NAMES} from "../db_instance";
import { cleanUpTitle } from "../utils/general_utils_service";

export interface Titles {
    id: number,
    available: boolean,
    title: string,
    createdAt: Date,
    updatedAt: Date
}

export async function createTitle(title: string) {
    return knexInstance.returning("*").insert({
        available: true,
        title: cleanUpTitle(title)
    }).into(TABLE_NAMES.TITLES);
}

export async function findTitle(title: string) {
    return knexInstance.select("*").from(TABLE_NAMES.TITLES).where({
        title: cleanUpTitle(title),
        available: true
    }).orderBy("id", "asc").first();
}

export async function findTitleById(id: number) {
    return knexInstance.select("*").from(TABLE_NAMES.TITLES).where({
        id: id
    }).first();
}

export async function updateTitle(updateFields: object, id: number) {
    // find the title
    const title = await findTitleById(id);
    console.log("Found title");
    console.log(title);
    if (title) {
        const updatedObject = {
            ...title,
            ...updateFields
        };
        // cannot update id and title
        delete updatedObject['id'];
        console.log(updatedObject);
        return knexInstance(TABLE_NAMES.TITLES).where({
            id: id
        }).update(updatedObject);
    }
}
