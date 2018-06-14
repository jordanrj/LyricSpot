# LyricSpot

LyricSpot is a tool that allows you to view the lyrics of your currently playing song on Spotify.

Requires: 
    *express
    *bodyParser
    *request
    *cheerio


Functionality:
    Interacts with Spotify web api to fetch user's current playing info, converting that info into a Track object and creating a url to fetch lyrics from.  Url used to fetch page info from destinations, info is then returned to the client and rendered. If first request fails, or returns blank response, a second destination is then tried, using a different formatting technique.  If both return empty strings, an error message is displayed to the user.

Current Limitations: 
    *Does not automatically refresh when user changes song.
    *Minor inconsistencies in formatting
    *No playback control




PLEASE NOTE: This is just a hobby project. 