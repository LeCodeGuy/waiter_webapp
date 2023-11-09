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
                
                // Get user record
                const userRecord = await query.checkUser(user);

                if(userRecord.length>0){
                    if(userRecord[0].user_role == role){
                        if(pass){                    
                        
                            // Compare the hashed password with the password entered by the user
                            const isPasswordMatch = bcrypt.compareSync(pass, userRecord[0].user_password);
            
                            if (isPasswordMatch || pass==userRecord[0].user_password) {
                                // Passwords match
                                //console.log("Passwords match. User authentication successful.");
                                
        
                                if(role == 'Waiter' && userRecord[0].user_role == role){
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
                        // Roles do not match
                        req.flash('loginError', 'Invalid user role, please select a different role');    
                        res.redirect('/login');
                    }
                }
                else{
                    // User not found
                    req.flash('loginError', 'The username, '+user+', was not found');    
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
    // ! Waiter page load
    async function pageLoad(req,res){
        loggedIn = true;
        let weekData = await query.allDays();
        const user= req.params.username;
        const waiterSchedule = await query.getWaiterSchedule(user);
        let myArr = [];

        if(loggedIn == true){
            if(waiterSchedule == 'No user found'){
                // redirect to registration screen if user account does not exist
                res.redirect('/register');
            }
            else{

                //console.log(waiterSchedule);
                for(let i=0; i<waiterSchedule.length;i++){
                    myArr.push(waiterSchedule[i].day);
                }

                res.render('waiters',{
                    // variables to be passed to handlebars
                    tabTitle:'Waiter Scheduling',
                    user,
                    weekData,
                    waiterSchedule:myArr,
                    loggedIn,
                })
            }
        }
        else {
            // redirect to landing page
            res.redirect('/');
        }        
    }
    // ! Waiter page update Schedule
    async function scheduling(req, res){
        let selectedDays = req.body.day;
        const userName = req.params.username;
        const currentSchedule = await query.getWaiterSchedule(userName);
        
        // fix to cater for when only 1 day is selected.
        // without the fix the req.body.day returns a string value for a single selection
        if(typeof selectedDays === 'string'){
            // convert the string to an array for the length check to work lower down
            selectedDays = [selectedDays];
        }
        
        if(selectedDays.length >= 3 && selectedDays.length <= 5){
            let dayRecordsSelection = await query.getDayRecords(selectedDays);
            // If no records exist
            if(currentSchedule.length == 0){
                // add current selection to the schedule
                await query.addSchedule(userName,dayRecordsSelection);
                req.flash('success', 'Schedule updated successfully!');
            }
            // If scheduled records exist
            else{
                //remove existing records
                await query.removeSchedule(userName);

                // add current selection to the schedule
                await query.addSchedule(userName,dayRecordsSelection);
                req.flash('success', 'Schedule updated successfully!');
            }
            
            res.redirect('/waiters/'+userName);
        }
        else{
            req.flash('error','Please schedule between 3 and 5 days');
            res.redirect('/waiters/'+userName);
        }        
    }
    // ! Manager page load
    async function getSchedule(req, res){
        loggedIn = true;

        if(loggedIn == true){
            let weekData = await query.allDays();
            let staff = await query.allUsers();
            let scheduledDays = await query.getSchedule();
            
            const restructuredData = scheduledDays.reduce((acc, curr) => {
                const existingEntry = acc.find(item => item.day === curr.day);
                if (existingEntry) {
                  existingEntry.waiters.push(curr.user_name);
                } else {
                  acc.push({ day: curr.day, waiters: [curr.user_name] });
                }
                return acc;
            }, []);
            
            // Merge datasets
            const mergedData = weekData.map(dayItem => {
                // find item where the day properties match
                const waitersItem = restructuredData.find(function(waiterItem) {
                                        return waiterItem.day === dayItem.day;
                                    });
                // If there is a match add the record to the mergedData array
                if (waitersItem) {
                    let waitersCount;
                    // count the number of items in the waiters array
                    if (Array.isArray(waitersItem.waiters)) {
                        waitersCount = waitersItem.waiters.length;
                    } else {
                        waitersCount = 0;
                    }

                    return { day: waitersItem.day, waiters: waitersItem.waiters, count: waitersCount };
                } else {
                    // If there is no match add the day and no waiters to have a full data set
                    return { day: dayItem.day, waiters: 'No Waiters', count: 0 };
                }
            });
            
            res.render('manage',{
                // variables to be passed to handlebars
                tabTitle:'Manager View',
                weekData,
                scheduledDays: mergedData,
                staff,
                user:'Manager',
                loggedIn,
            })
        }
        else{
            res.redirect('/');
        }        
    }

    async function addManager(req,res){
        const choice = req.body.employees;

        if(choice != 'Select'){
            await query.addManager(choice);
        }
        else{
            req.flash('error','Invalid manager selection, Please select a name from the dropdown before clicking on Add');
        }
        
        res.redirect('/days');
    }

    async function updateSchedule(req,res){
        const user = req.body.waiters;
        const currentDay = req.body.dayCurrent;
        const newDay = req.body.dayNew;
        const existingRecord = await query.getWaiterDayRecord(user,currentDay);;
        
        if(currentDay != newDay){
            if(existingRecord.length>0){
                await query.managerUpdateSchedule(user,currentDay,newDay);
            }
            else{
                req.flash('error',user+' does not currently have '+currentDay+' scheduled! No change made');
            }
        }
        else{
            req.flash('error','Invalid day selection, the current day and new schedule day cannot be the same');
        }
        
        res.redirect('/days');
    }    
    async function reset(req, res){
        await query.resetData();
        req.flash('resetSuccess','The schedule was reset!')
        res.redirect('/days');
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
        addManager,
        updateSchedule,
        reset,
        logout,
    }
}