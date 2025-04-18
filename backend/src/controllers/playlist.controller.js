import mongoose from 'mongoose'
import {asyncHandler} from '../utils/asyncHandler.js'
import{ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {Playlist} from '../models/playlist.model.js'


const createPlaylist = asyncHandler(async(req, res)=>{
     const {name, description} = req.body;

     if([name, description].some((field)=>field?.trim() === "")){
        throw new ApiError(400, "Please fill all fields")
     }

    await Playlist.create({
        name: name, 
        description: description,
        owner: req.user._id,
     })

     const playlisti = await Playlist.find({owner: req.user._id}).populate("owner", 'username _id')

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlisti, "Playlist Created!")
    )

})

const getUserPlaylist = asyncHandler(async(req, res)=>{
    const {userId} = req.params

    if(!userId){
        throw new ApiError(404, "Please provide user!!")
    }

    const playlist_list = await Playlist.find({owner: new mongoose.Types.ObjectId(userId)});

    if(!playlist_list){
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "User does not have any playlist")
        )
    }else{
        return res
        .status(200)
        .json(
            new ApiResponse(200, playlist_list, "Playlists found")
        )
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    const playlist = await Playlist.findById(playlistId).populate({
        path: 'video', 
        select: 'title thumbnail description owner duration', 
        populate: {
            path: 'owner', 
            select: 'username avatar' 
        }
    });

    if (!playlist) {
        throw new ApiError(404, "No such playlist found");
    }

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist found successfully"));
});



const addVideoToPlaylist = asyncHandler(async(req, res)=>{
    const {playlistId, videoId} = req.params

    if([playlistId, videoId].some((field)=>field?.trim()==="")){
        throw new ApiError(404, "Plaese provide all fields")
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId)

    const playlist  = await Playlist.findOne({
        _id: playlistId, 
        owner: req.user._id
    })

    if(!playlist){
        throw new ApiError(404, "Playlist not found, or you are not the owner of the provided playlist..")
    }

    if(playlist.video.includes(videoObjectId)){
        return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video is already in playlist")
        )
    }

    playlist.video.push(videoObjectId)
    await playlist.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Video added to playlist")
    )
})

const removeVideoFromPlaylist = asyncHandler(async(req, res)=>{
    const {playlistId, videoId} = req.params

    if([playlistId, videoId].some((field)=>field?.trim()==="")){
        throw new ApiError(404, "Plaese provide all fields")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "No such playlist found")
    }

    if(playlist.owner.toString() != req.user._id.toString()){
        throw new ApiError(404, "Your are not autherized to edit this video")
    }

    playlist.video = playlist.video.filter(v=>v.toString()!==videoId)

    await playlist.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Vodeo removed successfully")
    )
})

const deletePlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(404, "Please provide playlist")
    }
    
    const playlistToBeDeleted = await Playlist.findByIdAndDelete(playlistId)

    if(!playlistToBeDeleted){
        throw new ApiError(404, "Playlist not found, please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Playlist deleted successfully")
    )

})

const updatePlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!playlistId){
        throw new ApiError(404, "please provide playlist to update")
    }

    if(!name && !description){
        throw new ApiError(404, "Please provide name or decsription to update")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this playlist.");
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, { $set: updateFields }, { new: true });

    if(!updatedPlaylist){
        throw new ApiError(500, "Unable to update playlist, please try agina.")
    } 

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedPlaylist, "Successfully updated playlist..")
    )
})

export {
    createPlaylist,
    getUserPlaylist, 
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}