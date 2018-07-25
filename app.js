var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
const cheerio = require('cheerio');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));


/* helper functions for requests */
/* NOTE: Though some functions concerning primary and backup are very similar, the formats required for 
   the requests are diifferent enough that I feel they warrant having their own functions */

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
            param = param.replace(/[-']/gi, '');
            param = param.replace(/[^\w\s] /gi, ' ');
            
            return param;
        }
        
        param = param.replace("Remastered", '');
        param = param.replace(/[']/gi, '-');
        param = param.replace(/[^\w\s] /gi, ' ');
        param = param.replace(/[{()}]/g, '');

        return param;
    }

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

        //checks for a hanging '-' at the end of url
        if (url[url.length - 1] == '-') {
            url = url.substring(0, url.length - 1);
        }
        
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
    
        return url;
    }







/* Request handlers */    
app.get('/', function(req, res) {
    res.render("index");
});


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
                //if request successful send lyrics             
                res.send(lyrics);
            } else {
                //check backup source for lyrics
                url = createBackupURL(req.query.artist, req.query.song);
                request(url, function(error, result, data) {
                    if (!error) {
                        var $ = cheerio.load(data);

                        var lyrics = "";
                        $("p.verse").each(function() {
                            lyrics += '\n';
                            lyrics += $(this).html();
                            lyrics += "<br /><br />";
                        })

                        if (lyrics != '' && lyrics != ' ') {
                            res.send(lyrics); 
                        } else {
                            res.send("Sorry! \n The lyrics for this song are unavailable :(");
                        }
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