# CS 290 Group 25 Final Project

## About

**Members:** Gabriel Kulp  
**Demo time:** Wednesday, December 5. 14:00-14:10

## How to run

### First-time setup
Install and configure MariaDB. Make sure your database is running and accessible as described in `dbcon.js`. You'll need a table called `posts` with a primary auto-incrementing column called `id` and a JSON column called `data`.
Run `npm install` to install the needed Node.js modules.

### Starting the server
Just run `npm start` for the default configuration and it'll tell you the port.  
If you want a different port, use `PORT=#### npm start`, where #### is the port.  
To start on a system-level port, use `sudo PORT=80 npm start`.
