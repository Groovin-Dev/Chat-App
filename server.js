if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('views', path.join(__dirname, 'frontend'));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'basic chat app',
        resave: false,
        saveUninitialized: true,
    })
);

app.use('/api/discord', require('./api/discord'));

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    if (req.session.user) {
        let user = req.session.user;
        console.log(`Authed`);
        res.render('index', { user });
    } else {
        res.render('index');
    }
});

io.on('connection', function(socket) {
    socket.on('message_send', function(msg) {
        io.emit('message_send', msg);
    });
});

app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.message,
            });
        default:
            return res.status(500).send({
                status: 'ERROR',
                error: err.message,
            });
    }
});

/* Hosting frontend */
http.listen(4000, () => {
    console.log(`Listening on *:4000`);
});
