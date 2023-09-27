const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/demo");
  console.log("db connected");
}

const examSchema = new mongoose.Schema({
  id: String,
  score: String,
  gazewarnings: String,
  backgroundApp: String,
  gazereview: String,
});

const exam = mongoose.model("examination", examSchema);

const server = express();
server.use(cors());
server.use(bodyParser.json());

server.post("/exam", async (req, res) => {
  let exam1 = new exam();
  exam1.id = req.body.id;
  exam1.score = req.body.score;
  exam1.backgroundApp = req.body.backgroundApp;
  exam1.gazewarnings = req.body.gazewarnings;

  const doc = await exam1.save();
  console.log(doc);
});

server.listen(8081, () => {
  console.log("server started");
});
