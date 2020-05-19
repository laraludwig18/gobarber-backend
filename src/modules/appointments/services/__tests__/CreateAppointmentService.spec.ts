import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '../CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

const newAppointment = {
  date: new Date(2020, 5, 14, 13),
  provider_id: '121212',
  user_id: '131313',
};

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 5, 14, 12).getTime());

    const appointment = await createAppointment.execute(newAppointment);

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toStrictEqual('121212');
  });

  it('should not be able to create two appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 5, 14, 12).getTime());

    await createAppointment.execute(newAppointment);

    await expect(createAppointment.execute(newAppointment)).rejects.toEqual(
      new AppError('This appointment is already booked.'),
    );
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 1, 10, 12).getTime());

    await expect(
      createAppointment.execute({ ...newAppointment, date: new Date(2020, 1, 10, 11) }),
    ).rejects.toEqual(new AppError("You can't create an appointment on a past date."));
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 1, 10, 12).getTime());

    await expect(
      createAppointment.execute({ ...newAppointment, user_id: '121212' }),
    ).rejects.toEqual(new AppError("You can't create an appointment with yourself."));
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 1, 10, 12).getTime());

    await expect(
      createAppointment.execute({ ...newAppointment, date: new Date(2020, 5, 14, 7) }),
    ).rejects.toEqual(new AppError('You can only create appointments between 8am and 5pm.'));

    await expect(
      createAppointment.execute({ ...newAppointment, date: new Date(2020, 5, 14, 18) }),
    ).rejects.toEqual(new AppError('You can only create appointments between 8am and 5pm.'));
  });
});
