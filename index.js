import express from "express"
import bodyParser from "body-parser"

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));  // for form data (x-www-form-urlencoded)
app.use(express.json());  // for JSON payloads (if Postman sends JSON)

app.set('view engine', 'ejs');
app.set('views', './views');

let blogs = [];

app.get('/', (req, res) => {
    res.render('index.ejs', {
        blogs,
        editBlog: null,
        editIndex: null
    });
});
app.get("/connect", (req, res) => {
    res.render("connect.ejs");
})
app.post('/connect', (req, res) => {
    let { name, email, message } = req.body;

    if (!name || name.trim() === "") {
        name = "John Doe";
    }

    console.log('Received form submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    res.render("connect.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
})

app.get('/blogs', (req, res) => {
    res.render('blogs.ejs', { blogs, editBlog: null, editIndex: null });
});

app.post("/blogs", (req, res) => {
    const { author, blogTitle, blogDescription } = req.body;

    blogs.push({
        author,
        blogTitle,
        blogDescription,
        date: new Date()
    });
    console.log('Blog Added:');
    console.log('Author:', author);
    console.log('Title:', blogTitle);
    console.log('Description:', blogDescription);


    res.redirect("/"); // go back to homepage where all blogs are displayed
});

app.post('/blogs/delete', (req, res) => {
    const { index } = req.body;

    if (index !== undefined && blogs[index]) {
        blogs.splice(index, 1);  // remove by index
    }

    res.redirect('/');
});

app.get("/blogs/update", (req, res) => {
    const { index } = req.query;

    if (index !== undefined && blogs[index]) {
        res.render('updateBlog.ejs', {
            blogs,
            editBlog: blogs[index],
            editIndex: index
        });
    } else {
        res.redirect('/');
    }
})
app.post("/blogs/update", (req, res) => {
  const { index, author, blogTitle, blogDescription } = req.body;

  if (index !== undefined && blogs[index]) {
    blogs[index] = {
      author,
      blogTitle,
      blogDescription,
      date: blogs[index].date  // keep original date or update if you want
    };
  }

  res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})