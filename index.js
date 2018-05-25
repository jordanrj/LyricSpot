var login = false;
if (login === false) {
    window.location = "https://accounts.spotify.com/authorize?client_id=1e456c18bc9d472b9a8e7a76fb2e0965&redirect_uri=https:%2F%2Fjordanrj.github.io%2FLyricSpot%2F&scope=user-read-private%20user-read-email&response_type=token";
}



/*var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhr.responseText);
    }
}
xhr.open("GET", );
https://cors-anywhere.herokuapp.com/
xhr.send();*/