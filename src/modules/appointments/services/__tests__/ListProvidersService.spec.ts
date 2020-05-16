import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '../ListProvidersService';

const newUser = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
};

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
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
