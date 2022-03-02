//IndexedDB = lets you create web applications with rich query abilities regardless 
//of network availability. Allows for offline use!
// connection variable
let db;
//now we must establish the connection "budget" as seen in the server.js file. set as version 1
const request = indexedDB.open('budget', 1);

request.unupgradedneeded = function (event) {
    //must save some type of refrence to the db
    const db = event.target.result;
    //cretaing an object store which is a table (pending) which is set to auto increment
    db.createObjectStore('pending', {
        autoIncrement: true
    });
};

