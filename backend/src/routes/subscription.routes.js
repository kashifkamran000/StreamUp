import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscriberedChannel, getSubscribers, toggleSubscribe } from "../controllers/subscription.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/sc').get(getSubscriberedChannel)

router.route("/t/:channelId").get(toggleSubscribe)

router.route('/us/:channelId').get(getSubscribers)

export default router