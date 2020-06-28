import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  private category_id: string;

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const catergoryRepository = getRepository(Category);

    const checkCategoryExists = await catergoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (checkCategoryExists) {
      this.category_id = checkCategoryExists.id;
    } else {
      const newCategory = catergoryRepository.create({
        title: category,
      });

      await catergoryRepository.save(newCategory);

      this.category_id = newCategory.id;
    }

    const totalBalance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > totalBalance.total) {
      throw new AppError('Saldo insuficiente', 400);
    }

    const transaction = transactionsRepository.create({
      category_id: this.category_id,
      title,
      value,
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
