import axios from "axios"

const addToPlaylist = async( playlistId, videoId)=>{
    try {
        const response = await axios.patch(`/api/v1/playlist/add/${playlistId}/${videoId}`, {withCredentials: true});
        if(response.status===200){
            return 'ok';
        }
    } catch (error) {
        console.error("Error while adding video to playlist", error);
    }
}

export default addToPlaylist