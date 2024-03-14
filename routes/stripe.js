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

function defineRoutes(app) {
}


export default defineRoutes;
