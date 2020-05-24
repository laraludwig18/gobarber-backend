import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, year, month }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      year,
      month,
    });

    // JS starts month at 0
    const parsedMonth = month - 1;

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, parsedMonth));

    // Return an array containing all days of that month
    const eachDayArray = Array.from({ length: numberOfDaysInMonth }, (_, index) => index + 1);

    const currentDate = new Date(Date.now());
    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, parsedMonth, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: isAfter(compareDate, currentDate) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
