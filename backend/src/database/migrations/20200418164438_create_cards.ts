import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    CREATE TABLE cards(
      id_card_pk SERIAL PRIMARY KEY,
      id_user_fk TEXT NOT NULL REFERENCES USERS(id_user_pk),
      id_deck_fk INTEGER NOT NULL REFERENCES DECKS(id_deck_pk),
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      card_image TEXT
    )
  `);
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    DROP TABLE cards
  `);
}
