// https://stellar.github.io/js-stellar-sdk/Operation.html#.setOptions
require("dotenv").config({ path: `${__dirname}/../.env` });
const {
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} = require("stellar-sdk");

const server = new Server(process.env.HORIZON_INSTANCE_URL);
const STELLAR_NETWORK = Networks.TESTNET;

(async function main() {
  const issuingKeyPair = Keypair.fromSecret(process.env.ISSUING_ACCOUNT_SECRET);
  const issuingAccount = await server.loadAccount(issuingKeyPair.publicKey());

  const transaction = new TransactionBuilder(issuingAccount, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK,
  })
    .addOperation(
      Operation.setOptions({
        masterWeight: 0,
        lowThreshold: 1,
        medThreshold: 1,
        highThreshold: 1,
      })
    )
    .setTimeout(180)
    .build();

  transaction.sign(issuingKeyPair);
  const result = await server.submitTransaction(transaction);
  console.log("trx id:", result.id);
})();
