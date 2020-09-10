const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
   const { type, data } = req.body;
   console.log(data);
   if (type === "Commnet created") {
      const status = data.content.includes("orange") ? "rejected" : "approved";
      await axios.post("http://event-bus-srv:4006/events", {
         type: "Comment Moderated",
         data: { id: data.id, postId: data.postId, status: status, content: data.content },
      });
   }

   res.send({});
});

app.listen(4004, () => {
   console.log("Listening on 4004");
});
