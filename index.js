const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');

let app = express();
let port = 3000;

//crear middleware
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, './views/layouts/')
}));
app.set('view engine', 'hbs');

app.get('/', function(req, res) { // '/' = ruta raiz al metodo get
    res.render('profile');
})
app.listen(port, () => console.log('Ejecutando en puerto ' + port));

