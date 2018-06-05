var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
const cheerio = require('cheerio');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

/* helper functions for requests */

    //removes punctuation and words ignored in queries
    function cleanBackupParam(param, type) {
        if (type === 'artist') {

            //only exception to including "The" in the artist name, so hardcoded
            if (param === "The Beatles" || param === "The Proclaimers" || param === "The Game") {
                param = param.replace("The", '');
            }
            param = param.replace("and", '');
            param = param.replace(/[-']/gi, '');
            param = param.replace(/[^\w\s] /gi, ' ');
            
            return param;
        }
        
        param = param.replace("Remastered", '');
        param = param.replace(/[-']/gi, '');
        param = param.replace(/[^\w\s] /gi, ' ');

        return param;
    }

    function cleanParam(param, type) {
        if (type === 'artist') {

            //only exception to including "The" in the artist name, so hardcoded
           
            param = param.replace("and", '');
            param = param.replace(/[-']/gi, '');
            param = param.replace(/[^\w\s] /gi, ' ');
            
            return param;
        }
        
        param = param.replace("Remastered", '');
        param = param.replace(/[']/gi, '');
        param = param.replace(/[^\w\s] /gi, ' ');
        param = param.replace(/[{()}]/g, '');

        return param;
    }



app.get('/', function(req, res) {
    res.render("index");
});

function createURL(artist, song) {
    let url = "https://www.musixmatch.com/lyrics/";

    artist = cleanParam(artist, 'artist');
    song = cleanParam(song, 'song');
    artistArr = artist.split(' ');
    songArr = song.split(' ');

    //removes empty chars from array, then joins with '-'
    for (let i = 0; i < artistArr.length; i++) {
        if (artistArr[i] === '') {
            artistArr.splice(i, 1);
            i--;
        }
    }
    url += artistArr.join('-');

    url += "/";

    //removes empty chars from array, then joins with '-'    
    for (let i = 0; i < songArr.length; i++) {
        if (songArr[i] == '') {
            songArr.splice(i, 1);
            i--;
        }
    }
    url += songArr.join('-');

    console.log(url);

    return url;
}


function createBackupURL(artist, song) {
    let url = "http://www.metrolyrics.com/";
    
    artist = cleanBackupParam(artist, 'artist');
    song = cleanBackupParam(song, 'song');
    artistArr = artist.split(' ');
    songArr = song.split(' ');

    //joins the songArr into a string while ignoring blank chars
    for (let i = 0; i < songArr.length; i++) {
        if (songArr[i] !== '') {
             url += songArr[i] + '-';
        }
    }

    url += "lyrics-";

    //joins the artistArr into a string while ignoring blank chars
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
            $("p.mxm-lyrics__content").each(function() {
                lyrics += '\n';
                lyrics += $(this).html();
            })

            if (lyrics != '' && lyrics != " ") {
                console.log("good");
                
                res.send(lyrics);
            } else {
                console.log("backup");
                url = createBackupURL(req.query.artist, req.query.song);
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
                        console.log("error");
                    }
                })
            }
        } else {
            console.log("FULL FAIL");
        }    
   });
})


app.listen(8888, function() {
    console.log("server up");
})