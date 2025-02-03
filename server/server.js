const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const previewRouter = require('./routes/preview');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', previewRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});