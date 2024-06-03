import * as dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import db from "../models/index.js";
import conf from "../config/config.js";
import stripeInit from "stripe";

import onlyWill from "../middleware.js";

const Tag = db.sequelize.models.Tag;
const env = process.env.NODE_ENV || "development";
const config = conf[env];

const stripe = stripeInit(config.stripe_secret);

function calculateOrderAmount(items) {
    return 100;
}

async function createPaymentIntent(req, res) {
    const { items } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd"
    });

    res.send({
        clientSecret : paymentIntent.client_secret,
    });

}

function defineRoutes(app) {

    app.post("/create-payment-intent", createPaymentIntent);
    app.get("/checkout", (req, res) => res.render("checkout"));
}


export default defineRoutes;
