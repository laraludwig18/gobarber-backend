import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import CreateUserService from '../CreateUserService';

const newUser = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
};

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute(newUser);

    expect(user).toHaveProperty('id');
    expect(user.name).toStrictEqual(newUser.name);
    expect(user.email).toStrictEqual(newUser.email);
    expect(user.password).toStrictEqual(newUser.password);
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute(newUser);

    await expect(createUser.execute(newUser)).rejects.toEqual(
      new AppError('Email address already exists.'),
    );
  });
});
