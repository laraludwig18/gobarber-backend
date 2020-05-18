import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id: req.user.id });

    return res.json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, oldPassword, password } = req.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id: req.user.id,
      name,
      email,
      oldPassword,
      password,
    });

    return res.json(classToClass(user));
  }
}
