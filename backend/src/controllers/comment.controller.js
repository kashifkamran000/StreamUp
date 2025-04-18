import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js'
import { Comment} from '../models/comment.model.js'
import { Like } from "../models/like.model.js";

const getVideoComment = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Please provide a valid video ID");
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const comments = await Comment.find({video: videoId})
    .populate('owner', 'username avatar')
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .sort({ createdAt: -1 })

    const totalComment = await Comment.countDocuments({video: videoId})

    if(!comments){
        throw new ApiError(500, "unable to fetch comments. please try again")
    }

    const commentsWithLikes = await Promise.all(
        comments.map(async (comment) => {
            const likeCount = await Like.countDocuments({ comment: comment._id });
            return { ...comment, likeCount }; // Append the likeCount to each comment
        })
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                comments: commentsWithLikes, 
                currentPage: pageNumber, 
                totalPages: Math.ceil(totalComment / limitNumber), 
                totalComment
            }, 
            "Comment fetched successfully")
    )

})

const addComment = asyncHandler(async(req, res)=>{

    const {videoId} = req.params

    const {content} = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Please write something");
    }

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Please provide a valid video ID");
    }

    const newComment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    })

    if(!newComment){
        throw new ApiError(500, "unable to add commnet please try again")
    }
    const addComment = await Comment.findOne(newComment._id).populate('owner', 'username avatar')

    return res
    .status(200)
    .json(
        new ApiResponse( 200, addComment, "New Comment Added!")
    )
})

const updateComment = asyncHandler(async(req, res)=>{
    const {commentId} = req.params

    const {content} = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Please write something");
    }

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Please provide a valid comment ID");
    }

    const commentToBeUpdated = await Comment.findById(commentId)

    if(!commentToBeUpdated){
        throw new ApiError(404, "No such comment in DB, or incorrect comment ID")
    }

    if(commentToBeUpdated.owner.toString() !== req.user._id.toString()){
        throw new ApiError(404, "YOu are not authorized to update this comment")
    }

    commentToBeUpdated.content = content.trim()

    const updatedComment = await commentToBeUpdated.save({validateBeforeSave : false})

    if(!updatedComment){
        throw new ApiError(500, "Unable to update comment, please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )
    

})

const deleteComment = asyncHandler(async(req, res)=>{
    const {commentId} = req.params

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Please provide a valid comment ID");
    }
    
    const commentToBeDeleted = await Comment.findByIdAndDelete(commentId)

    if(!commentToBeDeleted){
        throw new ApiError(500, "Unable to delete comment, please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse (200, null, "Comment deleted successfully")
    )

})


export {
    getVideoComment, 
    addComment,
    updateComment,
    deleteComment
}


