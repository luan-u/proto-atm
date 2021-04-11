const db = require("./db-controller");

exports.get = async function (request, response) {
    try {
        //TODO: try to get rid of timezone
        const results = await db.selectAllUsers();
        response.status(200).json(results);
    }
    catch (err){
            response.status(500).json(err);
        }
    }

exports.getByCpf = async function(request, response){
    try {
        const results = await db.selectUserByCpf(request.params.cpf);
        if (results.rowCount === 1){
            response.status(200).json(results.rows[0]);
        } else response.status(404).send({error: 'No user found with provided CPF'});
    }
    catch (err){
        response.status(500).json(err);
    }
  };

exports.post = async function (request, response){
    try {
        const results = await db.insertUser(request.body);
        if (results.rowCount === 1){
            response.sendStatus(201);
        }
    }
    catch(err){
        if (err.constraint === "atm_users_pkey"){
            response.status(400).json({error: 'Provided CPF already in use'});
        }
        else if (err.constraint === "non_empty_name"){
            response.status(400).json({error: 'Name must not be an empty string'});
        }
        else if (err.constraint === "cpf_exact_length" || err.code === "22001"){
            response.status(400).json({error: 'CPF must be informed with exactly 11 digits'});
        }
        else if (err.code === "22007" || err.code === "22008"){
            response.status(400).json({error: 'Failed to parse date. Please use date format YYYY-MM-DD'});
        }
        else response.status(400).json(err);
    }
  };

exports.put = async function(request, response){
    // current implementation allows to update CPF after insertion
    try{
        const results = await db.updateUser(request.params.cpf, request.body);
        if (results.rowCount === 1){
            response.sendStatus(200);
        }
        else response.status(404).json({error: 'No user found with provided CPF'});
    }
    catch(err){
        if (err.constraint === "non_empty_name"){
            response.status(400).json({error: 'Name must not be an empty string'});
        }
        else if (err.constraint === "cpf_exact_length" || err.code === "22001"){
            response.status(400).json({error: 'CPF must be informed with exactly 11 digits'});
        }
        else if (err.code === "22007" || err.code === "22008"){
            response.status(400).json({error: 'Failed to parse date. Please use date format YYYY-MM-DD'});
        }
        else response.status(500).json(err);
    }
  };

exports.delete = async function (request, response){
    try{
        const results = await db.deleteUser(request.params.cpf);
        if (results.rowCount === 1){
            response.sendStatus(200);
        }
        else response.status(404).json({error: 'No user found with provided CPF'});
    }
    catch(err){
        response.status(500).json(err);
    }
  };
