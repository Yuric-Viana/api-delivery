import { Router } from "express";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { DeliveriesController } from "@/controllers/DeliveriesController";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { DeliveriesStatusController } from "@/controllers/DeliveriesStatusController";

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()
const deliveriesStatusController = new DeliveriesStatusController()

deliveriesRoutes.use(ensureAuthenticated, verifyUserAuthorization(["sale"]))
deliveriesRoutes.post('/', deliveriesController.create)
deliveriesRoutes.get('/', deliveriesController.index)

deliveriesRoutes.patch('/:id/status', deliveriesStatusController.update)

export { deliveriesRoutes }