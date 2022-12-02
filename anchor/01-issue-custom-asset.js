// https://stellar.github.io/js-stellar-sdk/Operation.html#.changeTrust
require("dotenv").config({ path: `${__dirname}/../.env` });
const {
  Asset,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} = require("stellar-sdk");

const server = new Server(process.env.HORIZON_INSTANCE_URL);

(async function main() {
  const issuingKeyPair = Keypair.fromSecret(process.env.ISSUING_ACCOUNT_SECRET);
  const distributionKeyPair = Keypair.fromSecret(
    process.env.DISTRIBUTION_ACCOUNT_SECRET
  );

  const [issuingAccount, distributionAccount] = await Promise.all([
    server.loadAccount(issuingKeyPair.publicKey()),
    server.loadAccount(distributionKeyPair.publicKey()),
  ]);

  const transaction = new TransactionBuilder(distributionAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.changeTrust({
        asset: new Asset(process.env.ASSET_CODE, issuingAccount.id),
      })
    )
    .setTimeout(180)
    .build();

  transaction.sign(distributionKeyPair);
  const result = await server.submitTransaction(transaction);
  console.log(result.id);
})();
