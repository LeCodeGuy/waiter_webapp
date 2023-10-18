import bcrypt from "bcrypt";

export default function queries(db){
    
    async function resetData(){
        // Clear waiters table
        await db.none("TRUNCATE TABLE Users RESTART IDENTITY CASCADE");
        // Clear schedule table
        await db.none("TRUNCATE TABLE Schedule RESTART IDENTITY CASCADE");
    }

    async function addUser(userName,password){
        
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password,10);
        
        // Add the record
        await db.none("INSERT INTO Users(User_Name, User_Password) VALUES($1, $2)", [userName, hashedPassword]);
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

    async function getSchedule(userName){
        const userRecord = await db.oneOrNone("SELECT * FROM Users WHERE User_Name = $1",userName);

        return await db.any("SELECT * FROM Schedule WHERE FK_Waiter_ID = $1",userRecord.id);
    }

    return{
        allDays,
        addUser,
        allUsers,
        addSchedule,
        getSchedule,
        resetData,
    }
}