import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { year, month, day } = req.query;

    const listProviderAppointments = container.resolve(ListProviderAppointmentsService);

    const appointments = await listProviderAppointments.execute({
      provider_id: req.user.id,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });

    return res.json(appointments);
  }
}
