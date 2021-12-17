const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

const wikiSchema = mongoose.Schema({
    title:String,
    content:String
});

const Article = mongoose.model('Article', wikiSchema) //Model


/////////////////////////////////////////Request Targeting All Article/////////////////////////////////////////

app.route('/articles')
    .get((req, res) => {
        Article.find({}, (err, articleFound) => {
            res.send(articleFound);
        })
    })

    .post((req, res) => {
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(err => {
            if(err) {
                res.send(err);
            } else {
                res.send("Sukses menambahkan item!");
            }
        });
    })
    
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if(err){
                res.send("Berhasil Menghapus Item!")
            } else {
                res.send(err)
            }
        })
    });



/////////////////////////////////////////Request Targeting Specific Article/////////////////////////////////////////    
app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, articleFound) => {
            if(articleFound) {
                res.send(articleFound);
            } else {
                res.send("Artikel Tidak Ada!.");
            }
        })
    })
    .put((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            (err) => {
                if(!err) {
                    res.send("Sukses Mengupdate Artikel!");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if(!err) {
                    res.send("Sukses Mengupdate Artikel!");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if(!err) {
                    res.send("Sukses Menghapus Artikel!");
                } else {
                    res.send(err);
                }
            }
        );
    });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server start at port 3000");
});