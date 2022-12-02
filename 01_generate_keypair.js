// https://stellar.github.io/js-stellar-sdk/Keypair.html
const StellarSdk = require("stellar-sdk");

const pair = StellarSdk.Keypair.random();

console.log("PUBLIC:", pair.publicKey());
console.log("SECRET:", pair.secret());
