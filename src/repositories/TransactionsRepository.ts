import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTrasactions = await this.find({ type: 'income' });
    const income = incomeTrasactions.reduce((a, b) => a + b.value, 0);
    const outcomeTrasactions = await this.find({ type: 'outcome' });
    const outcome = outcomeTrasactions.reduce((a, b) => a + b.value, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
