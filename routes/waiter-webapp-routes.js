import bcrypt from "bcrypt";

export default function waiterApp(query){
    let loggedIn
    const regexVal = /^[A-Za-z|\s|-]+$/;
    let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    //Helper functions
    function titleCase(str) {
        //keep track of the original string passed
        const originalStr = str;
        const regexHyphen = /-/
        str = str.toLowerCase().split(/\s|-/);

        for (var i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
        }

        if(regexHyphen.test(originalStr)=== true){
           str = str.join('-')
        }
        else{
            str = str.join(' ');
        }

        return str;
    }

    async function home(req,res){
        res.render('home',{
            tabTitle:'Home - Scheduling App',
            pageTitle:'Welcome to the waiter scheduling app',
            loggedIn,
        })
    }

    // Get route for when the register button is clicked on the home page
    function regClicked(req, res) {
        res.render('register',{
            tabTitle: 'Registration - Scheduling App',
            pageTitle: 'Register a profile',
        })
    }

    // Post route for registration screen
    async function registration(req,res){
        let userName = req.body.userName;
        const pass= req.body.userPassword;
        const pass2 = req.body.passwordConfirm;

        if(userName){
            // Converts the username to title case
            userName = titleCase(userName);

            // Check if the username is alphabetic
            if(regexVal.test(userName)){
                // Check if password conforms to standard
                if(passRegex.test(pass)){
                    if(pass.trim() === pass2.trim()){
                        const checkDB = await query.checkUser(userName);
                        // Check if username exists
                        if(checkDB.length === 0){
                            // username does not exist add to DB
                            await query.addUser(userName,pass);
                            res.redirect('/login');
                        }else{
                            // username already exists
                            req.flash('regError', 'Profile already exist! Please log in or create a new profile');
                            res.redirect('/register');
                        }                                            
                    }else{
                        // Passwords do not match
                        req.flash('regError', 'The passwords provided do not match!');
                        res.redirect('/register');
                    }
                }else{
                    // Passwords does not meet requirements
                    req.flash('regError','The password provided is not secure enough!')
                    res.redirect('/register');
                }                
            }
            else{
                //Invalid username
                req.flash('regError', userName+' is an invalid name! A name must only contain letters');
                res.redirect('/register');
            }
        }
        else{
            //No name provided
            req.flash('regError', 'Please enter your name');
            res.redirect('/register');
        }
    }

    // Route for when the login button is clicked on the home page
    function loginClicked(req, res) {
        res.render("login",{
            tabTitle:'Login - Scheduling App',
            pageTitle:'Log in to continue',
        });
      }
    
    async function login(req, res, next){
        const role = req.body.userType;
        let user = req.body.username;
        const pass = req.body.password;

        if(user || pass){
            if(user){
                // Converts the username to title case
                user = titleCase(user);
                
                if(pass){
                    // Get user record
                    const userRecord = await query.checkUser(user);
                    
                    // Compare the hashed password with the password entered by the user
                    const isPasswordMatch = bcrypt.compareSync(pass, userRecord[0].user_password);
    
                    if (isPasswordMatch || pass==userRecord[0].user_password) {
                        // Passwords match
                        //console.log("Passwords match. User authentication successful.");
                        

                        if(role == 'Waiter'){
                            loggedIn = true;
                            res.redirect('/waiters/'+user);
                        }
                        else if(role == 'Admin'){
                            loggedIn = true;
                            res.redirect('/days');
                        }
                    } else {
                        // Passwords do not match
                        req.flash('loginError', 'The password does not match.');    
                        res.redirect('/login');
                    }
                }
                else{
                    //No password provided
                    req.flash('loginError', 'Please enter your password');
                    res.redirect('/login');
                }
            }
            else{
                //No name provided
                req.flash('loginError', 'Please enter your name');
                res.redirect('/login');
            }
        }else{
            //No name or password provided
            req.flash('loginError', 'Please enter your name and password');
            res.redirect('/login');
        }
        
    }

    async function pageLoad(req,res){
        console.log('log in status'+loggedIn);
        let weekData = await query.allDays();
        const user= req.params.username;
        const waiterSchedule = await query.getWaiterSchedule(user);
        console.log('waiterSchedule: '+waiterSchedule);
        if(loggedIn == true){
            if(waiterSchedule == 'No user found'){
                // redirect to registration screen if user account does not exist
                res.redirect('/register');
            }
            else{
                res.render('waiters',{
                    // variables to be passed to handlebars
                    tabTitle:'Waiter Scheduling',
                    user,
                    weekData,
                    waiterSchedule,
                    loggedIn,
                })
            }
        }
        else {
            // redirect to landing page
            res.redirect('/');
        }        
    }

    async function scheduling(req, res){
        let selectedDays = req.body.day;
        const userName = req.params.username;
        const currentSchedule = await query.getWaiterSchedule(userName);
        // console.log(currentSchedule.length);
        console.log('Scheduling selected days');
        console.log(selectedDays.length);
        // TODO Get all records for the current user
        // TODO IF the length is 0 ,add the schedule records else remove the records and then add the updated schedule
        if(selectedDays.length < 3 || selectedDays.length > 5){
            req.flash('scheduleError','Please schedule between 3 and 5 days ')
            res.redirect('/waiters/'+userName);
        }
        else{
            req.flash('scheduleSuccess','Do next check');
            res.redirect('/waiters/'+userName);
        }

        //let dayRecordsSelection = await query.getDayRecords(selectedDays);
        // await query.addSchedule(userName,dayRecordsSelection);
        //req.flash('scheduled', 'Schedule updated successfully!');
        
        
    }

    async function getSchedule(req, res){
        console.log('log in status'+loggedIn);
        if(loggedIn == true){
            let weekData = await query.allDays();
            let staff = await query.allUsers();

            res.render('manage',{
                // variables to be passed to handlebars
                tabTitle:'Manager View',
                weekData,
                staff,
                user:'Manager',
                loggedIn,
            })
        }
        else{
            res.redirect('/');
        }        
    }

    async function updateSchedule(req,res){

    }    

    function logout(reg, res){
        loggedIn = false;
        res.redirect('/');
    }

    return{
        home,
        loginClicked,
        login,
        regClicked,
        registration,
        pageLoad,
        scheduling,
        getSchedule,
        updateSchedule,
        logout,
    }
}