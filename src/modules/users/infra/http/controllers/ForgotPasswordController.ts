import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const sendForgotPasswordEmail = container.resolve(SendForgotPasswordEmailService);

    await sendForgotPasswordEmail.execute(req.body);

    return res.status(204).json();
  }
}
