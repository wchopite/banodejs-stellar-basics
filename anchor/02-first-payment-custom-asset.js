// https://stellar.github.io/js-stellar-sdk/Operation.html#.payment
require("dotenv").config({ path: `${__dirname}/../.env` });
const {
  Asset,
  BASE_FEE,
  Keypair,
  Memo,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} = require("stellar-sdk");

const server = new Server(process.env.HORIZON_INSTANCE_URL);
const STELLAR_NETWORK =
  process.env.NODE_ENV === "production" ? Networks.PUBLIC : Networks.TESTNET;

(async function main() {
  // Accounts
  const issuingKeyPair = Keypair.fromSecret(process.env.ISSUING_ACCOUNT_SECRET);
  const distributionKeyPair = Keypair.fromSecret(
    process.env.DISTRIBUTION_ACCOUNT_SECRET
  );

  const [issuingAccount, distributionAccount] = await Promise.all([
    server.loadAccount(issuingKeyPair.publicKey()),
    server.loadAccount(distributionKeyPair.publicKey()),
  ]);

  const amount = process.env.ASSET_INITIAL_SUPPLY_AMOUNT;
  const transaction = new TransactionBuilder(issuingAccount, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK,
  })
    .addOperation(
      Operation.payment({
        destination: distributionAccount.id,
        asset: new Asset(process.env.ASSET_CODE, issuingAccount.id),
        amount,
      })
    )
    .addMemo(Memo.text(`${process.env.ASSET_CODE} asset first payment`))
    .setTimeout(180)
    .build();

  transaction.sign(issuingKeyPair);
  const result = await server.submitTransaction(transaction);
  console.log("trx id:", result.id);
})();
