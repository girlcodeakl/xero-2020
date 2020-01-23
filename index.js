// set up
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let databasePosts = null;

// If a client asks for a file,
// look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'))

// this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// make an empty list
let posts = []

// let a client GET the list
function sendPostsList(request, response) {
  response.send(posts)
}
app.get('/posts', sendPostsList)
app.get('/post', function (request, response) {
  let searchId = request.query.id;
  let post = posts.find(x => x.id == searchId);
  response.send(post);
  console.log("Searching for post " + searchId);
  response.send("fix this later");
});

// let a client POST something new
function saveNewPost(request, response) {
  var today = new Date();
  console.log(request.body.message) // write it on the command prompt so we can see
  console.log(request.body.author)
  let post = {}
  post.author = request.body.author;
  post.id = Math.round(Math.random() * 10000);
  post.message = request.body.message
  post.image = request.body.image
  if (post.image === "") {
    post.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Tarom.b737-700.yr-bgg.arp.jpg/1200px-Tarom.b737-700.yr-bgg.arp.jpg"

  }
  if (post.author === "") {
    post.author = "Guest";
  }
  post.time = today;
  posts.push(post) // save it in our list
  response.send("thanks for your message. Press back to add another")
  console.log(request.body.question)
  post.question = request.body.question
  console.log(request.body.answer1)
  post.answers = []; // empty list
  post.answers.push(request.body.answer1);
  post.answers.push(request.body.answer2);
  post.answers.push(request.body.answer3);
  post.answers.push(request.body.answer4);
  databasePosts.insert(post);
}
app.post('/posts', saveNewPost)

function answerChosen(request, response) {
  console.log("Post id: " + request.body.postId);
  console.log("Answer number: " + request.body.answerNumber);
  let post = posts.find(x => x.id == request.body.postId);
  let answerNumber = parseInt(request.body.answerNumber);
  if (post.answerCount === undefined) {
    post.answerCount = []; //starting values
    post.totalAnswers = 0;
  }
  if (!post.answerCount[answerNumber]) {
    post.answerCount[answerNumber] = 0
  }
  post.answerCount[answerNumber]++; //increase counter by one
  post.totalAnswers++; //increase counter by one
  databasePosts.update({ id: post.id }, post);
  response.send(post);
}
app.post("/answerChosen", answerChosen);

function commentHandler(request, response) {
  let post = posts.find(x => x.id == request.body.postId);
  post.answers.push(request.body.comment)
  databasePosts.update({ id: parseInt(request.body.postId) }, post)

  response.send(post);
}
app.post("/comment", commentHandler);

// let a client GET a specific author's posts
function sendAuthorPosts(request, response) {
  response.send(posts.filter(post => post.author === request.params.author))
}
app.get('/author/:author', sendAuthorPosts)

// listen for connections on port 3000
app.listen(process.env.PORT || 3000)
console.log("Hi! I am listening at http://localhost:3000")

let MongoClient = require('mongodb').MongoClient;
let databaseUrl = 'mongodb://girlcode:cats123@ds257698.mlab.com:57698/xero-2020';
let databaseName = 'xero-2020';

MongoClient.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  if (err) throw err;
  console.log("yay we connected to the database");
  let database = client.db(databaseName);
  databasePosts = database.collection('posts');
  databasePosts.find({}).toArray(function (err, results) {
    if (err) throw err;
    console.log("Found " + results.length + " results");
    posts = results
  });
  //pick and return a random element from the given list
  function pickRandomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
  };
  //give the client a random post
  function getRandomPost(request, response) {
    let randomPost = pickRandomFrom(posts);
    response.send(randomPost);
  };

  app.get('/random', getRandomPost);

});