const { MongoClient } = require('mongodb');
const readline = require("readline");
const crypto = require('crypto');
const fs = require('fs');
const passgen = require('generate-password');
const url = 'mongodb://localhost:27017/iasystem';
let client,  db, customers, homes, reportArr = [], reportName;
let emailformat , timezone;

console.log('BKC Bulk started!');

async function init() {
    let config = require('./config.json');
    if(config.TestMode){
        console.log('Started in test mode ...');
        Object.assign(config, {
            "customerCollection": "iacustomers_test",
            "homeCollection": "iahomes_test"
        })
    } else {
        Object.assign(config, {
            "customerCollection": "iacustomers",
            "homeCollection": "iahomes"
        })
    }

    console.log('Connecting to db...');
    client = await MongoClient.connect(url, { useNewUrlParser: true })
    db = await client.db();
    customers =db.collection(config.customerCollection);
    homes =db.collection(config.homeCollection);
    timezone = config.TimeZone;
    emailformat = config.EmailTemplate;
    console.log('Connected to db successfully!');
    console.log('Timezone is ', timezone);
    console.log('Email template is ', emailformat);
    console.log('Please enter a command');
}

init();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", async function (line) {
    let words = line.split(' ');
    //console.log(words);

    if(words[0]==='close'){
        rl.close();
    }

    if(words[0]==='list'){
        if(words.length==1){
            return readall();
        }
        if(words[1]==='last'){
            readall(reportName);
        } else {
            readall(words[1]);
        }
    }

    if(words[0]==='print'){
        console.log(reportArr)
    }

    if(words[0]==='add'){
        let countofadd = parseInt(words[1]);
        if(countofadd <= 0){
            console.error('Get numbers of new customers');
            return;
        }
        if(countofadd > 100){
            console.error('You can not add more than 100 customers');
             return;
        }
        console.log('Adding '+countofadd+' new users with home');
        reportArr.length = 0;
        reportName = 'report-' + passgen.generate({
            length: 5,
            numbers: false,
            symbols: false,
            lowercase: true,
            uppercase: false,
            excludeSimilarCharacters: true,
            exclude: ''
        });
        for(let i=0; i<countofadd; i++){
            add(i);
        }
        console.log('The new report file is created in ./reports/'+ reportName+'.json');
    }

    if(words[0]==='p'){
        let p = passgen.generate({
            length: 10,
            numbers: true,
            symbols: false,
            lowercase: true,
            uppercase: true,
            excludeSimilarCharacters: true,
            exclude: '@!'
        });
        console.log(p, hashPassword(p))
    }
}).on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
}).on("error", function(e) {
    // something went wrong
});




async function readall(report){
    let results = await customers.find({bulkName: report}).toArray()
    console.log(results);
}

async function add(x){
    x = x+1;
    let _email = emailformat.replace('X', x);
    let _password =  passgen.generate({
        length: 10,
        numbers: true,
        symbols: false,
        lowercase: true,
        uppercase: true,
        excludeSimilarCharacters: true,
        exclude: '@!'
    });
    let _passhash = hashPassword(_password);
    let _attime = new Date();
    let addedCustomer = await customers.insertOne({
        "IsActive" : true,
        "Email" : _email,
        "Username" : _email,
        "Password" : _passhash,
        "FirstName" : "Firstname_"+x,
        "LastName" : "Lastname_"+x,
        "Mobile" : "",
        "createdAt" : _attime,
        "updatedAt" : _attime,
        "__v" : 0,
        "bulkName": reportName
    })

    let addedHome = await homes.insertOne({
        "CustomerId" : addedCustomer.insertedId,
        "Name" : "Home Name "+x,
        "IsActive" : true,
        "Type" : "HOME",
        "Timezone": timezone,
        "Guard" : false,
        "createdAt" : _attime,
        "updatedAt" : _attime,
        "__v" : 0,
        "bulkName": reportName
    })

    reportArr.push({
        "Email" : _email,
        "Password" : _password,
        "FirstName" : "Firstname_"+x,
        "LastName" : "Lastname_"+x,
        "CustomerId" : addedCustomer.insertedId,
        "HomeId" : addedHome.insertedId,
        "createdAt" : _attime,
    })

    const jsonContent = JSON.stringify(reportArr, null, 2);
    fs.writeFile("./reports/"+reportName+".json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    });
    console.log('... '+x+' customers added');
}

const hashPassword = function (password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    return [salt, hash].join('$');
};
