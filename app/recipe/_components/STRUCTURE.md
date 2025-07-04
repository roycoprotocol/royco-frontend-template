```json
{
  "id": "string", // recipe id (uuid v4, will be passed by frontend)
  "name": "string", // recipe name

  "primaryType": "rawActions" | "encodedActions", // primary type of the recipe to save in the database

  "rawActions": {
    "id": "string",
    "chainId": "number", // chain id
    "address": "string", // contract address
    "name": "string", // function name
    "inputs": {
      "name": "string", // input name
      "type": "string", // input type (e.g. address, int, bool, string, bytes, etc.)
      "inputType": "fixed" | "dynamic", // valid values: fixed, dynamic
      "fixedValue": "string", // if inputType is fixed, this will be the value
      "dynamicValue": "number", // if not dynamic, value is -1, else it will be index of some action
      "status": "string", // this will store status codes like VALID, INVALID_INT, etc. -- tbd, on what all the status codes will be, so we can just use a string for now
    }[],
    "outputs": {
      "name": "string", // output name
      "type": "string", // output type (e.g. address, int, bool, string, bytes, etc.)
    }[],
    "stateMutability": "pure" | "view" | "nonpayable" | "payable", // function state mutability, valid values: pure, view, nonpayable, payable
    "type": "function" | "constructor" | "event" | "error", // function type, valid values: function, constructor, event, error
    "callType": 0 | 1 | 2, // call type, valid values: 0: call, 1: delegatecall, 2: staticcall
    "callValue": "string", // call value for payable function
  }[],

  "encodedActions": {
    "commands": "string[]", // array of commands
    "state": "string[]", // state of the state
  }
}
```

Inside db, add another field called `user_id` and store the id of the user who created the recipe -- you can get user's id from session.
