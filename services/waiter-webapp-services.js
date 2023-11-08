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
        return await db.any("SELECT * FROM Users ORDER BY user_role,user_name");
    }

    async function allDays(){
        return await db.any("SELECT * FROM Days");
    }

    async function addSchedule(userName,days){
        const userRecord = await db.oneOrNone("SELECT * FROM Users WHERE User_Name = $1",userName);
        
        for (let day of days) {
            await db.none("INSERT INTO Schedule (FK_Waiter_ID, FK_Day_ID) VALUES ($1,$2)",[userRecord.id,day.id]);
        }
    }

    async function removeSchedule(userName){
        const userRecord = await db.oneOrNone("SELECT * FROM Users WHERE User_Name = $1",userName);

        await db.none("DELETE FROM Schedule WHERE FK_Waiter_ID = $1",userRecord.id);
    }

    async function getDayRecords(days){
        let daysArray=[];
        
        for(let i=0;i < days.length; i++){
            let day = days[i];
            let record = await db.any("SELECT * FROM Days WHERE day = $1",day)
            
            daysArray.push(record[0]);
        }
        
        return daysArray
    }

    async function getWaiterSchedule(userName){
        const userRecord = await db.oneOrNone("SELECT * FROM Users WHERE User_Name = $1",userName);
        if(userRecord){
            return await db.any("SELECT day FROM Schedule AS S JOIN Days AS D ON S.FK_Day_ID=D.ID WHERE S.FK_Waiter_ID = $1",userRecord.id);
        }
        else{
            return 'No user found';
        }
    }
    async function getWaiterDayRecord(user,day){
        return await db.any("SELECT user_name,day FROM Schedule AS S JOIN Days AS D on S.FK_Day_ID=D.ID JOIN Users AS U on S.FK_Waiter_ID=U.ID WHERE user_name = $1 AND day = $2",[user,day])
    }

    async function managerUpdateSchedule(user,currentDay,newDay){
        await db.none("UPDATE schedule SET FK_Day_ID = (SELECT ID FROM Days WHERE Day = $3) WHERE FK_Waiter_ID = (SELECT ID FROM Users WHERE User_Name = $1) AND FK_Day_ID = (SELECT ID FROM Days WHERE Day = $2);",[user,currentDay,newDay])
    }

    async function getSchedule(){
        return await db.any("SELECT user_name,day FROM Schedule AS S JOIN Days AS D on S.FK_Day_ID=D.ID JOIN Users AS U on S.FK_Waiter_ID=U.ID ORDER BY user_name");
    }

    async function addManager(choice){
        await db.none("UPDATE users SET user_role = 'Admin' WHERE user_name = $1",choice);
    }
    return{
        allDays,
        checkUser,
        addUser,
        allUsers,
        getDayRecords,
        addSchedule,
        removeSchedule,
        getWaiterSchedule,
        getWaiterDayRecord,
        managerUpdateSchedule,
        getSchedule,
        resetData,
        resetUsers,
        addManager,
    }
}