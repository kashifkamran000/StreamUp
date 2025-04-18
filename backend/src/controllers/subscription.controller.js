import mongoose from "mongoose";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {Subscription} from '../models/subscription.model.js'

const getSubscriberedChannel = asyncHandler(async(req, res)=>{
    const subscribedChannel = await Subscription.find({subscriber: req.user._id})
    .populate('channel', 'fullName username avatar')

    console.log('Fetched Subscriptions:', subscribedChannel);

    return res
    .status(200)
    .json(
        new ApiResponse(200, subscribedChannel, "Subscribed Channels Fetched")
    )
})

const getSubscribers = asyncHandler(async(req, res)=>{
    const subscriber = await Subscription.find({channel: req.params.channelId})
    .populate('subscriber', 'fullName username avatar')

    return res
    .status(200)
    .json(
        new ApiResponse(200, subscriber, "Subscriber Fetched")
    )

})

const toggleSubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const currentUser = req.user._id;

    // Check for existing subscription
    const existingSubscription = await Subscription.findOne({
        subscriber: currentUser,
        channel: channelId
    });

    if (existingSubscription) {
        // Unsubscribe
        await Subscription.deleteOne({ _id: existingSubscription._id });
        return res.status(200).json(new ApiResponse(200, null, "Channel unsubscribed"));
    } else {
        // Subscribe
        const newSubscription = new Subscription({
            subscriber: currentUser,
            channel: channelId
        });

        await newSubscription.save();
        return res.status(200).json(new ApiResponse(200, null, "Channel subscribed"));
    }
});



export {
    getSubscriberedChannel,
    getSubscribers, 
    toggleSubscribe
}