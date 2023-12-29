const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

module.exports = {
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    SECRET: process.env.SECRET
}