// Import ExpressJS framework
import express from 'express';

// Import middleware
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';

// Import modules
import waiterService from './services/waiter-webapp-services.js';
import db from './routes/database-connection.js'
import waiterRoutes from './routes/waiter-webapp-routes.js'

// Setup a simple ExpressJS server
const app = express();

// Use Helmet!
//app.use(helmet());

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

// // Define custom helpers
// const hbs = exphbs.create({
//     helpers: {
//         eq: function (v1, v2) {
//             return v1 === v2;
//         }
//     }
// });

// handlebar engine settings
const handlebarSetup = exphbs.engine({
    // Define custom helpers
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        }
    },
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
let services = waiterService(db);
let routes = waiterRoutes(services);

// *Routes
// Landing page
app.get('/',routes.home);

// Login page
app.get("/login",routes.loginClicked);
app.post("/login",routes.login);

// Registration page
app.get('/register',routes.regClicked);
app.post('/register',routes.registration);

// Waiters page
app.get('/waiters/:username', routes.pageLoad);
app.post('/waiters/:username', routes.scheduling);

// Management Page
app.get('/days',routes.getSchedule);
app.post('/days',routes.updateSchedule);

// Reset route
app.get('/reset',routes.reset);
// log out route
app.post('/logout',routes.logout);

// Set PORT variable
let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('App starting on port', port);
});