import pgPromise from 'pg-promise';
import 'dotenv/config'

// Instantiate pg-promise
let pgp = pgPromise();

// which db connection to use
const cs = process.env.CONNECTION_STRING;

// Instaniate Database
const database = pgp(cs);

export default database