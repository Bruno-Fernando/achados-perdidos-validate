const express = require("express");

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  const { matricula, password } = req.body;
  res.send(`Hello World! matricula: ${matricula}, password: ${password}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
