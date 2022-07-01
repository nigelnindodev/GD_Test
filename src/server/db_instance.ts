import {Knex, knex} from "knex";

const knexDbConfig: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: "./data.db"
    }
}

export const knexInstance = knex(knexDbConfig);

export enum TABLE_NAMES {
    TITLES = "titles",
    RESERVATIONS = "reservations"
}
