const express = require('express');
const app = express();

const router = require('./app');

// app.set('view engine', 'ejs');
app.set('view engine', 'html');
//app.use(express.static('public'));
app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

router(app, '/');

app.get('/', (req, res) => res.render('index.html'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
