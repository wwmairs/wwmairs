require("dotenv").config();
module.exports = 
{
    "development": {
        "dialect": "sqlite",
        "storage": process.env.SQLITE_PATH,
        "stripe_secret": process.env.STRIPE_SECRET_KEY,
        "stripe_public": process.env.STRIPE_PUBLIC_KEY,
        "env": "dev",
    },
    "production": {
        "dialect": "sqlite",
        "storage": process.env.SQLITE_PATH,
        "logging": false,
        "stripe_secret": process.env.STRIPE_SECRET_KEY,
        "stripe_public": process.env.STRIPE_PUBLIC_KEY,
        "env": "prod"
    }
};
