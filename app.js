const express = require("express");
const app = express();
const morgan = require("morgan")
app.use(express.static('public'))
const postBank = require("./postBank")
app.use(morgan('dev'));
app.get("/", (req, res) =>{
const posts = postBank.list()

const html = `<!DOCTYPE html>
<html>
<head>
  <title>Wizard News</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="news-list">
    <header><img src="/logo.png"/>Wizard News</header>
    ${posts.map(post => `
      <div class='news-item'>
        <p>
          <span class="news-position">${post.id}. ▲</span>
          <a href="/posts/${post.id}">${post.title}</a>
          <small>(by ${post.name})</small>
        </p>
        <small class="news-info">
          ${post.upvotes} upvotes | ${post.date}
        </small>
      </div>`
    ).join('')}
  </div>
</body>
</html>`
res.send(html);
})

app.get('/posts/:id', (req, res) => {

  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
   
    throw new Error(
      app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send('Something broke!')
      })
    )
  }
  const html = `<!DOCTYPE html>
  <html>
  <head>
  <link rel="stylesheet" href="/style.css" />
  <title>Wizard News></title>
  </head>
  <body>
  <div class="news-list">
  <header><img src="/logo.png"/>Wizard News</header>
  <div class='news-item'>
  <p>
    <span class="news-position">${post.id}. ▲</span>
    <span>${post.title}</span>
    <small>(by ${post.name})</small>
  </p>
  <br></br>
  <div>${post.content}</div>
  <small class="news-info">
  ${post.upvotes} upvotes | ${post.date}
</small>
</div>
  </body>
  </html>

  `
  res.send(html);
});
 

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
