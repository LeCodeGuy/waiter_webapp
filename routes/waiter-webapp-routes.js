// import { as } from "pg-promise";

export default function waiterApp(query){
    async function pageLoad(req,res){
        let weekData = await query.allDays();
        const user= req.params.username

        res.render('waiters',{
            // variables to be passed to handlebars
            tabTitle:'Waiter Scheduling',
            user,
            weekData,
        })
    }

    async function addSchedule(req, res){
        let selectedDays = req.body;
        let weekData = await query.allDays();
        const userName = req.params.username;

        //console.log(selectedDays);
        res.render('waiters',{
            tabTitle:'Waiter Scheduling',
            user:userName,
            weekData,
        })
    }

    return{
        pageLoad,
        addSchedule,
    }
}