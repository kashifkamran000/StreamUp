import axios from 'axios'

const getSubscribers = async(userId)=>{
    try {
        const response = await axios.get(`/api/v1/subscription/us/${userId}`, {
            withCredentials: true
        })
        
        return response.data.data;

    } catch (error) {
        console.log('Error in fetching Subscribers Count', error);
    }
}

const toggleSubscribe = async(channelId)=>{
    try {
        const response = await axios.get(`/api/v1/subscription/t/${channelId}`, {
            withCredentials: true
        })
    } catch (error) {
        console.log('Error in Subscriber toggle', error);
    }
}

export {
    getSubscribers, 
    toggleSubscribe
}