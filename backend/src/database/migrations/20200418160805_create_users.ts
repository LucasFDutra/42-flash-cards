import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    CREATE TABLE users (
      id_user_pk TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
}


export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    DROP TABLE users
  `);
}
