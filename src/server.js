const express = require("express");
const salesRoutes = require('./routes/sales.route');

const app = express();
const PORT = 8000;

app.use(express.json());


app.use('/api', salesRoutes);

app.get('/', (req, res) => {
  res.json({
    message: "Sales Lead Scoring API",
    status: "running"
  });
});

app.listen(PORT, () => {
  console.log("server is UP");
});
