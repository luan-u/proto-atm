const db = require("./db-controller");

function currencyPicker(cashAmount){
    // should I move this to other file?
    var distribution = {
        "possible": "yes",
        "qty_100": 0,
        "qty_50": 0,
        "qty_20": 0
    }

    if (cashAmount < 0){
        distribution.possible = "no";
        return distribution;
    }

    if ((cashAmount % 10) !== 0){
        // if it is not a multiple of 10, then it is not possible to withdraw
        distribution.possible = "no";
        return distribution;
    }

    if (cashAmount == 10 || cashAmount == 30){
        // if the requested amount is 10 or 30 it is not possible to withdraw
        // due to non-usage of 10 bills (as per requirements)
        distribution.possible = "no";
        return distribution;
    }

    // This first part covers cases as 20, 40, 60, 80, 120 and so on.
    distribution.qty_100 = parseInt(cashAmount/100);
    var remainder100 = cashAmount % 100;

    distribution.qty_20 = parseInt(remainder100/20);
    var remainder20 = remainder100 % 20;

    if (remainder20 === 0) return distribution;
    // This second part covers cases such as 50, 70, 90, 150 and so on.
    
    distribution.qty_50 = parseInt(remainder100/50);
    var remainder50 = remainder100 % 50;

    distribution.qty_20 = parseInt(remainder50/20);
    var remainder20 = remainder50 % 20;

    if (remainder20 === 0) return distribution;

    // This part covers cases such as 110, 130, 210, 230 and so on.    
    distribution.qty_100 -= 1;
    distribution.qty_50 += 1;
    remainder50 += 50;

    distribution.qty_20 = parseInt(remainder50/20);
    remainder20 = remainder50 % 20;

    return distribution;
}

// no wide GET for not exposing accounts (?)
// exports.get = async function (request, response){}

exports.getById = async function (request, response){
    try{
        const results = await db.selectAccountById(request.params.id);
        if (results.rowCount !== 0){
            response.status(200).json(results.rows[0]);
        } else response.status(404).json({error: 'No account found with provided id'});
    }
    catch (err){
        response.status(500).json(err);
    }
}

exports.getByCpf = async function (request, response){
    try{
        const results = await db.selectAccountByCpf(request.params.cpf);
        if (results.rowCount !== 0){
            response.status(200).json(results.rows);
        } else response.status(404).json({error: 'No accounts found with provided CPF'});
    }
    catch (err){
        response.status(500).json(err);
    }
}

exports.post = async function (request, response){
    try{
        const results = await db.insertAccount(request.body);
        if (results.rowCount !== 0){
            response.sendStatus(201);
        }
        else response.status(500).json(results);
    }
    catch (err){
        if (err.constraint === "atm_accounts_cpf_fkey"){
            response.status(400).json({error: "User must be created before creating account"});
        }
        else if (err.constraint === "account_type"){
            response.status(400).json({error: "Account type must be C or P"});
        }
        else if (err.constraint === "positive_balance"){
            response.status(400).json({error: "Account must be created with non-negative balance"});
        }
        else response.status(500).json(err);
    }
}

exports.deposit = async function (request, response){
    try{
        if (request.params.value < 0){
            response.status(400).json({error: "Tried to deposit negative quantity"});
        }
        else {
            const results = await db.updateAccountBalance(request.params.id, request.params.value, "add");
            if (results.rowCount !== 0){
                response.sendStatus(200);
            }
            else response.status(404).json({error: 'No user found with provided CPF'});
        }
    }
    catch (err){
        if (err.code === "22P02"){
            response.status(400).json({error: "Invalid parameter format"});
        }
        else response.status(500).json(err);
    }
}

exports.withdraw = async function (request, response){
    var currencyDistribution = currencyPicker(request.params.value);
    if (currencyDistribution.possible === "yes"){
        try{
            const results = await db.updateAccountBalance(request.params.id, request.params.value, "subtract");
            if (results.rowCount !== 0){
                response.status(200).json(currencyDistribution);
            }
            else response.status(404).json({error: 'No user found with provided CPF'});
        }
        catch (err){
            if (err.constraint === "positive_balance"){
                response.status(400).json({error: "Account does not have enough balance for requested amount"});
            }
            else response.status(500).json(err);
        }
    }
    else response.status(400).json(currencyDistribution);
}

// not really required per specs but may be nice to put this here
// for now deletes will be handled by psql with cascade
// exports.delete = async function (request, response){}