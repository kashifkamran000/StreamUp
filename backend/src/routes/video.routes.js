import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'
import { deleteVideo, getAllVideo, getChannelVideos, getVideoById, publishAVideo, toggleVideoStatus, updateVideo } from "../controllers/video.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/").get(getAllVideo)

router.route('/upload-video').post(upload.fields([
    {
     name: "video", 
     maxCount: 1   
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishAVideo)

router.route("/:videoId").get(getVideoById)

router.route("/edit/:videoId").patch(updateVideo)

router.route('/delete/:videoId').delete(deleteVideo)

router.route('/toggleIsPublished/:videoId').patch(toggleVideoStatus)

router.route('/videos-channel/:username').get(getChannelVideos)


export default router
