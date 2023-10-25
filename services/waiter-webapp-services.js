import bcrypt from "bcrypt";

export default function queries(db){
    
    async function resetData(){
        // Clear schedule table
        await db.none("TRUNCATE TABLE Schedule RESTART IDENTITY CASCADE");
    }

    async function resetUsers(){
        // Clear waiters table
        await db.none("TRUNCATE TABLE Users RESTART IDENTITY CASCADE");
        // add default manager record
        await db.none("INSERT INTO Users (User_Role, User_Name, User_Password) VALUES ('Admin','Manager','P@ssword123')");
    }

    async function checkUser(userName){
        return await db.any("SELECT * FROM Users WHERE User_Name =$1",userName);
    }

    async function addUser(userName,password){
        
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password,10);
        
        // Add the record
        await db.none("INSERT INTO Users(User_Role, User_Name, User_Password) VALUES($1, $2, $3)", ['Waiter',userName, hashedPassword]);
    }
    
    async function allUsers(){
        return await db.any("SELECT * FROM Users");
    }

    async function allDays(){
        return await db.any("SELECT * FROM Days");
    }

    async function addSchedule(userName,days){
        const userRecord = await db.oneOrNone("SELECT * FROM Users WHERE User_Name = $1",userName);

        days.forEach(day => {
            //console.log(day.id);
            db.none("INSERT INTO Schedule (Weekday,FK_Waiter_ID, FK_Day_ID) VALUES ($1,$2,$3)",[day.day,userRecord.id,day.id]);
        })
    }

    async function getDayRecords(days){
        let daysArray=[];
        //console.log(days);
        for(let i=0;i < days.length; i++){
            let day = days[i];
            let record = await db.any("SELECT * FROM Days WHERE day = $1",day)
            //console.log('getDayRecords logging day: '+day);
            //console.log(record[0]);
            daysArray.push(record[0]);
            //daysArray.day += await db.any("SELECT * FROM Days WHERE day = $1",day);
            // do{
            //     daysArray.push(record[0]);
            // }while(record[0]!= undefined)
        }
        //console.log(daysArray);
        return daysArray
    }

    async function getWaiterSchedule(userName){
        const userRecord = await db.oneOrNone("SELECT * FROM Users WHERE User_Name = $1",userName);

        return await db.any("SELECT * FROM Schedule WHERE FK_Waiter_ID = $1",userRecord.id);
    }

    return{
        allDays,
        checkUser,
        addUser,
        allUsers,
        getDayRecords,
        addSchedule,
        getWaiterSchedule,
        resetData,
        resetUsers,
    }
}