const config = require('../config.json');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.googleAuthCode);

module.exports = async idToken => {
    let ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: config.googleAuthCode,
    });

    let payload = ticket.getPayload();

    if (payload) return payload;
    else Promise.reject("idToken not real")

}