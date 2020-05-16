import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '../UpdateProfileService';

const newUser = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
};

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create(newUser);

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
    });

    expect(updatedUser.name).toStrictEqual('John Trê');
    expect(updatedUser.email).toStrictEqual('johntre@example.com');
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'John Trê',
        email: 'johntre@example.com',
      }),
    ).rejects.toEqual(new AppError('User not found.'));
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({ ...newUser, email: 'johntre@example.com' });
    const user = await fakeUsersRepository.create(newUser);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
      }),
    ).rejects.toEqual(new AppError('Email already in use.'));
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create(newUser);

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      oldPassword: '123456',
      password: '1234567',
    });

    expect(updatedUser.password).toStrictEqual('1234567');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create(newUser);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        password: '1234567',
      }),
    ).rejects.toEqual(new AppError('You need to inform the old password to set a new password.'));
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create(newUser);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        oldPassword: '123456789',
        password: '1234567',
      }),
    ).rejects.toEqual(new AppError('Old password does not match.'));
  });
});
