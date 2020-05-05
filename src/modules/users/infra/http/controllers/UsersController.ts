import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    // UsersRepository dependency injection
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute(req.body);

    delete user.password;

    return res.json(user);
  }
}
