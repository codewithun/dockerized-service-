require("dotenv").config();

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Route publik
app.get("/", (req, res) => {
  res.type("text").send("Hello, world!");
});

// Route rahasia dengan Basic Authentication
app.get("/secret", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Secret Area"');
    return res.status(401).send("Authentication required");
  }

  const encodedCredentials = authHeader.slice(6);

  let credentials;
  try {
    credentials = Buffer.from(
      encodedCredentials,
      "base64"
    ).toString("utf8");
  } catch {
    return res.status(401).send("Invalid credentials");
  }

  const separator = credentials.indexOf(":");

  if (separator < 0) {
    return res.status(401).send("Invalid credentials");
  }

  const username = credentials.slice(0, separator);
  const password = credentials.slice(separator + 1);

  if (
    username !== process.env.USERNAME ||
    password !== process.env.PASSWORD
  ) {
    res.set("WWW-Authenticate", 'Basic realm="Secret Area"');
    return res.status(401).send("Invalid username or password");
  }

  return res
    .type("text")
    .send(process.env.SECRET_MESSAGE || "No secret configured");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
