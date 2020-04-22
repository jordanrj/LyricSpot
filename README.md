﻿# LyricSpot

LyricSpot is a tool that allows you to view the lyrics of your currently playing song on Spotify.

Requires: 
    *express
    *bodyParser
    *request
    *cheerio


Functionality:
    The site interacts with the Spotify Web API to fetch the information for the user's currently playing song, and then converts that info into a 'Track' object and finally creates a valid URL to fetch lyrics from. The URL is used to fetch page info from various destinations via web scraping and the info is then returned to the client and rendered. If the first request fails or returns a blank response, a second destination is then tried using a different formatting technique.  If both scraping souces return empty strings an error message is displayed to the user.

Current Limitations: 
    *Does not automatically refresh when user changes song.
    *Minor inconsistencies in formatting
    *No playback control




PLEASE NOTE: This is just a hobby project,. 
