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
        this.token = this.getParameterByName("access_token", window.location.href);
        if (this.token === null) {
            this.getToken();
        } 
        this.getInfo();
        return;
    }

   //sends request to spotify API and calls functions to process the response.
    getInfo() {
        let state = this;
        if (this.token !== null) {
            var xhr = new XMLHttpRequest();
        
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    state.processRes(xhr.response);
                    state.track.render();
                } else {
                    console.error("Error: " + this.status);
                }
            }
        
            xhr.open("GET", "https://api.spotify.com/v1/me/player/currently-playing");
            xhr.responseType = "json";
            xhr.setRequestHeader("Authorization", "Bearer " + this.token);   
            xhr.send(); 
        }
    }

    //Parse json for relevant data.  Details found at https://beta.developer.spotify.com/documentation/web-api/reference/player/get-the-users-currently-playing-track/
    processRes(data) {
        let track = this.track;
        track.name = data.item.name;
        track.album = data.item.album.name;
        track.albumArtLg = data.item.album.images[0].url;
        track.albumArtMd = data.item.album.images[1].url;
        track.albumArtSm = data.item.album.images[2].url;
        track.albumLink = data.item.album.external_urls.spotify;
        track.artist = data.item.artists[0].name;
        track.artistLink = data.item.artists[0].external_urls.spotify;
        return;
    }
}



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

    //renders track data to view
    render() {
        document.getElementById("title").innerHTML = this.name;
        document.getElementById("artist").innerHTML = this.artist;
        document.getElementById("artistLink").setAttribute("href", this.artistLink);
        document.getElementById("album").innerHTML = this.album;
        document.getElementById("albumLink").setAttribute("href", this.albumLink);
        console.log(this.albumArtLg);
        document.getElementById("albumZone").style.backgroundImage = "url('" + this.albumArtLg + "')";
    }
}


function main() {
    var app = new App();
    app.nextStep();
}

