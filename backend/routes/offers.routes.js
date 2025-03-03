import express from 'express';
import { getOfferById, sendOfferLetter, updateOfferStatus } from '../controllers/offers.controller.js';

const offerRouter  = express.Router();

offerRouter.post("/sendOffer", sendOfferLetter);

offerRouter.get("/getOffer/:jobSeekerId", getOfferById);

offerRouter.put("/updateStatus/:offerId", updateOfferStatus);

export default offerRouter;