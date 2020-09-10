const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
   if (type === 'Commnet created') {
      const { id, content, postId } = data;
      const post = posts[postId];
      post.comments.push({ id, content, status });
   }
   if (type === 'post created') {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
   }
   if (type === 'commentUpdated') {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      const comment = post.comments.find(comment => {
         return comment.id === id;
      });
      comment.status = status;
      comment.content = content;
   }
};

app.get('/posts', (req, res) => {
   res.send(posts);
});

app.post('/events', (req, res) => {
   const { type, data } = req.body;
   handleEvent(type, data);
   res.send(posts);
});

app.listen(4003, async () => {
   console.log('Listening on 4003');
   const events = await axios.get('http://event-bus-srv:4006/events');
   for (let event of events.data) {
      console.log('Processing data.', event.type);
      handleEvent(event.type, event.data);
   }
});
