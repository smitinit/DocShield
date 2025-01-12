import express from "express";
import cors from "cors";

const app = express();
const port = 8080;

import { insights, fraudSignalsData } from "./data.js";

app.use(cors());

app.get("/insights", (req, res) => {
  res.send(insights);
});

app.get("/fraud-data", (req, res) => {
  res.send(fraudSignalsData);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
