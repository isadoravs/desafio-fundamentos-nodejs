import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  type: 'income' | 'outcome';
  title: string;
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    balance = this.transactions.reduce((accumulated, transaction) => {
      switch (transaction.type) {
        case 'income':
          return {
            ...accumulated,
            income: transaction.value + accumulated.income,
            total: accumulated.income - accumulated.outcome + transaction.value,
          };
        case 'outcome':
          return {
            ...accumulated,
            outcome: transaction.value + accumulated.outcome,
            total: accumulated.income - accumulated.outcome - transaction.value,
          };
        default:
          return accumulated;
      }
    }, balance);

    return balance;
  }

  public create({ type, title, value }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ type, title, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
