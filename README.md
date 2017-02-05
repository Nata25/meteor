# Web Sources Rating

Simple one-page [Meteor.js](https://www.meteor.com/) app.

## Overview

A skeleton for an app  which displays and rate user's favorite web sites.

## Features
1. initially, 4 sources are displayed
2. all users can vote up or down displayed sources; the sources are dynamically arranged according to the rating (the highest rated are on the top)
3. users can register and login/out
4. registered users can add new sources (title, URL, description) which by default get 0 rating
5. on clicking "Learn more" button details page is rendered where user can also vote pro/contra; results are preserved
6. on page reload and even project restart, the list of sources and number of votes are preserved (it is needed to manually clean up a MongoDB database to restart app from scratch)
7. one-page approach is implemented via Routing.

## Technologies used:

- Meteor.js
- MongoDB
- Bootstrap
- iron:router

------

This is a Final Project for [Introduction to Meteor.js Development](https://www.coursera.org/account/accomplishments/certificate/QL6DVTFWAJ7L) online course by _University of London & Goldsmiths, University of London_ via [Coursera](https://www.coursera.org).

[Certificate earned](https://www.coursera.org/account/accomplishments/certificate/QL6DVTFWAJ7L) in September 2016.

NOTE: You need to [install Meteor.js](https://www.meteor.com/install) on your local machine to run the app.
