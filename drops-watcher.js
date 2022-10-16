const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");

const clientId = process.env.TWITCH_API_CLIENT_ID;
const clientSecret = process.env.TWITCH_API_CLIENT_SECRET;
