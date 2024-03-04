const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

const db = new sqlite3.Database('./Database/Musics.sqlite');

app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS music (
    id INTEGER PRIMARY KEY,
    title TEXT,
    singer TEXT,
    genre TEXT,
    musicImg TEXT,
    release_date TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT,
    email TEXT,
    age TEXT,
    role TEXT DEFAULT 'user'
)`);

db.run(`CREATE TABLE IF NOT EXISTS playlist (
    playlist_id INTEGER PRIMARY KEY,
    playlistname TEXT,
    music_id INTEGER,
    title TEXT,
    singer TEXT,
    user_id INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS review (
    review_id INTEGER PRIMARY KEY,
    music_id INTEGER,
    user_id INTEGER,
    score DOUBLE,
    comment TEXT
)`);

// user db
app.get('/user', (req,res) => {
    db.all(`SELECT * FROM user`, (err,rows) => {
        if (err) res.status(500).send(err);
        else res.json(rows);
    });
});

app.get('/user/:user_id', (req,res) => {
    db.get(`SELECT * FROM user WHERE user_id = ?`, req.params.user_id, (err,rows) => {
        if (err) res.status(500).send(err);
        else {
            if (!rows) res.status(404).send('user not found');
            else res.json(rows);
        }
    });
});

app.post('/user', (req,res) => {
    const user = req.body;
    db.run(`INSERT INTO user (username,password,email,age) VALUES (?,?,?,?)`, user.username, user.password, user.email, user.age, function(err) {
        if (err) res.status(500).send(err);
        else {
            user.id = this.lastID;
            res.send(user);
        }
    });
});

app.put('/user/:user_id', (req,res) => {
    const user = req.body;
    db.run(`UPDATE user SET username = ?, password = ? , email = ?, age = ? , role = ? WHERE user_id = ?`, user.username, user.password, user.email, user.age, user.role, req.params.user_id, function(err) {
        if (err) res.status(500).send(err);
        else res.send(user);
    });
});

app.delete('/user/:user_id', (req,res) => {
    db.run(`DELETE FROM user WHERE user_id = ?`, req.params.user_id, function(err) {
        if (err) res.status(500).send(err);
        else res.send({});
    });
});

// music db
app.get('/music', (req,res) => {
    db.all(`SELECT * FROM music`, (err,rows) => {
        if (err) res.status(500).send(err);
        else res.json(rows);
    });
});

app.get('/music/:id', (req,res) => {
    db.get(`SELECT * FROM music WHERE id = ?`, req.params.id, (err,rows) => {
        if (err) res.status(500).send(err);
        else {
            if (!rows) res.status(404).send('music not found');
            else res.json(rows);
        }
    });
});

app.post('/music', (req,res) => {
    const music = req.body;
    db.run(`INSERT INTO music (title,singer,genre,musicImg,release_date) VALUES (?,?,?,?,?)`, music.title, music.singer,music.genre,music.musicImg,music.release_date, function(err) {
        if (err) res.status(500).send(err);
        else {
            music.id = this.lastID;
            res.send(music);
        }
    });
});

app.put('/music/:id', (req,res) => {
    const music = req.body;
    db.run(`UPDATE music SET title = ?, singer = ? , genre = ?, musicImg = ? , release_date = ? WHERE id = ?`, music.title, music.singer,music.genre,music.musicImg,music.release_date, req.params.id,function(err) {
        if (err) res.status(500).send(err);
        else res.send(music);
    });
});

app.delete('/music/:id', (req,res) => {
    db.run(`DELETE FROM music WHERE id = ?`, req.params.id, function(err) {
        if (err) res.status(500).send(err);
        else res.send({});
    });
});


// playlist db 
app.get('/playlist', (req,res) => {
    db.all(`SELECT * FROM playlist`, (err,rows) => {
        if (err) res.status(500).send(err);
        else res.json(rows);
    });
});

app.get('/playlist/:playlist_id', (req, res) => {
    db.get(`SELECT * FROM playlist WHERE playlist_id = ?`, req.params.playlist_id, (err, row) => {
        if (err)  res.status(500).send(err);
        else {
            if (!row)res.status(404).send('Playlist not found');
            else res.json(row);
        }
    });
});

app.get('/musicplaylist/:playlist_id', (req, res) => {
    db.all(`SELECT music.*, playlist.*
    FROM playlist 
    JOIN music ON playlist.music_id = music.id
    WHERE playlist_id = ?`, req.params.playlist_id, (err, rows) => {
        if (err)  res.status(500).send(err);
        else {
            if (!rows || rows.length === 0) res.status(404).send('Playlist not found');
            else res.json(rows);
        }
    });
});

app.post('/playlist', (req,res) => {
    const playlist = req.body;
    db.run(`INSERT INTO playlist (playlistname, music_id, title, singer, user_id) VALUES (?, ?, ?, ?, ?)`,playlist.playlistname, playlist.music_id, playlist.title, playlist.singer, playlist.user_id, function(err) {
    if (err) res.status(500).send(err);
    else {
        playlist.playlist_id = this.lastID;
        res.send(playlist);
        }
    });
});

 app.put('/playlist/:playlist_id', (req, res) => {
    const playlist = req.body;
    db.run(`UPDATE playlist SET playlistname = ?, music_id = ?, title = ?, singer = ?, user_id = ? WHERE playlist_id = ?`,playlist.playlistname,playlist.music_id,playlist.title,playlist.singer,playlist.user_id,req.params.playlist_id,function (err) {
            if (err) res.status(500).send(err);
            else res.send(playlist);
        }
    );
}); 

app.delete('/playlist/:playlist_id', (req,res) => {
    db.run(`DELETE FROM playlist WHERE playlist_id = ?`, req.params.playlist_id, function(err) {
        if (err) res.status(500).send(err);
        else res.send({});
    });
});


// review db
app.get('/review', (req,res) => {
    db.all(`SELECT * FROM review`, (err,rows) => {
        if (err) res.status(500).send(err);
        else res.json(rows);
    });
});

app.get('/review/:review_id', (req,res) => {
    db.get(`SELECT * FROM review WHERE review_id = ?`, req.params.review_id, (err,rows) => {
        if (err) res.status(500).send(err);
        else {
            if (!rows) res.status(404).send('review not found');
            else res.json(rows);
        }
    });
});

app.post('/review', (req,res) => {
    const review = req.body;
    db.run(`INSERT INTO review (review_id,reviewname,) VALUES (?,?)`, review.review_id, review.reviewname, function(err) {
        if (err) res.status(500).send(err);
        else {
            review.review_id = this.lastID;
            res.send(review);
        }
    });
});

app.put('/review/:review_id', (req,res) => {
    const review = req.body;
    db.run(`UPDATE review SET reviewname = ? , password = ? , name = ? , age = ? , role = ? WHERE review_id = ?`, review.reviewname,review.password,review.name,review.age,review.role, req.params.review_id,function(err) {
        if (err) res.status(500).send(err);
        else res.send(review);
    });
});

app.delete('/review/:review_id', (req,res) => {
    db.run(`DELETE FROM review WHERE review_id = ?`, req.params.review_id, function(err) {
        if (err) res.status(500).send(err);
        else res.send({});
    });
});

app.post("/createreview",(req,res) => {
    console.log(req.body);
    db.run(`INSERT INTO review (music_id,user_id,score,comment) VALUES (?,?,?,?)`,req.body.music_id,req.body.user_id,req.body.score,req.body.comment,(err) => {
        if (err) {
            res.status(500).send(err);
        }
        else{
            res.json({});
        }
    }); 
});

app.get("/getcomment/:id", (req, res) => {
    db.all(`SELECT user.*, music.*, review.*
    FROM music
    JOIN review ON music.id = review.music_id
    JOIN user ON user.user_id = review.user_id
    WHERE music.id = ?`, req.params.id, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}...`));