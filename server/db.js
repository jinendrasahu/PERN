const Pool = require("pg").Pool;

const pool = new Pool({
    host:"localhost",
    port:5432,
    user:"postgres",
    password:"1234",
    database:"companydb"

})

module.exports = pool;