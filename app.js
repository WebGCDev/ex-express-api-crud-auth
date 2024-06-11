const express = require('express');
const postRouter = require('./routers/postRouter');
const authRouter = require('./routers/authRouter');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/posts', postRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
