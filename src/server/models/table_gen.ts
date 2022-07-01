import {knexInstance, TABLE_NAMES} from "../db_instance";

export async function runMigrations () {
    const hasTitlesTable = await knexInstance.schema.hasTable(TABLE_NAMES.TITLES);
    const hasReservationsTable = await knexInstance.schema.hasTable(TABLE_NAMES.RESERVATIONS);

    if (!hasTitlesTable) {
        await knexInstance.schema.createTable(TABLE_NAMES.TITLES, (table) => {
           table.increments("id");
           table.boolean("available").notNullable();
           table.string("title").notNullable();
           table.timestamp("created_at").notNullable().defaultTo(knexInstance.fn.now());
           table.timestamp("updated_at").notNullable().defaultTo(knexInstance.fn.now());
        });
    }

    if (!hasReservationsTable) {
        await knexInstance.schema.createTable(TABLE_NAMES.RESERVATIONS, (table) => {
            table.increments("id");
            table.string("email");
            table.string("title").notNullable();
            //table.integer("id").notNullable().index().references("id").inTable(TABLE_NAMES.TITLES);
            table.integer("titleId").notNullable().unique();
            table.timestamp("created_at").notNullable().defaultTo(knexInstance.fn.now());
            table.timestamp("updated_at").notNullable().defaultTo(knexInstance.fn.now());
        });
    }
}