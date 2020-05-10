import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from '../SendForgotPasswordEmailService';

const user = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
};

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover password using the email', async () => {
    const sendEmailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create(user);

    await sendForgotPasswordEmail.execute({ email: 'johndoe@example.com' });

    expect(sendEmailSpy).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(sendForgotPasswordEmail.execute({ email: 'johndoe@example.com' })).rejects.toEqual(
      new AppError('User does not exists.'),
    );
  });

  it('should generate a forgot password token', async () => {
    const generateTokenSpy = jest.spyOn(fakeUserTokensRepository, 'generate');

    const createdUser = await fakeUsersRepository.create(user);

    await sendForgotPasswordEmail.execute({ email: 'johndoe@example.com' });

    expect(generateTokenSpy).toHaveBeenCalledWith(createdUser.id);
  });
});
