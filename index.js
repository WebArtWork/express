const express = require('express');
const app = express();
const server = require('http').Server(app);
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
module.exports = function(sd){
	if(sd.config.icon && sd.fs.existsSync(process.cwd() + sd.config.icon))
		app.use(favicon(process.cwd() + sd.config.icon));
	app.use(cookieParser());
	app.use(methodOverride('X-HTTP-Method-Override'));
	app.use(bodyParser.urlencoded({
		'extended': 'true',
		'limit': '50mb'
	}));
	app.use(bodyParser.json({
		'limit': '50mb'
	}));
	if(!sd.config.port) sd.config.port=8080;
	server.listen(sd.config.port);
	console.log("App listening on port " + (sd.config.port));
	/*
	*	Helpers
	*/
	sd.router = function(api){
		var router = express.Router();
		app.use(api, router);
		return router;
	}
	sd.app = app;
	sd.server = server;
	sd.cookieParser = cookieParser;
	sd.methodOverride = methodOverride;
	sd.bodyParser = bodyParser;
	/*
	*	Support for 0.x version of waw until 2.0
	*/
	sd._initRouter = sd.router;
	sd._app = app;
	sd.next = (req, res, next)=>next()
	sd.ensure = (req, res, next)=>{
		if(req.user) next();
		else res.json(false);
	}
}