import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '../ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointments = new ListProviderAppointmentsService(fakeAppointmentsRepository);
  });

  it('should be able to list the appointments on a specific day', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 5, 20, 11, 0, 0).getTime());

    const firstAppointment = await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 21, 12, 0, 0),
      provider_id: 'user1',
      user_id: 'user2',
    });

    const secondAppointment = await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 21, 17, 0, 0),
      provider_id: 'user1',
      user_id: 'user2',
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'user1',
      day: 21,
      month: 6,
      year: 2020,
    });

    expect(appointments).toStrictEqual([firstAppointment, secondAppointment]);
  });
});
