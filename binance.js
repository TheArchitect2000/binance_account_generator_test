const Web3 = require('web3');
const Binance = require('binance-api-node').default;

console.log('Binance account creator started!');

async function getAccount() {
  console.log('We are in getAccount function!');

  const web3 = new Web3(
    new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org:443'),
  );
  // const nodeInfo = web3.eth.getNodeInfo().then(console.log);
  console.log('\nNode Info: ', await web3.eth.getNodeInfo());

  const account1 = web3.eth.accounts.privateKeyToAccount(
    '3d0f0ef79b049f564c4cd983c5c307c537b0d120ebf07aa04617d7a7288471aa',
  );
  const account2 = web3.eth.accounts.privateKeyToAccount(
    '36456232a2ecf8eabc6e4762cb4be349cdc1ffa8b08ea339c4cb4b7826b87792',
  );

  console.log('\n--------------------------------------');
  console.log('Account1 information is: ', account1);
  console.log('\n--------------------------------------');
  console.log('Account2 information is: ', account2);

  var account = await web3.eth.accounts.create();
  console.log('\n--------------------------------------');
  console.log('Created account information is: ', account);
  console.log('\n--------------------------------------');

  
}

getAccount();