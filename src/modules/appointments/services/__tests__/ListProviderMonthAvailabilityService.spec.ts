import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '../ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const availableHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    Promise.all(
      availableHours.map(hour =>
        fakeAppointmentsRepository.create({
          date: new Date(2020, 5, 20, hour, 0, 0),
          provider_id: 'user1',
          user_id: 'user2',
        }),
      ),
    );

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user1',
      month: 6,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
