// set up
let express = require('express')
let app = express()
let bodyParser = require('body-parser')

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
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;
  console.log(request.body.message) // write it on the command prompt so we can see
  let post = {}
  post.id = Math.round(Math.random() * 10000);
  post.message = request.body.message
  post.image = request.body.image
  if (post.image === "") {
    post.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Tarom.b737-700.yr-bgg.arp.jpg/1200px-Tarom.b737-700.yr-bgg.arp.jpg"
  }
  post.time = dateTime;
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
}
app.post('/posts', saveNewPost)

// listen for connections on port 3000
app.listen(process.env.PORT || 3000)
console.log("Hi! I am listening at http://localhost:3000")
