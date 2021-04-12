# proto-atm endpoints

The API provides endpoints for manipulating the stored users and associated accounts.

## User-associated endpoints

### `/users`
- `GET`: return all the stored users.
  
  Each user in the returned JSON has three fields: `name`, `cpf` and `b_date` (birthday date).

  Example:

  `GET /users`

  Response:
  ```
  [
    {
      "name": "Kevin Flynn",
      "cpf": "00011122233",
      "b_date": "1984-02-28T04:00:00.000Z"
    },
    {
      "name": "Sam Flynn",
      "cpf": "12345678900",
      "b_date": "1961-02-28T04:00:00.000Z"
    }
  ]
  ```

  The return is HTTP 200 on success with a JSON array with the users. Please check the docs for `POST` (just below) for a description of each response field.

  Note: with the current implementation, the client is expected to strip the time stamp from date object.

- `POST`: add a new user. The body content of request must carry the data for the new user
  in JSON format.

  Example:

  `POST /users`

  Request body:
  ```
    {
      "name": "Kevin Flynn",
      "cpf": "00011122233",
      "b_date": "1984-02-28"
    }
  ```
  All the three fields are expected on each request. The field contents must be as follows:
  - `name`: Complete name, up to 50 characters, enclosed in quotation marks
  - `cpf`: CPF number without any separators and enclosed in quotation marks, exactly 11 digits.
  - `b_date`: Birthday date in format `YYYY-MM-DD` and enclosed in quotation marks.

  The return is HTTP 201 on success, or HTTP 400 and an error JSON if the request could not be fulfilled. The error JSON is in format `{"error": "msg"}`. The possible error messages are:
  - `Provided CPF already in use`
  - `Name must not be an empty string`
  - `CPF must be informed with exactly 11 digits`
  - `One or more parameters are bigger than maximum size allowed`
  - `Failed to parse date. Please use date format YYYY-MM-DD`

### `/users/:cpf`
- `GET`: return the user associated with provided CPF.

  Example:

  `GET /users/00011122233`

  Response:
  ```
    {
      "name": "Kevin Flynn",
      "cpf": "00011122233",
      "b_date": "1984-02-28T04:00:00.000Z"
    }
  ```

  The return is HTTP 200 on success, or HTTP 404 and an error JSON if the CPF does not exist in user list.

  ```
  { "error": "No user found with provided CPF" }
  ```

- `PUT`: updates the user associated with provided CPF.
  The body of `PUT` request must carry a JSON in the same format as returned by `GET /users/:cpf`, however `b_date` must be in the format `YYYY-MM-DD`.

  Example:

  `PUT /users/00011122233`
  
  Request body:
  ```
    {
      "name": "Kevin Flynn",
      "cpf": "00011122233",
      "b_date": "1984-02-28"
    }
  ```

  All the three fields are expected on each request. The field contents must be as follows:
  - `name`: Complete name, up to 50 characters, enclosed in quotation marks
  - `cpf`: CPF number without any separators and enclosed in quotation marks, exactly 11 digits.
  - `b_date`: Birthday date in format `YYYY-MM-DD` and enclosed in quotation marks.

  The client is expected to repeat the fields whose change is not required (e.g. if `b_date` is not to be changed, send it with the same value as before).

  The return is HTTP 200 on success, or HTTP 400 and an error JSON if the request could not be fulfilled. The error JSON is in format `{"error": "msg"}`. The possible error messages are:
  - `Provided CPF already in use`
  - `Name must not be an empty string`
  - `CPF must be informed with exactly 11 digits`
  - `One or more parameters are bigger than maximum size allowed`
  - `Failed to parse date. Please use date format YYYY-MM-DD`

- `DELETE`: removes the user associated with the provided CPF. If there are associated bank accounts, they will be removed as well.

  Example:

  `DELETE /users/00011122233`

  The return is HTTP 200 on success, or HTTP 404 and an error JSON if the CPF does not exist in user list.
  ```
  { "error": "No user found with provided CPF" }
  ```

## Account-associated endpoints

