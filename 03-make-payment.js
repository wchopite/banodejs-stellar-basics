// https://stellar.github.io/js-stellar-sdk/Operation.html
// https://stellar.github.io/js-stellar-sdk/Operation.html#.payment
require("dotenv").config();
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

// Accounts
const sourceKeys = Keypair.fromSecret(process.env.ACCOUNT_0NE_SECRET);
const destPublicKey = process.env.ACCOUNT_TWO_PUBLIC;

(async function main() {
  const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

  const amount = "100";
  const operation = Operation.payment({
    destination: destPublicKey,
    asset: Asset.native(), // XLM Lumens
    amount,
  });

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(operation)
    .addMemo(Memo.text("NodeJsBA Meetup Trx"))
    .setTimeout(180) // Wait a maximum of three minutes for the transaction
    .build();

  transaction.sign(sourceKeys);
  const result = await server.submitTransaction(transaction);

  console.log(
    `payment from ${sourceKeys.publicKey()} to ${destPublicKey} for ${amount} XLM`
  );
  console.log("trx id:", result.id);
})();
