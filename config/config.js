require("dotenv").config();
module.exports = 
{
    "development": {
        "dialect": "sqlite",
        "storage": process.env.SQLITE_PATH,
    },
    "production": {
        "dialect": "sqlite",
        "storage": process.env.SQLITE_PATH,
        "logging": false
    }
};
