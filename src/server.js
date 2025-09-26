const express = require("express");


const app = express();
const PORT = 8000;

app.use(express.json());


app.use('/example', exampleRouter);

app.get('/', (req, res) => {
  res.json({
    message: "Sales Lead Scoring API",
    status: "running"
  });
});

app.listen(PORT, () => {
  console.log("server is UP");
});
