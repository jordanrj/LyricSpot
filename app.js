var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
const cheerio = require('cheerio');





var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.render("index");
});

function createURL(artist, song) {
    let url = "http://www.metrolyrics.com/";
    artist = artist.replace("The", '');
    artist = artist.replace("and", '');
    
    artist = artist.replace(/[-']/gi, '');
    song = song.replace("Remastered", '');
    song = song.replace(/[-']/gi, '');
    artist = artist.replace(/[^\w\s] /gi, ' ');
    song = song.replace(/[^\w\s] /gi, ' ');

    artistArr = artist.split(' ');
    songArr = song.split(' ');
    for (let i = 0; i < songArr.length; i++) {
        if (songArr[i] !== '') {
             url += songArr[i] + '-';
            
        }
    }
    url += "lyrics-";
    for (let i = 0; i < artistArr.length; i++) {
        url += artistArr[i];
        if (i !== artistArr.length - 1 && artistArr[i] != '') {
            url += '-';
        }
    }
    console.log(url);
    return url;
}

app.get('/lyrics', function(req, res) {
    let url = createURL(req.query.artist, req.query.song);
    request(url, function(error, result, data) {
        if (!error) {
            var $ = cheerio.load(data);

            var lyrics = "";
            $("p.verse").each(function() {
                lyrics += '\n';
                lyrics += $(this).html();
                lyrics += "<br /><br /><br />";
            })

            res.send(lyrics); 
        } else {
            console.log("Error in app.js line 35");
        }
   });
})


app.listen(8888, function() {
    console.log("server up");
})