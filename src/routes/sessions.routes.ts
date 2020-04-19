import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute(req.body);

  delete user.password;

  return res.json({ user, token });
});

export default sessionsRouter;
