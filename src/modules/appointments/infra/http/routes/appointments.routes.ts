import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.create,
);
appointmentsRouter.get(
  '/me',
  celebrate({
    [Segments.QUERY]: {
      day: Joi.string().min(1).max(2).required(),
      month: Joi.string().min(1).max(2).required(),
      year: Joi.string().min(4).max(4).required(),
    },
  }),
  providerAppointmentsController.index,
);

export default appointmentsRouter;
