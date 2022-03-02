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

request.onsuccess = function (event) {
    db = event.target.result;
    //checking database status
    if (navigator.online) {
        //if navigator online we tell the db to check it
        checkDatabase();
    }
};

//error code
request.onerror = function (event) {
    console.log(event.target.errorCode);
};

// function will still work if a transaction submission is attempted w/ no connection
function saveRecord(record) {
    //transaction will first be pending then write to the db to then store it(or record the info)
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.createObjectStore('pending');
    store.add(record);
}

//when the db is online this function will work
function checkDatabase() {
    //this starts a transaction to the db
    const transaction = db.transaction(['pending'], 'readwrite');
    //access your object-store
    const store = transaction.createObjectStore('pending');
    const getALL = store.getALL();
//getall function for our api route Post so that we can get all if the length is greater than 0
    getALL.onsuccess = function () {
        if (getALL.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'Post',
                body: JSON.stringify(getALL.result),
                headers: {
                    //*/* = http accept header json
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(() => {
                //opening another transaction
                const transaction = db.transaction(['pending'], 'readwrite');
                //before we accessed the object store but now we access our pending store
                const store = transaction.objectStore('pending');
                //at some point we need to clear the store
                store.clear();
            })
            //catching errors and if we do console log "err"
            .catch(err => {
                console.log(err);
            });
        }
    };
}

//make sure to listen when the app comes backs online
window.addEventListener('online', checkDatabase);