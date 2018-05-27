#!/usr/bin/python
#import libraries
from flask import Flask
import urllib2
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello, World!"

'''
url = "https://www.azlyrics.com/lyrics/georgemichael/faith.html";

# get page
page = urllib2.urlopen(url);

#parse page so soup holds html
soup = BeautifulSoup(page, 'html.parser');

#find target tag
target = soup.find('div', attrs={'class', "main-page"})
target = target.find('div', attrs={'class', "row"})
target = target.find('div', attrs={'class', "col-xs-12 col-lg-8 text-center"})
target = target.find('div', attrs={'class': None})
response = target.text.strip()

print(response)
'''