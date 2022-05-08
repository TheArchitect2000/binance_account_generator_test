# binance-account-generator
**BKC Account Bulk Creator**


### Installation
```shell
    #create a folder
    mkdir dirname
    cd dirname
    #clone project
    git clone https://github.com/gramezan/binance-account-generator.git
    #install dependencies 
    npm install
```

### How to use

 
After installation
```shell
    #open app
    $ cd dirname
    $ cd binance-account-generator
    
    ### To create account on BKC node and Binance network, use this command.
    $ node bulk-customer-and-account-creator.js
    
    OR
    
    ### To create account just on BKC node, use this command.
    $ node bkcbulk.js
    ```
    
    ```shell
        bkccustomergen started
        connecting to db...
        connected to db successfully
        timezone is  America/Vancouver
        email template is  testuserX@blocklychain.io
        Please enter a command
    
    #for adding new accounts use bellow command for adding 20 customers
    add 20
    
    #after this 20 customers plus homes this program creates a new file with random name in ./reports folder
    list last    
    
    #for closing program
    close
```

### sample of result is 
```json
    [
    {
        "Email": "testuser1@blocklychain.io",
        "Password": "wHCEFeHe6M",
        "FirstName": "Firstname_1",
        "LastName": "Lastname_1",
        "CustomerId": "621394e2498bfb469cb95a13",
        "HomeId": "621394e2498bfb469cb95a14",
        "createdAt": "2022-02-21T13:34:26.505Z"
    }
]
```

## Options of config.json
in config file there are some options
```json
{
    "EmailTemplate": "testuserX@blocklychain.io",
    "TimeZone": "America/Vancouver",
    "TestMode": false
}
```
**EmailTemplate** is the template of email addresses, the "X" will be replaced by a number.
<br>
**TestMode** if was true it creates new accounts in a test collection not main customers collection.
