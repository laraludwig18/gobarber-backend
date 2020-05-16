import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '../ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 5, 20, 11, 0, 0).getTime());

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 20, 12, 0, 0),
      provider_id: 'user1',
      user_id: 'user2',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 20, 17, 0, 0),
      provider_id: 'user1',
      user_id: 'user2',
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user1',
      day: 20,
      month: 6,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 16, available: true },
        { hour: 17, available: false },
      ]),
    );
  });
});
