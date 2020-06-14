import { Router } from 'express';
import DeckController from './controllers/DeckController';
import CardController from './controllers/CardController';
import AuthController from './controllers/AuthController';
import authMiddleware from './middlewares/auth';

const routes = Router();

routes.post('/auth/register', AuthController.register);
routes.post('/auth/authenticate', AuthController.authenticate);

routes.use(authMiddleware);

routes.post('/deck', DeckController.createDeck);
routes.get('/deck', DeckController.findDecks);
routes.get('/deck/:idDeck', DeckController.findOneDecks);
routes.put('/deck', DeckController.editDeck);
routes.delete('/deck', DeckController.deleteDeck);

routes.post('/card', CardController.createCard);
routes.get('/card', CardController.findAllCards);
routes.put('/card', CardController.editCard);
routes.delete('/card', CardController.deleteCard);


export default routes;
