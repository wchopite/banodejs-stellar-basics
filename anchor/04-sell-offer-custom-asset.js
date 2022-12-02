//  https://stellar.github.io/js-stellar-sdk/Operation.html#.manageSellOffer
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
const STELLAR_NETWORK = Networks.TESTNET;

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

  const transaction = new TransactionBuilder(distributionAccount, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK,
  })
    .addOperation(
      Operation.manageSellOffer({
        selling: new Asset(process.env.ASSET_CODE, issuingAccount.id),
        buying: Asset.native(),
        amount: process.env.ASSET_SELL_OFFER,
        price: process.env.ASSET_PRICE_TO_XLM,
        offerId: 0,
      })
    )
    .setTimeout(180)
    .build();

  transaction.sign(distributionKeyPair);
  const result = await server.submitTransaction(transaction);
  console.log("trx id:", result.id);
})();
