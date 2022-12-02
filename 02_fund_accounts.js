require("dotenv").config();
const { Keypair } = require("stellar-sdk");
const axios = require("axios");

async function fundAccount(publicKey) {
  const response = await axios.get(
    `${process.env.FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`
  );

  return response.data;
}

(async function main() {
  const firstAccountKeys = Keypair.fromSecret(process.env.ACCOUNT_0NE_SECRET);
  const secondAccountKeys = Keypair.fromSecret(process.env.ACCOUNT_TWO_SECRET);

  const firstAccountPublicKey = firstAccountKeys.publicKey();
  const secondAccountPublicKey = secondAccountKeys.publicKey();

  console.log("first public key", firstAccountPublicKey);
  console.log("second public key", secondAccountPublicKey);

  Promise.all([
    fundAccount(firstAccountPublicKey),
    fundAccount(secondAccountPublicKey),
  ]).then((res) => console.log(res));
})();
