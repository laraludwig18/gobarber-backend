import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute(req.body);

    return res.status(204).json();
  }
}
