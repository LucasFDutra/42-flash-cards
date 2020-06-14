import { Request, Response, response } from 'express';
import DeckModel from '../models/DeckModel';

export default {
  async createDeck(req: Request, res: Response) {
    try {
      await DeckModel.insertNewDeck(req.body);
      return res.status(200).send({ ok: true });
    } catch (error) {
      return res.status(500).send({ error: 'Failed to add new deck' });
    }
  },

  async findDecks(req: Request, res: Response) {
    try {
      const { idUser } = req.body;
      const { page } = req.query;
      const decks = await DeckModel.selectDecks(idUser, Number(page));
      res.header('totalRows', decks.totalRows);
      return res.status(200).json(decks.rows);
    } catch (error) {
      return res.status(400).send({ error: 'Failed to fetch decks' });
    }
  },

  async findOneDecks(req: Request, res: Response) {
    try {
      const { idDeck } = req.params;
      const deck = await DeckModel.selectOneDeck(idDeck);
      return res.status(200).json(deck);
    } catch (error) {
      return res.status(400).send({ error: 'Failed to fetch decks' });
    }
  },

  async editDeck(req: Request, res: Response) {
    if (isNaN(Number(req.body.idDeck))) {
      return res.status(401).send({ error: 'Failed to update deck' });
    }

    try {
      const deck = await DeckModel.updateOneDeck(req.body);
      return res.status(200).json(deck);
    } catch (error) {
      return res.status(400).send({ error: 'Failed to update deck' });
    }
  },

  async deleteDeck(req: Request, res: Response) {
    if (isNaN(Number(req.headers.iddeck))) {
      return res.status(401).send({ error: 'Failed to delete deck' });
    }

    try {
      const idDeck = req.headers.iddeck;
      await DeckModel.deleteOneDeck(idDeck);
      return res.status(200).send({ ok: 'Successfully deleted' });
    } catch (error) {
      return res.status(400).send({ error: 'Failed to delete deck' });
    }
  },
};
