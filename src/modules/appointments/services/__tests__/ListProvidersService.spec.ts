import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from '../ListProvidersService';

const newUser = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
};

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
  });

  it('should be able to list the providers', async () => {
    const firstUser = await fakeUsersRepository.create({
      ...newUser,
      email: 'johntre@example.com',
    });
    const secondUser = await fakeUsersRepository.create({
      ...newUser,
      email: 'johnqua@example.com',
    });
    const loggedUser = await fakeUsersRepository.create(newUser);

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toStrictEqual([firstUser, secondUser]);
  });
});
