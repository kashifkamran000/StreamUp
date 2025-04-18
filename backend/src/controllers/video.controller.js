import mongoose from "mongoose";
import {Video} from '../models/video.model.js'
import {Like} from '../models/like.model.js'
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { addVideoToWatchHistory} from '../middlewares/addVideoToHistory.middleware.js'

const getAllVideo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 12, query = '', sortBy = "createdAt", sortType = 'desc', username } = req.query;
  
    const pipeline = [];
  
    try {
      // Step 1: Find the userId by username if the username is provided
      if (username) {
        const user = await User.findOne({ username }).select('_id');
        if (user) {
          pipeline.push({
            $match: {
              owner: user._id
            }
          });
        } else {
          return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }
      }
  
      // Step 2: Add query-based filtering on title or description
      if (query.length > 0) {
        pipeline.push({
          $match: {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } }
            ]
          }
        });
      }
  
      // Step 3: Add filter to include only published videos
      pipeline.push({
        $match: {
          isPublished: true
        }
      });
  
      // Step 4: Sorting options
      const sortOptions = { [sortBy]: sortType === 'desc' ? -1 : 1 };
      pipeline.push({
        $sort: sortOptions
      });
  
      // Step 5: Pagination options
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      };
  
      // Step 6: Fetch paginated results
      const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options);
  
      // Step 7: Populate the owner field with fullName
      await Video.populate(videos.docs, { path: 'owner', select: 'fullName' });
  
      // Step 8: Return the response
      return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
    } catch (error) {
      console.error("Error in fetching videos:", error);
      throw new ApiError(500, "Error in fetching videos");
    }
  });
  
  
  

const publishAVideo = asyncHandler(async(req, res)=>{

    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(401, "Please login")
    }

    const {title, description} = req.body

    if([title, description].some((field)=>field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if(!videoLocalPath){
        throw new ApiError(404, "Please attach video")
    }

    if(!thumbnailLocalPath){
        throw new ApiError(404, "Please attach thumbnail")
    }

    const uploadVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    
    if(!uploadVideo){
        throw new ApiError(500, "Error in video upload, please try again")
    }

    if(!uploadThumbnail){
        throw new ApiError(500, "Error in thumbnail upload, please try again");
    }

    const video = await Video.create({
        videoFile: uploadVideo?.url,
        thumbnail: uploadThumbnail?.url,
        title: title,
        description: description,
        duration: uploadVideo?.duration,
        owner: user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully"))
}) 

const getVideoById = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(404, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate('owner', 'avatar fullName username')

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    video.views = video.views+1
    await video.save({validateBeforeSave: false})

    await addVideoToWatchHistory(req.user._id, videoId)

    const videoLike = await Like.find({video: video._id})

    const userId = new mongoose.Types.ObjectId(req.user._id)

    const likeCheck = videoLike.filter(like=> like.likedBy.equals(userId));

    const videoResponse = {
        ...video.toObject(),
        likeCount: videoLike.length,
        likeCheck: likeCheck.length
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, videoResponse, "Video Found!")
    )
})

const updateVideo = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const {title, description} = req.body

    if(!title && !description){
        throw new ApiError(400, "Please enter changes")
    }

    const video = await Video.findById(videoId).select('owner')

    if(!video){
        throw new ApiError(404, "Video Not Found")
    }

    if(video.owner.toString()!=req.user._id.toString()){
        throw new ApiError(404, "You are unauthorized to update this video!")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {$set: {title: title, description: description}}, {new: true}).select("-thumbnail -isPublished")

    if(!updatedVideo){
        throw new ApiError(500, "Error finding video to update")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedVideo, "Updated Successfully")
    )

})

const deleteVideo  = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    const video = await Video.findById(videoId).select("owner")

    if(!video){
        throw new ApiError(404, "Video Not Found")
    }

    if(video.owner.toString() != req.user._id.toString()){
        throw new ApiError(404, "You are unauthorized to delete this video")
    }

    const toBeDeleteVideo = await Video.findByIdAndDelete(videoId)

    if(!toBeDeleteVideo){
        throw new ApiError(500, "Unable to delete at this moment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Deleted Successfully")
    )
})

const toggleVideoStatus = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    const video = await Video.findById(videoId).select("owner")

    if(!video){
        throw new ApiError(404, "Video Not Found")
    }

    if(video.owner.toString() != req.user._id.toString()){
        throw new ApiError(404, "You are unauthorized to delete this video")
    }

    const toggleVideo = await Video.findById(videoId)
    toggleVideo.isPublished = toggleVideo.isPublished ? false : true;
    await toggleVideo.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponse( 200, toggleVideo, "Done!")
    )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const findAllVideoOfCurrentChannel = await Video.find({ owner: user._id });

    if (findAllVideoOfCurrentChannel.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, null, "Channel doesn't have any videos")
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, findAllVideoOfCurrentChannel, "All videos fetched")
        );
});

export {
    getAllVideo,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    toggleVideoStatus,
    getChannelVideos
}

