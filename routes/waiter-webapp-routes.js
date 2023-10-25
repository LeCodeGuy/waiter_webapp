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
        loggedIn = false;
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

        if(user){
            // Converts the username to title case
            user = titleCase(user);
            // Get user record
            const userRecord = await query.checkUser(user);
            
            // Compare the hashed password with the password entered by the user
            const isPasswordMatch = bcrypt.compareSync(pass, userRecord[0].user_password);

            if (isPasswordMatch || pass==userRecord[0].user_password) {
                // Passwords match
                console.log("Passwords match. User authentication successful.");
                //console.log(role);
                //console.log(user);
                if(role == 'Waiter'){
                    res.redirect('/waiters/'+user);
                }
                else if(role == 'Admin'){
                    res.redirect('/days');
                }
            } else {
                // Passwords do not match
                console.log("Passwords do not match. User authentication failed.");
            }
        }
        else{
            //No name provided
            req.flash('loginError', 'Please enter your name');
            res.redirect('/login');
        }
    }

    async function pageLoad(req,res){
        loggedIn = true 
        let weekData = await query.allDays();
        const user= req.params.username;
        const waiterSchedule = await query.getWaiterSchedule(user);

        res.render('waiters',{
            // variables to be passed to handlebars
            tabTitle:'Waiter Scheduling',
            user,
            weekData,
            waiterSchedule,
            loggedIn,
        })
    }

    async function addSchedule(req, res){
        loggedIn = true
        let selectedDays = req.body.day;
        let weekData = await query.allDays();
        const userName = req.params.username;

        //await query.addUser(userName,'P@ssword');
        let dayRecordsSelection = await query.getDayRecords(selectedDays);
        await query.addSchedule(userName,dayRecordsSelection);

        //console.log('Selected Days: '+selectedDays);
        //console.log(dayRecordsSelection);
        // res.render('waiters',{
        //     user:userName,
        //     weekData,
        //     loggedIn,
        // })
        res.redirect('/waiters/'+userName);
    }

    function getSchedule(req, res){
        res.render('manage',{
            // variables to be passed to handlebars
            tabTitle:'Manager View',
        })
    }

    async function updateSchedule(req,res){

    }    

    function logout(reg, res){
        res.redirect('/');
    }

    return{
        home,
        loginClicked,
        login,
        regClicked,
        registration,
        pageLoad,
        addSchedule,
        getSchedule,
        updateSchedule,
        logout,
    }
}