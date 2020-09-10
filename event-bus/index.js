const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
   const event = req.body;
   events.push(event);
   axios.post("http://comments-srv:4001/events", event);
   axios.post("http://posts-clusterip-srv:4002/events", event);
   axios.post("http://query-srv:4003/events", event);
   axios.post("http://modretor-srv:4004/events", event);
   res.send({ status: "OK" });
});

app.get("/events", (req, res) => res.send(events));

app.listen(4006, () => console.log("listning on 4006"));
