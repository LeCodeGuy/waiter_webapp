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
        if(userRecord){
            return await db.any("SELECT day FROM Schedule AS S JOIN Days AS D ON S.FK_Day_ID=D.ID WHERE S.FK_Waiter_ID = $1",userRecord.id);
        }
        else{
            return 'No user found';
        }
    }

    async function getSchedule(){
        return await db.any("SELECT user_name,day FROM Schedule AS S JOIN Days AS D on S.FK_Day_ID=D.ID JOIN Users AS U on S.FK_Waiter_ID=U.ID");
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
        getSchedule,
        resetData,
        resetUsers,
    }
}