### `/accounts`
- `POST`: add a new account. The body content of request must carry the data for the new user
  in JSON format.

  Example:
  `POST /accounts`
  
  Request body:
  ```
    {
      "cpf": "00011122233",
      "type": "C",
      "balance": 0"
    }
  ```
  All the three fields are expected on each request. The field contents must be as follows:
  - `cpf`: CPF number without any separators and enclosed in quotation marks, exactly 11 digits. The CPF must already exist in the users database.
  - `type`: Exactly 1 letter, which must be `C` or `P` (Portuguese for "corrente" and "poupança", respectively)
  - `balance`: An integer, non-negative. It will accept any positive values within the range of an `int`.

  The return is HTTP 201 on success, or HTTP 400 and an error JSON if the request could not be fulfilled. The error JSON is in format `{"error": "msg"}`. The possible error messages are:
  - `User must be created before creating account`
  - `Account type must be C or P`
  - `Account must be created with non-negative balance`


### `/accounts/cpf/:cpf`
- `GET`: return the accounts associated with the provided CPF.

  Example:

  `GET /accounts/cpf/00011122233`

  Response:
  ```
    [
      {
          "cpf": "00011122233",
          "id_account": 2,
          "type": "P",
          "balance": 250
      },
      {
          "cpf": "00011122233",
          "id_account": 4,
          "type": "C",
          "balance": 18867
      }
    ]
  ```

  The return is HTTP 200 on success and a JSON array with the accounts, or HTTP 404 and an error JSON if the CPF does not exist in user list. The error JSON is in format `{"error": "msg"}`.

  A CPF may have more than one bank account associated. Thus, it is suggested to use the endpoint `accounts/:id` for when the account number (`id_account`) is known and use `/accounts/cpf/:cpf` when account number is not known yet.

  Possible error:
  ```
  { "error": "No user found with provided CPF" }
  ```

### `/accounts/:id`
- `GET`: get the account associated with the provided account ID.

  Example:

  `GET /accounts/4`

  Response:
  ```
  {
      "cpf": "00011122233",
      "id_account": 4,
      "type": "C",
      "balance": 18867
  }
  ```

  The return is HTTP 200 on success and a JSON with the account info, or HTTP 404 and an error JSON if the account id does not exist in account list. The error JSON is in format `{"error": "msg"}`.
  ```
  { "error": "No user found with provided id" }
  ```

### `/accounts/:id/deposit/:value`
- `PUT`: deposit the indicated value on the account associated with the provided ID.

  Example:

  `PUT /accounts/4/deposit/77`

  This will add 77 currency to the balance of account with id = 4.

  The return is HTTP 200 on success, HTTP 404 if the referenced account does not exist or HTTP 400 for other errors. In both error cases an error JSON in format `{"error": "msg"}` will be returned. The possible error messages are:

  - `No user found with provided id` (HTTP 404)
  - `Tried to deposit negative quantity`
  - `Invalid parameter format`

### `/accounts/:id/withdraw/:value`
- `PUT`: withdraws the indicated value from the account associated with the provided ID.

  Example:

  `PUT /accounts/4/withdraw/80`

  Response:
  ```
  {
    "possible": "yes",
    "qty_100": 0,
    "qty_50": 0,
    "qty_20": 4
  }
  ```
  This will withdraw 80 currency from the balance of account with id = 4. The returned JSON tells us 4 bank bills of value 20 must be used.

  The return on success is HTTP 200 and a JSON with the allocation of bank notes, HTTP 404 if the referenced account does not exist or HTTP 400 for other errors. In both error cases an error JSON in format `{"error": "msg"}` will be returned.
  
  For a successful request, the requested currency amount needs to be correctly distributed in terms of bank notes of value 100, 50 and 20. Also, the referenced account must have enough balance for completing the withdrawal. The fields `qty_100`, `qty_50` and `qty_20` will inform the distribution of bank notes, and the field `possible` will inform if the distribution is possible.

  The possible error messages are:
  - `No user found with provided id`
  - `Account does not have enough balance for requested amount`
  - `Not possible to allocate bank notes for requested amount`
