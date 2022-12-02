const printAccountBalances = (account, type = "source") => {
  console.log(`${type} account balances`, account.balances);
};

module.exports = {
  printAccountBalances,
};
