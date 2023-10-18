import assert from "assert";
import db from "../routes/database-connection.js";
import queries from "../services/waiter-webapp-services.js";

const query= queries(db);

describe("Waiter Web App testing", function(){
    this.timeout(6000);
    
    this.beforeEach(async function (){
        await query.resetData();
    });

    it("should allow adding a waiter", async function (){
        await query.addUser('Devan','P@ssword');
        
        let result = await query.allUsers();
        
        assert.equal(1,result.length);
    });

    it("should allow adding multiple waiters", async function (){
        await query.addUser('Devan','P@ssword');
        await query.addUser('Jolene','myPass123');
        await query.addUser('Themba','S3cur1ty_123~');

        let result = await query.allUsers();

        assert.equal(3, result.length);
    });

    it("should return data for all days", async function (){
        let result = await query.allDays();
        
        assert.deepEqual([
            { id: 1, day: 'Monday' },
            { id: 2, day: 'Tuesday' },
            { id: 3, day: 'Wednesday' },
            { id: 4, day: 'Thursday' },
            { id: 5, day: 'Friday' },
            { id: 6, day: 'Saturday' },
            { id: 7, day: 'Sunday' }
          ], result);
    });

    it("should allow scheduling a day", async function (){
        await query.addUser('Devan','P@ssword');
        await query.addSchedule('Devan',[{ id: 4, day: 'Thursday' }]);

        let result = await query.getSchedule('Devan');
        
        assert.equal(1, result.length);
    });

    it("should allow scheduling multiple days", async function (){
        await query.addUser('Devan','P@ssword');
        await query.addSchedule('Devan',[{ id: 1, day: 'Monday' },{ id: 2, day: 'Tuesday' },{ id: 3, day: 'Wednesday' }]);

        let result = await query.getSchedule('Devan');
        
        assert.equal(3, result.length);
    });

    this.afterAll(function () {
        db.$pool.end;
    });
})