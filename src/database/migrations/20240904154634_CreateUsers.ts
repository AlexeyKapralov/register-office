import { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex) {
    return knex.schema.createTable(tableName, (t) => {
        // this creates an "id" column that gets autoincremented
        t.increments('id');
        t.string('login').notNullable();
        t.string('email');
        t.string('password').notNullable();
        t.uuid('roleId').notNullable();
        t.datetime('createdAt', { useTz: false }).notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tableName);
}
