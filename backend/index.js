const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const globals = require('./globals');

globals.mode = 'debug';
const API = require('./routes/api');

const app = express();
const port = globals.server_port;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', API);

app.all('*', (req, res) => {
  res.status(globals.status_codes.Not_Found).json();
});

module.exports = app.listen(port, () => globals.log_msg(`Doggie Hunt Server Side listening at http://localhost:${port}`));
