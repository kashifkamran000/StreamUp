import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getLikedVideo, toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/toggle/v/:videoId').get(toggleVideoLike)

router.route('/toggle/c/:commentId').get(toggleCommentLike)

router.route('/videos').get(getLikedVideo)

export default router