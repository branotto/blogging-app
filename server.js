'use strict'

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL } = require('./config');
const {BlogPosts} = require('./models');

const app = express();

app.use(bodyParser.json());

app.use(morgan('common'));

app.get('/posts', (req, res) =>
{
    BlogPosts
        .find()
        .then(BlogPosts => res.json(
            BlogPosts.map(blogpost => blogpost.serialize())
        ))
        .catch(err =>
        {
            console.error(err);
            res.status(500).json({message: 'Internal server error'})

        });
});


let server;

function runServer(databaseUrl, port = PORT)
{
    return new Promise((resolve,reject) =>
    {
        mongoose.connect(DATABASE_URL, err =>
        {
         if(err)
         {
             return reject(err);
         }   

         server = app.listen(port, () =>
            {
                console.log(`Your app is listening on port ${port}.`);
                resolve();
            })
            .on('error', err =>
                {
                 mongoose.disconnect();
                reject(err);
                });
        });
    });
}

function closeServer()
{
    return mongoose.disconnect()
    .then( () =>
    {
        return new Promise(((resolve, reject) =>
        {
            console.log('Closing server.');
            server.close(err =>
            {
                if (err)
                {
                    return reject(err);
                }

                resolve();
            });
        }));
    });
}

if(require.main === module)
{
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer };