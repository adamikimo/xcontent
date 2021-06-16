// main file
// import staments
const express = require('express');
const router = require('./routes');
const mysql = require('mysql');
const {json, urlencoded} = require('body-parser');
// creating an instance of express
const app = express();

// converting the data to json format
app.use(json());
 app.use(urlencoded({
     extended: true
 }));

// connecting to db
const pool = mysql.createPool(
        {
            host: '35.224.172.207',
            user: 'root',
            password: 'root',
            database: 'xcontent',
            port: 3306
    }
);
pool.getConnection((err, connection) => {if(!err) console.log('connected to db'); else console.log(err);});
// routers
// first testing router
const main_route = router.get('/', 
        (req, res, next) => {
            res.json({test: 'test'})
    }
);


// querying the category table AS JSON API
const query_category = "SELECT * FROM xcontent.category";

const category = router.get('/category',
     async (req, res) => {
            pool.query(query_category, 
                (err, rows) => {
                    if(!rows){
                    res.status(404).json({
                        status: "Fatal error!",
                        err: err.code
                    });
                }
                else{
                    res.json(rows);
                }
            }
        );
    }
);


// querying the category table AS JSON API
const query_posts = "SELECT * FROM xcontent.posts";

const posts = router.get('/posts', 
async (req, res) => {
            pool.query(query_posts, 
                (err, rows) => {
                    if(!rows){
                    res.status(404).json({
                        status: "Fatal error!",
                        err: err.code
                    });
                }
                else{
                    res.json(rows);
                }
            }
        );
    }
);


// querying each post by its code feild AS JSON API
const query_posts_by_code = "SELECT * FROM xcontent.posts WHERE xcontent.posts.code=?";

const posts_code = router.get('/posts/code/:code', 
async (req, res) => {
            pool.query(query_posts_by_code, [req.params.code], 
                (err, rows) => {
                    if(!rows){
                    res.status(404).json({
                        status: "Fatal error!",
                        err: err.code
                    });
                }
                else{
                    res.json(rows);
                    console.log(`post code is: ${req.params.code}`);
                }
            }
        );
    }
);


// querying each post by its category code feild AS JSON API
const query_posts_by_cat_code = "SELECT * FROM xcontent.posts WHERE xcontent.posts.category_code=?";

const posts_catCode = router.get('/posts/category_code/:category_code', 
async (req, res) => {
            pool.query(query_posts_by_cat_code, [req.params.category_code], 
                (err, rows) => {
                    if(!rows){
                    res.status(404).json({
                        status: "Fatal error!",
                        err: err.code
                    });
                }
                else{
                    res.json(rows);
                    console.log(`post category_code is: ${req.params.category_code}`);
                }
            }
        );
    }
);


// excuting the routes
app.use(main_route);
app.use(category);
app.use(posts);
app.use(posts_code);
app.use(posts_catCode);



// initializing a port
const PORT = 3000;

// making the app listens at the port
app.listen(
     PORT,
     () => console.log(`The server is running at port ${PORT}`)
)