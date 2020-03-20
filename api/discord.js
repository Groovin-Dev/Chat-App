const express = require('express');
const session = require('express-session');
const axios = require('axios');
const btoa = require('btoa');

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent(
    'http://localhost:4000/api/discord/callback'
);

router.get('/login', (req, res) => {
    res.redirect(
        `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`
    );
});

router.get('/callback', async (req, res) => {
    if (!req.query.code) throw new Error(`NoCodeProvided`);

    let code = req.query.code;
    let creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    let response = await axios({
        url: `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
        method: 'POST',
        headers: {
            Authorization: `Basic ${creds}`,
        },
    });

    let userToken = response.data.access_token;
    let userInfo = await axios({
        url: `https://discordapp.com/api/users/@me`,
        method: `GET`,
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    });

    //console.log(userInfo.data);

    let user = userInfo.data;

    if (user.avatar) {
        user.avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${
            user.avatar
        }.${user.avatar.startsWith('a_') ? 'gif' : 'png'}`;
    } else {
        user.avatarURL =
            'https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png';
    }

    req.session.user = user;

    res.redirect('/');
});

module.exports = router;
