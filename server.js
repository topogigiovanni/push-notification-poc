const express = require('express');
const app = express();

const router = require('./app');

// app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.use(express.static('public'))

router(app, '/');

app.get('/', (req, res) => res.render('index.html'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));