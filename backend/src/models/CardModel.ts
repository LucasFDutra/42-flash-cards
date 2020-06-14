import connection from '../database/connection';

interface Ibody {
  idUser: string,
  idDeck: number,
  idCard: number,
  question: string,
  answer: string,
  cardImage: string,
}

class CardModel {
    public insertNewCard = async (body: Ibody) => {
      await connection.raw(`
        BEGIN;
        INSERT INTO cards (id_user_fk, id_deck_fk, question, answer, card_image) VALUES ('${body.idUser}', ${body.idDeck}, '${body.question}', '${body.answer}', '${body.cardImage}');
        COMMIT;
      `);
    };

    public selectOneCard = async (idCard: number) : Promise<Ibody> => {
      const { rows } = await connection.raw(`
        SELECT * FROM cards where id_card_pk = ${idCard}
      `);
      return rows[0];
    }

    public selectAllCards = async (idDeck: number) : Promise<Ibody> => {
      const { rows } = await connection.raw(`
        SELECT id_card_pk, id_deck_fk, question, answer, card_image FROM cards WHERE id_deck_fk = '${idDeck}'
      `);
      return rows;
    };

    public updateOneCard = async (body: Ibody) : Promise<Ibody> => {
      await connection.raw(`
        BEGIN;
        UPDATE cards SET question = '${body.question}', answer = '${body.answer}', card_image = '${body.cardImage}' WHERE id_card_pk = ${body.idCard};
        COMMIT;
      `);
      return this.selectOneCard(body.idCard);
    };

    public deleteOneCard = async (idCard: number) => {
      await connection.raw(`
        BEGIN;
        DELETE FROM cards WHERE id_card_pk = ${idCard};
        COMMIT;
      `);
    }

    public deleteAllCardsInADeck = async (idDeck: number) => {
      await connection.raw(`
        BEGIN;
        DELETE FROM cards WHERE id_deck_fk = ${idDeck};
        COMMIT;
      `);
    }
}

export default new CardModel();
