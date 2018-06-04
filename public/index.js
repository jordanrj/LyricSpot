
// Handles interaction between app and api, as well as all data processing.
class App {
    constructor() {
        this.token = null;
        this.track = new Track();
    }

    //redirects to spotify user auth form
    getToken() {
        window.location = "https://accounts.spotify.com/authorize?client_id=1e456c18bc9d472b9a8e7a76fb2e0965&redirect_uri=http://localhost:8888/&scope=user-read-private%20user-read-currently-playing%20user-read-playback-state%20user-read-email&response_type=token";
    }

    //gets access token from query returned by the spotify auth page.  Adapted from stack overflow.
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        var regex = new RegExp("[#&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    //determines if we have auth token or not.  If not, we call the function to get it,
    // if we do have it, we call the function to get track info.
    nextStep() {
        let state = this;

        this.token = this.getParameterByName("access_token", window.location.href);
        if (this.token === null) {
            this.getToken();
        }

        this.getInfo()
        .then((data) => {
            state.track.processData(data);
            return this.getLyrics();
            //console.log(this.track.lyrics);
            //console.log("A:  " + this.getLyrics());
        })
        .then((lyrics) => {
            //console.log(lyr);
            this.track.lyrics = lyrics;
            state.track.render();
        })
        .catch((err) => {
            console.error("There was an Error. ", err.statusText);
            console.log(err);
        });
        return;
    }

   //sends request to spotify API and calls functions to process the response.
    getInfo() {
        let state = this;
        if (this.token !== null) {
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                
                xhr.open("GET", "https://api.spotify.com/v1/me/player/currently-playing");
                xhr.responseType = "json";
                xhr.setRequestHeader("Authorization", "Bearer " + state.token);   

                xhr.onload = function() {
                    if (this.status === 200 && this.readyState === 4) {               
                        resolve(xhr.response);
                    } 
                };
                xhr.onerror = function() {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                xhr.send(); 
            }); 
        }
    }

    //retrieves lyrics from server side api
    getLyrics() {
        let state = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/lyrics?artist=" + state.track.artist + "&song=" + state.track.name);

            xhr.onload = function() {
                    resolve(xhr.response);
                
            }

            xhr.onerror = function() {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        
            xhr.send();
        })
    }
}


//tack info for currently active song
class Track {
    constructor() {
        this.name = "";
        this.album = "";
        this.albumArtLg = "";
        this.albumArtMd = "";
        this.albumArtSm = "";
        this.albumLink = "";
        this.artist = "";
        this.artistLink = "";
        this.lyrics = "";
    }

    //Parse json for relevant data.  Details found at https://beta.developer.spotify.com/documentation/web-api/reference/player/get-the-users-currently-playing-track/
    processData(data) {
        this.name = data.item.name;
        this.album = data.item.album.name;
        this.albumArtLg = data.item.album.images[0].url;
        this.albumArtMd = data.item.album.images[1].url;
        this.albumArtSm = data.item.album.images[2].url;
        this.albumLink = data.item.album.external_urls.spotify;
        this.artist = data.item.artists[0].name;
        this.artistLink = data.item.artists[0].external_urls.spotify;
    }

    //renders track data to view
    render() {
        var height = 0;
        document.getElementById("title").innerHTML = this.name;
        document.getElementById("artist").innerHTML = this.artist;
        document.getElementById("artistLink").setAttribute("href", this.artistLink);
        document.getElementById("album").innerHTML = this.album;
        document.getElementById("albumLink").setAttribute("href", this.albumLink);
        document.getElementById("albumZone").style.backgroundImage = "url('" + this.albumArtLg + "')";
        document.getElementById("lyrics").innerHTML = this.lyrics;
        setInterval(function() {
            document.getElementById("lyrics").scrollTop(height);
            height++;
        }, 100);
    }
}

//main function for app execution
function main() {
    var app = new App();
    app.nextStep();
}

main();

