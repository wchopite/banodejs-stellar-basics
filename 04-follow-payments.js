// https://stellar.github.io/js-stellar-sdk/TransactionCallBuilder.html#cursor
require("dotenv").config();
const { Keypair, Server } = require("stellar-sdk");

const server = new Server(process.env.HORIZON_INSTANCE_URL);

(async function main() {
  const accountKeys = Keypair.fromSecret(process.env.ACCOUNT_TWO_SECRET);
  const onmessage = async (message) => {
    const trx = await message.transaction();
    console.log("New payment:");
    console.log(trx);
    console.log("trx id", trx.id);
    console.log("trx paging_token", trx.paging_token);
  };

  const onerror = (error) => {
    console.log("An error occurred!");
    console.error(error);
  };

  server.payments().cursor("now").forAccount(accountKeys.publicKey()).stream({
    onmessage,
    onerror,
  });
})();
