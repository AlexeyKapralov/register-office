import { Knex } from 'knex';

export async function up(knex: Knex) {
    return knex.schema
        .alterTable('doctorsWorkSchedule', (t) => {
            t.specificType('workDate', 'TIMESTAMPTZ').nullable().alter();
        })
        .alterTable('appointments', (t) => {
            // this creates an "id" column that gets autoincremented
            t.specificType('datetimeOfAdmission', 'TIMESTAMPTZ')
                .nullable()
                .alter();
            t.specificType('createdAt', 'TIMESTAMPTZ').nullable().alter();
            t.specificType('deletedAt', 'TIMESTAMPTZ').nullable().alter();
        })
        .alterTable('doctors', (t) => {
            t.specificType('dob', 'TIMESTAMPTZ').nullable().alter();
            t.specificType('deletedAt', 'TIMESTAMPTZ').nullable().alter();
        })
        .alterTable('patients', (t) => {
            t.specificType('dob', 'TIMESTAMPTZ').nullable().alter();
            t.specificType('deletedAt', 'TIMESTAMPTZ').nullable().alter();
        })
        .alterTable('users', (t) => {
            t.specificType('createdAt', 'TIMESTAMPTZ').nullable().alter();
            t.specificType('deletedAt', 'TIMESTAMPTZ').nullable().alter();
        });
}

export async function down(knex: Knex) {
    return knex.schema
        .alterTable('doctorsWorkSchedule', (t) => {
            t.datetime('workDate', { useTz: false }).nullable().alter();
        })
        .alterTable('appointments', (t) => {
            // this creates an "id" column that gets autoincremented
            t.datetime('datetimeOfAdmission', { useTz: false })
                .nullable()
                .alter();
            t.datetime('createdAt', { useTz: false }).nullable().alter();
            t.datetime('deletedAt', { useTz: false }).nullable().alter();
        })
        .alterTable('doctors', (t) => {
            t.datetime('dob', { useTz: false }).nullable().alter();
            t.datetime('deletedAt', { useTz: false }).nullable().alter();
        })
        .alterTable('patients', (t) => {
            t.datetime('dob', { useTz: false }).nullable().alter();
            t.datetime('deletedAt', { useTz: false }).nullable().alter();
        })
        .alterTable('users', (t) => {
            t.datetime('createdAt', { useTz: false }).nullable().alter();
            t.datetime('deletedAt', { useTz: false }).nullable().alter();
        });
}
