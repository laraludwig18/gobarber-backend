import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from '../ResetPasswordService';

const user = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
};

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const generateHashSpy = jest
      .spyOn(fakeHashProvider, 'generateHash')
      .mockResolvedValueOnce('ukYn7xxkzx9h9K64a4uf');

    const createdUser = await fakeUsersRepository.create(user);
    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    await resetPassword.execute({ token, password: '212121' });

    const updatedUser = await fakeUsersRepository.findById(createdUser.id);

    expect(generateHashSpy).toHaveBeenCalledWith('212121');
    expect(updatedUser?.password).toStrictEqual('ukYn7xxkzx9h9K64a4uf');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({ token: 'non-existing-token', password: '212121' }),
    ).rejects.toEqual(new AppError('User token does not exists.'));
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('non-existing-user');

    await expect(resetPassword.execute({ token, password: '212121' })).rejects.toEqual(
      new AppError('User does not exists.'),
    );
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const createdUser = await fakeUsersRepository.create(user);
    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPassword.execute({ token, password: '212121' })).rejects.toEqual(
      new AppError('Token expired.'),
    );
  });
});
