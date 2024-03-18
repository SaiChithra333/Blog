const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const Post = require('./models/post'); 

const app = express();
const port = process.env.PORT || 3000; 


mongoose.connect('mongodb://localhost:27017/blog-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));


app.use(bodyParser.json()); 

app.post('/posts', async (req, res) => {
  const { title, content, author } = req.body; 
  try {
    const newPost = new Post({ title, content, author });
    await newPost.save();
    res.json({ message: 'Post created successfully!' });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Error creating post!' });
  }
});


app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error('Error getting posts:', err);
    res.status(500).json({ message: 'Error getting posts!' });
  }
});


app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }
    res.json(post);
  } catch (err) {
    console.error('Error getting post:', err);
    res.status(500).json({ message: 'Error getting post!' });
  }
});


app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body; 
  try {
    const post = await Post.findByIdAndUpdate(id, { title, content, author }, { new: true }); 
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }
    res.json(post);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Error updating post!' });
  }
});


app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }
    res.json({ message: 'Post deleted successfully!' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Error deleting post!' });
  }
});
app.listen(port, () => console.log(`Server listening on port ${port}`));
