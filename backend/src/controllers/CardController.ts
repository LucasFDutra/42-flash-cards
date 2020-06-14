import { Request, Response } from 'express';
import CardModel from '../models/CardModel';

export default {
  async createCard(req: Request, res: Response) {
    if (isNaN(Number(req.body.idDeck))) {
      return res.status(401).send({ error: 'Failed to add card' });
    }

    try {
      await CardModel.insertNewCard(req.body);
      return res.status(200).send({ ok: true });
    } catch (error) {
      return res.status(500).send({ error: 'Failed to add new card' });
    }
  },

  async findAllCards(req: Request, res: Response) {
    try {
      const idDeck = req.headers.iddeck;
      const cards = await CardModel.selectAllCards(idDeck);
      return res.status(200).json(cards);
    } catch (error) {
      return res.status(400).send({ error: 'Failed to fetch card' });
    }
  },

  async editCard(req: Request, res: Response) {
    if (isNaN(Number(req.body.idCard))) {
      return res.status(401).send({ error: 'Failed to update card' });
    }
    try {
      const deck = await CardModel.updateOneCard(req.body);
      return res.status(200).json(deck);
    } catch (error) {
      return res.status(400).send({ error: 'Failed to update card' });
    }
  },

  async deleteCard(req: Request, res: Response) {
    if (isNaN(Number(req.headers.idcard))) {
      return res.status(401).send({ error: 'Failed to delete card' });
    }

    try {
      const idCard = req.headers.idcard;
      await CardModel.deleteOneCard(idCard);
      return res.status(200).send({ ok: 'Successfully deleted' });
    } catch (error) {
      return res.status(400).send({ error: 'Failed to delete card' });
    }
  },
};
