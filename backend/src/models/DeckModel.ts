import connection from '../database/connection';
import CardModel from './CardModel';

interface Ibody {
  idUser: string,
  idDeck: number,
  deckName: string,
  deckImage: string,
}

interface Idecks {
  rows: Ibody,
  totalRows: number,
}

class DeckModel {
    public insertNewDeck = async (body: Ibody) => {
      await connection.raw(`
        BEGIN;
        INSERT INTO decks (id_user_fk, deck_name, deck_image) VALUES ('${body.idUser}', '${body.deckName}', '${body.deckImage}');
        COMMIT;
      `);
    };

    public selectOneDeck = async (idDeck: number) : Promise<Ibody> => {
      const { rows } = await connection.raw(`
        SELECT * FROM decks where id_deck_pk = ${idDeck}
      `);
      return rows[0];
    }

    public selectDecks = async (idUser: string, page: number) : Promise<Idecks> => {
      const numItems = 10;
      const { rows } = await connection.raw(`
        SELECT * FROM (SELECT id_deck_pk, deck_name, deck_image, ROW_NUMBER () OVER (ORDER BY id_deck_pk)
          FROM decks
          WHERE id_user_fk = '${idUser}'
        ) x
        WHERE ROW_NUMBER BETWEEN ${(page - 1) * numItems} AND ${((page - 1) * numItems) + (numItems - 1)}
      `);

      const totalRows = await connection.raw(`
        SELECT count(*) FROM decks WHERE id_user_fk = '${idUser}'
      `);

      // console.log();

      return { rows, totalRows: Number(totalRows.rows[0].count) };
    };

    public updateOneDeck = async (body: Ibody) : Promise<Ibody> => {
      await connection.raw(`
        BEGIN;
        UPDATE decks SET deck_name = '${body.deckName}', deck_image = '${body.deckImage}' WHERE id_deck_pk = ${body.idDeck};
        COMMIT;
      `);
      return this.selectOneDeck(body.idDeck);
    };

    public deleteOneDeck = async (idDeck: number) => {
      await CardModel.deleteAllCardsInADeck(idDeck);

      await connection.raw(`
        BEGIN;
        DELETE FROM decks WHERE id_deck_pk = ${idDeck};
        COMMIT;
      `);
    }
}

export default new DeckModel();
