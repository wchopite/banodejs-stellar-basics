require("dotenv").config();
const { printAccountBalances } = require("./lib/utils");
const { Server } = require("stellar-sdk");

const server = new Server(process.env.HORIZON_INSTANCE_URL);

(async function main() {
  const publicKey = "GDSGT2OWYIYWCFR2DBF2Y7X7OSJPFWF5YAREJOZWWFNEMOZIZOH4JSLL";
  const account = await server.loadAccount(publicKey);

  printAccountBalances(account);
})();
