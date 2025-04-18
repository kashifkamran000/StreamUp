import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addVideoToPlaylist, 
    createPlaylist, 
    deletePlaylist, 
    getPlaylistById, 
    getUserPlaylist, 
    removeVideoFromPlaylist, 
    updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/').post(createPlaylist)

router.route('/user/:userId').get(getUserPlaylist)

router.route('/:playlistId').get(getPlaylistById)

router.route('/add/:playlistId/:videoId').patch(addVideoToPlaylist)

router.route('/remove/:playlistId/:videoId').patch(removeVideoFromPlaylist)

router.route('/delete/:playlistId').delete(deletePlaylist)

router.route('/:playlistId').patch(updatePlaylist)


export default router