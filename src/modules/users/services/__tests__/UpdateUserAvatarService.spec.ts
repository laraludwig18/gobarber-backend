import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeDiskStorageProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '../UpdateUserAvatarService';

const newUser = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
};

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create(newUser);

    const updatedUser = await updateUserAvatar.execute({
      avatarFilename: 'avatar.jpeg',
      user_id: user.id,
    });

    expect(updatedUser.avatar).toStrictEqual('avatar.jpeg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        avatarFilename: 'avatar.jpeg',
        user_id: '1',
      }),
    ).rejects.toEqual(new AppError('Only authenticated users can change avatar.', 401));
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFileSpy = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create(newUser);

    await updateUserAvatar.execute({
      avatarFilename: 'avatar.jpeg',
      user_id: user.id,
    });

    const updatedUser = await updateUserAvatar.execute({
      avatarFilename: 'avatar2.jpeg',
      user_id: user.id,
    });

    expect(deleteFileSpy).toHaveBeenCalledWith('avatar.jpeg');
    expect(updatedUser.avatar).toStrictEqual('avatar2.jpeg');
  });
});
