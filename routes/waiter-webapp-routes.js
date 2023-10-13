export default function waiterApp(query){
    async function pageLoad(req,res){

        res.render('home',{
            // variables to be passed to handlebars
            tabTitle:'Home - WaiterApp',
        })
    }

    return{
        pageLoad,
    }
}