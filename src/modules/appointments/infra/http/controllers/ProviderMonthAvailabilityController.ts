import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { provider_id } = req.params;
    const { year, month } = req.query;

    const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService);

    const monthAvailability = await listProviderMonthAvailability.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
    });

    return res.json(monthAvailability);
  }
}
