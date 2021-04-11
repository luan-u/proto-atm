async function connect(){
    if (global.connection)
        return global.connection.connect();

    const { Pool } = require('pg');

    const pool = new Pool({
        // postgres://usuario:senha@servidor:porta/banco
        // pw: r34WG7VcdfJvN4WplbWYHEk
        // TODO: move credentials to a external file
        connectionString: 'postgres://luan:r34WG7VcdfJvN4WplbWYHEk@localhost:5432/test_atm'
    });
    
    // conn test
    const client = await pool.connect();
    console.log("Created pool for psql connections.");

    const response = await client.query('SELECT NOW()');
    console.log(response.rows[0]);
    client.release();

    global.connection = pool;
    return pool.connect();
}

async function selectAllUsers() {
    const client = await connect();
    const response = await client.query('SELECT * FROM atm_users');
    client.release();
    return response.rows;
}

async function selectUserByCpf(user) {
    const client = await connect();
    const sql = 'SELECT * FROM atm_users WHERE cpf=$1;';
    const values = [user];
    const response = await client.query(sql, values);
    client.release();
    return response;
}
	
async function insertUser(user){
    const client = await connect();
    const sql = 'INSERT INTO atm_users (name, cpf, b_date) VALUES ($1,$2,$3);';
    const values = [user.name, user.cpf, user.b_date];
    const response = await client.query(sql, values);
    client.release();
    return response;
}
	
async function updateUser(id, user){
    const client = await connect();
    const sql = 'UPDATE atm_users SET name=$1, cpf=$2, b_date=$3 WHERE cpf=$4';
    const values = [user.name, user.cpf, user.b_date, id];
    const response = await client.query(sql, values);
    client.release();
    return response;
}

async function deleteUser(user){
    const client = await connect();
    const sql = 'DELETE FROM atm_users where cpf=$1;';
    const response = await client.query(sql, [user]);
    client.release();
    return response;
}

async function selectAccountById(id){
    const client = await connect();
    const sql = 'SELECT * FROM atm_accounts WHERE id_account=$1;';
    const values = [id];
    const response = await client.query(sql, values);
    client.release();
    return response;
}

async function selectAccountByCpf(cpf){
    const client = await connect();
    const sql = 'SELECT * FROM atm_accounts WHERE cpf=$1;';
    const values = [cpf];
    const response = await client.query(sql, values);
    client.release();
    return response;
}

async function insertAccount(account){
    const client = await connect();
    const sql = 'INSERT INTO atm_accounts (cpf, type, balance) VALUES ($1,$2,$3);';
    const values = [account.cpf, account.type, account.balance];
    const response = await client.query(sql, values);
    client.release();
    return response;
}

async function updateAccountBalance(id, amount, operation){
    const client = await connect();

    const sql = (() => {
        if (operation === "add"){
            return 'UPDATE atm_accounts SET balance=balance+$1 WHERE id_account=$2;';
        }
        else if (operation === "subtract"){
            return 'UPDATE atm_accounts SET balance=balance-$1 WHERE id_account=$2;';
        }
        // I don't really expect this return to be reached
        else return 'Invalid Operation;'
    })();
    
    const values = [amount, id];
    const response = await client.query(sql, values);
    client.release();
    return response;
}

module.exports = {selectAllUsers, selectUserByCpf, insertUser, updateUser, deleteUser,
                selectAccountById, selectAccountByCpf, insertAccount, updateAccountBalance}
