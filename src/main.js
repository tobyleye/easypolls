const express = require("express");
const http = require("http");
const cors = require("cors");
const { queryDbPool, queryDb } = require("./db");
const websocket = require("./websocket");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const httpServer = http.createServer(app);
websocket(httpServer, app);

const port = process.env.PORT ?? 5500;
httpServer.listen(port, () => console.log("listening on port " + port));

const parsePollOptions = (polls) => {
  polls.forEach((row) => {
    row.options = JSON.parse(row.options);
  });
};

app.get("/health-check", (req, res) => {
  res.json({ message: "all gooddd" });
});

app.post("/polls/new", async (req, res) => {
  let body = req.body.body;
  let options = req.body.options;
  let expiresAt = req.body.expiresAt;

  body = body.trim();
  if (body.length === 0) {
    return res.status(400).json({ error: "message cannot be empty" });
  }

  options = options.map((opt) => opt.trim());
  if (options.length < 2 || options.some((opt) => opt === "")) {
    return res.status(400).json({
      error:
        "options must have a minimum of 2 items and each items must not be empty",
    });
  }

  // initialize options with votes
  options = options.map((opt) => {
    return {
      option: opt,
      votes: 0,
    };
  });

  // everything is good. lets insert into db
  try {
    const { results } = await queryDbPool(
      "insert into poll (body, options, expiresAt ) values(?,?)",
      [body, JSON.stringify(options), expiresAt]
    );

    res.json({
      success: true,
      message: "poll created successfully",
      id: results.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/polls/latest", async (req, res) => {
  try {
    const { results } = await queryDbPool("select id, body, options from poll");
    parsePollOptions(results);
    res.json({ data: results });
  } catch (err) {
    console.log("err --", err);
    res.status(500).json({ message: err.message });
  }
});

const reportError = (res, error) => {
  console.log("@@error occured", error);
  res.status(500).json({ error: "an uknowen error occured. sorry!" });
};

const getPollMiddleware = () => async (req, res, next) => {
  try {
    const { results } = await queryDbPool(
      "select id, body, options, createdAt, expiresAt from poll where id = ?",
      [req.params.id]
    );
    if (results.length === 0) {
      res.status(404).json({ error: "poll not found" });
    } else {
      parsePollOptions(results);
      req.poll = results[0];
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

app.get("/polls/:id", getPollMiddleware(), async (req, res) => {
  res.json({ data: req.poll });
});

app.post("/polls/:id/vote", getPollMiddleware(), async (req, res) => {
  let poll = req.poll;
  let choice = req.body.choice;
  let invalidChoice = true;

  for (let option of poll.options) {
    if (option.option === choice) {
      invalidChoice = false;
      option.votes++;
      break;
    }
  }

  if (invalidChoice) {
    return res.status(400).json({ error: "invalid choice" });
  }

  let pollId = req.params.id;

  try {
    await queryDbPool(`UPDATE poll SET options = ? WHERE id = ?`, [
      JSON.stringify(poll.options),
      pollId,
    ]);
    res.json({ data: poll });
  } catch (err) {
    reportError(res, err);
  }
});
