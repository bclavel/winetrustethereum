const assert = require('assert');
const ganache = require ('ganache-cli');
const Web3 = require ('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../build/ProductFactory.json');
const compiledProduct = require ('../build/Product.json');

let accounts;
let factory;
let productAddress;
let product;


beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
  .deploy({data : compiledFactory.evm.bytecode.object})
  .send({ from : accounts[0], gas : '1000000'});

  await factory.methods.createProduct('string hash test').send({
    from : accounts[0],
    gas : '1000000'
  });

  [productAddress] = await factory.methods.getDeployedProducts().call();

  product = await new web3.eth.Contract(compiledProduct.abi,productAddress);
});

describe('Products', () => {
  it('factory & produit déployés ?', () => {
    assert.ok(factory.options.address);
    assert.ok(product.options.address);
  })
});
