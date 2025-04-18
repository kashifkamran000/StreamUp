import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/:videoId').get(getVideoComment)

router.route('/:videoId').post(addComment)

router.route('/del/:commentId').delete(deleteComment)

router.route('/update/:commentId').patch(updateComment)

export default router