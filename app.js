const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// serve static files from template
app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use('/main',express.static('main'));


const voting = require('./routes/voting-participation.route');
voting(app);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("server listen on port " + port);
});
