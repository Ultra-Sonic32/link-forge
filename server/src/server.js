'use strict';
import express from 'express';
import cors from 'cors';
import { connectToLinkForgeDB } from './config/dbSetup.js';
import { router as urls } from './routes/url.routes.js';
import debugLib from 'debug';
const debug = debugLib('link-forge-server');

var app = express();

const initializeDBAndStartServer = async () => {
  try {
    await connectToLinkForgeDB();
    app.use(express.json());

    app.use(
      cors({
        origin: '*', // change to specific origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
      })
    );

    app.use('/urls', urls);

    // 404 Handler
    app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // Error Handlers
    if (app.get('env') === 'development') {
      app.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
          message: err.message,
          stack: err.stack,
          status: err.status || 500
        });
      });
    }

    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function () {
      debug('Express server listening on port ' + server.address().port);
      console.log(`Server running on port ${server.address().port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

initializeDBAndStartServer();
