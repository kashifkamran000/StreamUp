import axios from "axios"


const fetchVideoComment = async(videoId, page)=>{
    try {
        const response = await axios.get(`/api/v1/comment/${videoId}`,{
            params:{
                page: page,
                limit: 10
            }
        }, {
            withCredentials: true
        })
        
        if(response.status === 200){
            return response.data.data
        }
    } catch (error) {
        console.log("Error while fetching video commnet", error);
    }
}

const updateComment = async(commentId, content)=>{
    try {
        const response = await axios.patch(`/api/v1/comment/update/${commentId}`, content,{
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded',
            }
        } ,{
            withCredentials: true
        })
        
        if(response.status === 200){
            return(response.data.data);
        }
    } catch (error) {
        
    }
}

const addComment = async (videoId, content) => {
    try {
      const response = await axios.post(
        `/api/v1/comment/${videoId}`,
        content,
        {
          headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
          },
          withCredentials: true
        }
      );
  
      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error while adding comment:", error.response?.data || error.message);
      throw error; 
    }
  };

  const deleteComment = async(commentId)=>{
    try {
        await axios.delete( `/api/v1/comment/del/${commentId}`, {
            withCredentials: true
        })
    } catch (error) {
        console.error("Error while deleteing comment:", error.response?.data || error.message);
      throw error; 
    }
  }
  

export{
    fetchVideoComment, 
    updateComment, 
    addComment,
    deleteComment
}