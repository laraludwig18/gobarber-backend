import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import CreateUserService from '../CreateUserService';

describe('CreateUser', () => {
  const newUser = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  };

  it('should be able to create a new user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUser.execute(newUser);

    expect(user).toHaveProperty('id');
    expect(user.name).toStrictEqual(newUser.name);
    expect(user.email).toStrictEqual(newUser.email);
    expect(user.password).toStrictEqual(newUser.password);
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    await createUser.execute(newUser);

    await expect(createUser.execute(newUser)).rejects.toEqual(
      new AppError('Email address already exists.'),
    );
  });
});
