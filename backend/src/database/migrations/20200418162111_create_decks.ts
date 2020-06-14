import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    CREATE TABLE decks (
      id_deck_pk SERIAL PRIMARY KEY,
      id_user_fk TEXT NOT NULL REFERENCES USERS(id_user_pk),
      deck_name TEXT NOT NULL,
      deck_image TEXT
    )
  `);
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    DROP TABLE decks
  `);
}
