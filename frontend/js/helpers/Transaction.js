class Transaction {
  constructor(amount, account) {
    this.amount = amount;
    this.account = account;
  }
  commit() {
    if (this.value < 0 && this.amount > this.account.balance) return;
    this.account.transactions.push(this.value);
    // this.account.balance += this.value;
  }
}

class Withdrawal extends Transaction {
  get value() {
    return -this.amount;
  }
}

class Deposit extends Transaction {
  get value() {
    return this.amount;
  }
}

export const addLists = function (data) {
  const list = new Transaction(0, data);
  list.commit();
  function makeNewLists() {
    $("#account-summary").append(`
        <li>Name: ${list.account.username}</li>
        <li>Amount: ${list.amount}</li>
        `);
  }
  return makeNewLists();
};

export default { addLists };
