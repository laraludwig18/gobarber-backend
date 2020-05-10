import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '../CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '121212',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toStrictEqual('121212');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const newAppointment = {
      date: new Date(),
      provider_id: '121212',
    };

    await createAppointment.execute(newAppointment);

    await expect(createAppointment.execute(newAppointment)).rejects.toEqual(
      new AppError('This appointment is already booked.'),
    );
  });
});
