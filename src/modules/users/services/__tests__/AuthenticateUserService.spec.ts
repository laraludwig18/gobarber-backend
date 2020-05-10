import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from '../AuthenticateUserService';
import CreateUserService from '../CreateUserService';

const authenticatedUser = {
  email: 'johndoe@example.com',
  password: '123456',
};

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      ...authenticatedUser,
    });

    const response = await authenticateUser.execute(authenticatedUser);

    expect(response).toHaveProperty('token');
    expect(response.user).toStrictEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(authenticateUser.execute(authenticatedUser)).rejects.toEqual(
      new AppError('Incorrect email/password combination.', 401),
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567',
    });

    await expect(authenticateUser.execute(authenticatedUser)).rejects.toEqual(
      new AppError('Incorrect email/password combination.', 401),
    );
  });
});
