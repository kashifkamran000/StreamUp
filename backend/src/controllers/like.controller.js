import mongoose from "mongoose";
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { Like } from "../models/like.model.js";
import { Comment } from '../models/comment.model.js'
import { Video } from '../models/video.model.js'

const toggleCommentLike = asyncHandler(async(req, res)=>{
    const {commentId} = req.params

    if(!commentId || !mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError (404, "Please provide valid comment ID")
    }

    const findComment = await Comment.findById(commentId);

    if(!findComment){
        throw new ApiError(404, "No such commnet available")
    }

    const findCommentLike = await Like.findOne({
        comment: commentId, 
        likedBy: req.user._id
    })

    if(!findCommentLike){
        const newCommentLike = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        if(!newCommentLike){
            throw new ApiError(500, "Unable to like please try again")
        }
        
        const commentLikeCount = await Like.countDocuments({comment: commentId})

        return res
        .status(200)
        .json(
            new ApiResponse(200, commentLikeCount, "Comment liked successfully")
        )
    }else{
        await Like.deleteOne({ _id: findCommentLike._id });

        const commentLikeCount = await Like.countDocuments({comment: commentId})

        return res
        .status(200)
        .json(
            new ApiResponse(200, commentLikeCount, "Comment Unliked Successfully")
        )
    }

})


const toggleVideoLike = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError (404, "Please provide valid commnet ID")
    }

    const findVideo = await Video.findById(videoId)

    if(!findVideo){
        throw new ApiError(404, "No such video available")
    }

    const findVideoLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if(!findVideoLike){
        const newVideoLike = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        if(!newVideoLike){
            throw new ApiError(500, "Unable to like Video, please try again")
        }
        
        const VideoLikeCount = await Like.countDocuments({video: videoId})

        return res
        .status(200)
        .json(
            new ApiResponse(200, VideoLikeCount, "Video Liked Successfully")
        )
    }else{
        await Like.deleteOne({ _id: findVideoLike._id });

        const VideoLikeCount = await Like.countDocuments({video: videoId})

        return res
        .status(200)
        .json(
            new ApiResponse(200, VideoLikeCount, "Unliked video Successfully")
        )
    }



})

const getLikedVideo = asyncHandler(async(req, res)=>{
    const user = req.user._id

    const allLikedVideo = await Like.find({
        likedBy: user,
        video: {$exists: true}
    }).populate('video')

    if(allLikedVideo.length === 0){
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "No liked videos found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, allLikedVideo, "Liked video fetched successfully")
    )

})

export {
    toggleCommentLike,
    toggleVideoLike, 
    getLikedVideo
}