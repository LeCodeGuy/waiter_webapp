import assert from "assert";
import db from "../routes/database-connection.js";
import queries from "../services/waiter-webapp-services.js";

const query= queries(db);

describe("Waiter Web App testing", function(){
    this.timeout(6000);
    
    this.beforeEach(async function (){
        await query.resetData();
    });

    it("Test 1", async function (){
        assert.equal(1, 1);
    });

    this.afterAll(function () {
        db.$pool.end;
    });
})