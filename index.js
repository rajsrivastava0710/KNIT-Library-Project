const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const passportGoogle = require('./config/passport-google-oauth2-strategy.js');
const passportGithub = require('./config/passport-github-strategy.js');

const custoMware = require('./config/middleware');

app.use(sassMiddleware({
	src:'./assets/scss',
	dest:'./assets/css',
	debug: true,
	outputStyle:'extended' ,
	prefix:'/css'
}))

app.use(express.static('./assets'));

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:true}));


app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
	name:'cookie_1',
	secret:'random-encryption',
	saveUninitialized:false,
	resave:false,
	cookie:{
		maxAge:1000*60*60
		// in milli seconds
	},
	store: new MongoStore(
	{
		// mongooseConnection: db,
		url: 'mongodb://localhost/library_db',
		autoRemove: 'disabled'
	},
	function(err){
		console.log(err || 'connect mongo setup done');
	})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
//whenever app is initialised passport is also initialised and this function is called as middleware



app.use(flash());
//flash used after session
app.use(custoMware.setFlash);

app.locals.moment = require('moment');

app.use('/',require('./routes'));

app.listen(port , function(err){
	if(err){
		console.log(`Error in running server: ${err}`);
	}
	console.log(`Server is running on port: ${port}`);
});