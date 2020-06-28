import { getRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const checkIdFormat = isUuid(id);

    if (!checkIdFormat) {
      throw new AppError('Invalid id');
    }

    const transactionsRepository = getRepository(Transaction);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction does not exists');
    }
    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
