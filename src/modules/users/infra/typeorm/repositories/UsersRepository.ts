import { getRepository, Repository, Not } from 'typeorm';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAllProviders({ exceptUserId }: IFindAllProvidersDTO): Promise<User[]> {
    let providers: User[];

    if (exceptUserId) {
      providers = await this.ormRepository.find({
        where: {
          id: Not(exceptUserId),
        },
      });
    } else {
      providers = await this.ormRepository.find();
    }

    return providers.map(provider => classToClass(provider));
  }

  public findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  public findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  public save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);
    return user;
  }
}

export default UsersRepository;
