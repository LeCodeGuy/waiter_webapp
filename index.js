// Import ExpressJS framework
import express from 'express';

// Import middleware
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';

// Import modules
import registrationNumberService from './services/registration_numbers_services.js';
import db from './routes/database_connection.js'
import registrationNumberRoutes from './routes/registration_numbers_routes.js'

// Setup a simple ExpressJS server
const app = express();

// Initialise session middleware - flash-express depends on this don't let it down
app.use(session({
    secret : '<add a secret string here>',
    resave: false,
    saveUninitialized: true
  }));

// Initialise flash middleware
app.use(flash());

// Make public folder available to the app
app.use(express.static('public'));

// handlebar engine settings
const handlebarSetup = exphbs.engine({
    partialsDir: './views/partials',
    viewPath: './views',
    layoutsDir: './views/layouts'
})
// setup handlebars
app.engine('handlebars', handlebarSetup);
// set handlebars as the view engine
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());

// Instantiate the app
let services = registrationNumberService(db);
let routes = registrationNumberRoutes(services);

// Routes
app.get('/', routes.pageLoad);

// Set PORT variable
let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('App starting on port', port);
});