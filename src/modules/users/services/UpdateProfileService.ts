import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, name, email, password, oldPassword }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Email already in use.');
    }

    if (user.name !== name || user.email !== email) {
      this.cacheProvider.invalidatePrefix('providers-list');
    }

    Object.assign(user, { name, email });

    if (password) {
      if (!oldPassword) {
        throw new AppError('You need to inform the old password to set a new password.');
      }

      const checkOldPassword = await this.hashProvider.compareHash(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      const passwordHashed = await this.hashProvider.generateHash(password);
      Object.assign(user, { password: passwordHashed });
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
