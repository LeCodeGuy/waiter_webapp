// import { as } from "pg-promise";

export default function waiterApp(query){
    let loggedIn
    async function home(req,res){
        loggedIn = false;
        res.render('home',{
            tabTitle:'Home - Scheduling App',
            pageTitle:'Waiter scheduling app',
            loggedIn,
        })
    }
    
    async function regPageLoad(req, res){
        //const userName = req.params.userName;
        //const pass = req.params.

        //res.redirect('/');
        res.render('register',{
            tabTitle:'Registration',
            pageTitle: 'Create a profile',
            username: req.body.userName,
        })
    }

    async function registration(req,res){
        const userName = req.params.username;
        const pass= req.params.pass;
        const pass2 = req.params.pass2;

        console.log(userName + pass + pass2);
        res.render('register',{
            tabTitle:'Registration',
            pageTitle: 'Create a profile',
        })
    }

    async function pageLoad(req,res){
        loggedIn = true 
        let weekData = await query.allDays();
        const user= req.params.username

        res.render('waiters',{
            // variables to be passed to handlebars
            tabTitle:'Waiter Scheduling',
            user,
            weekData,
            loggedIn,
        })
    }

    async function addSchedule(req, res){
        loggedIn = true
        let selectedDays = req.body.day;
        let weekData = await query.allDays();
        const userName = req.params.username;

        //await query.addUser(userName,'P@ssword');
        //await query.getDayRecords(selectedDays);


        //console.log(selectedDays);
        res.render('waiters',{
            tabTitle:'Waiter Scheduling',
            user:userName,
            weekData,
            loggedIn,
        })
    }

    return{
        home,
        regPageLoad,
        registration,
        pageLoad,
        addSchedule,
    }
}