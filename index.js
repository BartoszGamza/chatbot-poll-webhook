"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json()); // creates http server
const token = "VERIFICATION_TOKEN"; // type here your verification token

app.listen(3000, () => console.log("[ChatBot] Webhook is listening"));
app.get("/", (req, res) => {
  if (req.query.token !== token) {
    return res.sendStatus(401);
  }

  return res.end(req.query.challenge);
});
app.post("/", (req, res) => {
  if (req.query.token !== token) {
    return res.sendStatus(401);
  }

  const valuesArray = req.body.result.contexts
    .map((element) => element.parameters.answer)
    .filter(Boolean);

  const value = valuesArray.reduce(
    (a, b, i, arr) =>
      arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
        ? a
        : b,
    null
  );

  const data = {
    responses: [
      {
        type: "setAttributes",
        filters: [],
        elements: [
          {
            name: "result",
            action: "set",
            value,
          },
        ],
      },
    ],
  };

  res.json(data);
});
