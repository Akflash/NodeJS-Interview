var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var app = express();
var md5 = require('md5');
const cors = require('cors');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "database",
    port: "3307"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
var sess;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/home', function (request, response) {
    sess = request.session;
    if (!sess.username) {
        return response.redirect('/')
    }
    response.sendFile(path.join(__dirname + '/home.html'));
})

app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    password = md5(md5(password));
    if (username && password) {
        con.query(`SELECT * FROM ilance_users WHERE username =  "${username}" and password =  "${password}"`, function (error, results, fields) {
            if (results.length > 0) {
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.end("Incorrect username/password \n Go Back");
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});
app.get('/logout', function (request, response) {
    request.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        response.redirect('/');
    });

});

app.post('/data', function (request, response) {



    let page = request.body.page;
    let currPage = page, count;
    page -= 1;
    let perPage = 2, start = page * perPage, msg = {}, flag = 0;
    if (request.body.dropvalue == 'Category Name') {
        let queryPagedata = `SELECT project_id,status from ilance_projects ORDER BY date_added ASC LIMIT ${start}, ${perPage}`;
        let queryPageNum = "SELECT COUNT(*) AS count FROM ilance_projects";
        con.query(queryPageNum, function (error, results) {
            if (error) {
                console.log('error');
                response.json({
                    status: false,
                    message: 'some error with the query'
                });
            }
            else {
                count = results[0].count
            }
        })
        con.query(queryPagedata, function (error, results, fields) {
            if (error) {
                console.log('error');
                response.json({
                    status: false,
                    message: 'some error with the query'
                });
            }
            else {
                msg["data"] = results;
                let paginations = Math.ceil(count / perPage), startLoop, endL;
                if (currPage >= 7) {
                    startLoop = currPage - 3;
                    if (paginations > currPage + 3) end = currPage + 3;
                    else if (currPage <= paginations && currPage > paginations) {
                        startLoop = paginations - 6;
                        endL = paginations;
                    }
                    else {
                        endL = paginations
                    }
                }
                else {
                    startLoop = 1;
                    if (paginations > 7) endL = 7
                    else endL = paginations
                }
                msg["start"] = startLoop
                msg["end"] = endL
                msg["page"] = currPage
                response.send({ msg })
                response.end()
            }
        })
    }
    else if (request.body.dropvalue == 'Username') {
        let queryPagedata = `SELECT user_id,username from ilance_users ORDER BY username ASC LIMIT ${start}, ${perPage}`;
        let queryPageNum = "SELECT COUNT(*) AS count FROM ilance_users";
        con.query(queryPageNum, function (error, results) {
            if (error) {
                console.log('error');
                response.json({
                    status: false,
                    message: 'some error with the query'
                });
            }
            else {
                count = results[0].count
            }
        })
        con.query(queryPagedata, function (error, results, fields) {
            if (error) {
                console.log('error');
                response.json({
                    status: false,
                    message: 'some error with the query'
                });
            }
            else {
                msg["data"] = results;
                let paginations = Math.ceil(count / perPage), startLoop, endL;
                if (currPage >= 7) {
                    startLoop = currPage - 3;
                    if (paginations > currPage + 3) end = currPage + 3;
                    else if (currPage <= paginations && currPage > paginations) {
                        startLoop = paginations - 6;
                        endL = paginations;
                    }
                    else {
                        endL = paginations
                    }
                }
                else {
                    startLoop = 1;
                    if (paginations > 7) endL = 7
                    else endL = paginations
                }
                msg["start"] = startLoop
                msg["end"] = endL
                msg["page"] = currPage
                response.send({ msg })
                response.end()
            }
        })
    }

    else if (request.body.dropvalue == 'Project Title') {
        let queryPagedata = `SELECT  project_id,project_title from ilance_projects ORDER BY project_title ASC LIMIT ${start}, ${perPage}`;
        let queryPageNum = "SELECT COUNT(*) AS count FROM ilance_projects";
        con.query(queryPageNum, function (error, results) {

            if (error) {
                console.log('error');
                response.json({
                    status: false,
                    message: 'some error with the query'
                });
            }
            else {
                count = results[0].count
            }
        })
        con.query(queryPagedata, function (error, results, fields) {
            if (error) {
                console.log('error');
                response.json({
                    status: false,
                    message: 'some error with the query'
                });
            }
            else {
                msg["data"] = results;
                let paginations = Math.ceil(count / perPage), startLoop, endL;
                if (currPage >= 7) {
                    startLoop = currPage - 3;
                    if (paginations > currPage + 3) end = currPage + 3;
                    else if (currPage <= paginations && currPage > paginations) {
                        startLoop = paginations - 6;
                        endL = paginations;
                    }
                    else {
                        endL = paginations
                    }
                }
                else {
                    startLoop = 1;
                    if (paginations > 7) endL = 7
                    else endL = paginations
                }
                msg["start"] = startLoop
                msg["end"] = endL
                msg["page"] = currPage
                response.send({ msg })
                response.end()
            }
        })

    }
    else {
        let queryPagedata = `SELECT  project_id,description from ilance_projects ORDER BY date_added DESC LIMIT ${start}, ${perPage}`;
        let queryPageNum = "SELECT COUNT(*) AS count FROM ilance_users";
        con.query(queryPageNum, function (error, results) {

            if (error) {
                console.log('error');
                response.json({
                    status: false,
                    message: 'some error with the query'
                });
            }
            else {
                count = results[0].count
            }
        })
        con.query(queryPagedata, function (error, results, fields) {
            if (error) {
                console.log('error');
                response.json({
                    status: false,
                    message: 'some error with the query'
                });
            }
            else {
                msg["data"] = results;
                let paginations = Math.ceil(count / perPage), startLoop, endL;
                if (currPage >= 7) {
                    startLoop = currPage - 3;
                    if (paginations > currPage + 3) end = currPage + 3;
                    else if (currPage <= paginations && currPage > paginations) {
                        startLoop = paginations - 6;
                        endL = paginations;
                    }
                    else {
                        endL = paginations
                    }
                }
                else {
                    startLoop = 1;
                    if (paginations > 7) endL = 7
                    else endL = paginations
                }
                msg["start"] = startLoop
                msg["end"] = endL
                msg["page"] = currPage
                response.send({ msg })
                response.end()
            }
        })


    }


});

app.listen(3000);
