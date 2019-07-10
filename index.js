console.log('EXPRESS LOADED');
var session = require('express-session');
var express = require('express');
var app = express();
module.exports = function(sd){
	console.log('called');
	var sessionMaxAge = 365 * 24 * 60 * 60 * 1000;
	if(typeof sd.config.session == 'number'){
		sessionMaxAge = sd.config.session;
	}
	app.use(session({
		key: 'express.sid.'+sd.config.prefix,
		secret: 'thisIsCoolSecretFromWaWFramework'+sd.config.prefix,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: sessionMaxAge,
			domain: sd.config.domain||undefined
		},
		rolling: true,
		//store: store
	}));

	sd.router = function(api){
		var router = express.Router();
		app.use(api, router);
		return router;
	}
	// support old code
	sd._initRouter = sd.router;
	sd.app = app;
	sd._app = app;
}