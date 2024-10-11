import { Router } from 'express';
import SubscriptionController from '../controller/subscription/SubscriptionController';
import passport from 'passport';

const router = Router();

router.post(
  '/subscribe',
  passport.authenticate('jwt', { session: false }),
  SubscriptionController.subscribe
);
// router.post('/push', SubscriptionController.pushNotification);

export default router;
