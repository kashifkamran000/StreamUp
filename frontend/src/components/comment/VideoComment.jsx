import React, { useEffect, useState } from 'react';
import { fetchVideoComment, updateComment, addComment, deleteComment } from '../../services/comment';
import LoadingCircular from '../util/Loadings/LoadingCircular';
import { fetchCommnetLike } from '../../services/likes';
import { useSelector } from 'react-redux';
import qs from 'qs';
import Input from '../util/Input';
import { useForm } from 'react-hook-form';
import timeCalculator from '../util/timeCalculator';
import ErrorDisplay from '../util/ErrorDisplay';

function VideoComment({ videoId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComment, setTotalComment] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const user = useSelector((state) => state.auth.userData);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const {register, handleSubmit, formState: {errors}, reset} = useForm()


  const fetchComment = async (videoId, page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchVideoComment(videoId, page);
      const { comments, currentPage, totalComment, totalPages } = response;
      setComments(comments);
      setCurrentPage(currentPage);
      setTotalComment(totalComment);
      setTotalPage(totalPages); 
    } catch (error) {
      console.error('Error fetching comments', error);
      setError('Unable to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComment(videoId, currentPage);
  }, [videoId, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPage) {
      setCurrentPage(newPage);
    }
  };

  const handleCommentLike = async (commentId, index) => {
    setError(null);
    try {
      const newLikeCount = await fetchCommnetLike(commentId);
      const updatedComments = [...comments];
      updatedComments[index].likeCount = newLikeCount;
      setComments(updatedComments);
    } catch (error) {
      console.error("Error toggling like", error);
      setError(error.response?.data?.message || error.message || "Unable to like commmnet, please try agina!")
    }
  };

  const handleEditClick = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleEditSave = async (commentId) => {
    setError(null);
    try {
      const newContent = qs.stringify({
        content: editedContent
      })

     await updateComment(commentId, newContent)
      
      const updatedComments = comments.map(comment => 
        comment._doc._id === commentId 
          ? { ...comment, _doc: { ...comment._doc, content: editedContent } }
          : comment
      );
      setComments(updatedComments);
      setEditingCommentId(null);
      setEditedContent('');
    } catch (error) {
      console.error("Error updating comment", error);
      setError(error.response?.data?.message || error.message || "Unable to update comment, Please try agina!")
    }
  };

  const addCommnet = async(data)=>{
    setError(null);
    try {
      const contentData = qs.stringify({
        content: data.content
      })
      const newComment = await addComment(videoId, contentData);
      const newAddedComment = {
        likeCount: 0,
        _doc: newComment
      }
      setComments(prevCommment => [newAddedComment, ...prevCommment]);
      setTotalComment(prevTotal => prevTotal + 1);
      reset();

    } catch (error) {
      console.error("Error while adding comment", error);
      setError(error.response?.data?.message || error.message || 'Unable to add commnet, please try again!')
    }

  }

  const handleDeleteComment = async (commentId)=>{
    setError(null);
      try {
        await deleteComment(commentId);
        setComments(prevComments => prevComments.filter(comment => comment._doc._id !== commentId));
        setTotalComment(prevTotal => prevTotal - 1);
      } catch (error) {
        console.error("Error while deleteing comment", error);
        setError(error.response?.data?.message || error.message || "Unable to delete comment, please try again!")
      }
  }

  if (loading) {
    return <div className="text-center"><LoadingCircular/></div>;
  }

  else if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  else {return (
    <div>
      <h1 className='text-2xl font-semibold mb-10'>{totalComment} Comments</h1>
      <form onSubmit={handleSubmit(addCommnet)}>
        <div className='grid grid-cols-12 m-5 place-content-center border-b border-white/20 mb-10'>
          <div >
              <img src={user.avatar} className='w-14 h-14 rounded-full' />
          </div>
          <div className='col-span-10 pt-3'>
            <Input 
            {...register('content', { required: 'To post please add comment' })}
            error={errors.content?.message}
            labelClassName="text-white"
            className='bg-gray-box border-none text-white' placeholder='Add Comment' onFocus={(e) => { e.target.style.backgroundColor = "#18181B"}}/>
          </div>
          <div className='flex justify-end '>
            <button type='submit'>Post</button>
          </div>
        </div>
      </form>

      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={comment._doc._id} className="grid w-full grid-cols-12 hyphens-auto mb-8">
            <div className='flex justify-center p-3'>
              <img src={comment._doc.owner.avatar} className='w-12 h-12 rounded-full' alt={`${comment._doc.owner.username}'s avatar`} />
            </div>
            <div className='col-span-11 flex justify-between'>
              <div>
                <p className='text-white/60 m-2'>@ {comment._doc.owner.username} &nbsp;&nbsp;&nbsp; {timeCalculator(comment._doc.createdAt)}</p>
                {editingCommentId === comment._doc._id ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className='text-white bg-gray-box rounded-xl scrollbar-track-black scrollbar-thin p-2 w-full'
                    cols="93"
                  />
                ) : (
                  <p className='text-white m-2'>{comment._doc.content}</p>
                )}
                <i 
                  onClick={() => handleCommentLike(comment._doc._id, index)} 
                  className={`fa-solid fa-heart m-2 cursor-pointer ${comment.likeCount === 0 ? "text-white" : "text-red-600"}`}
                ></i>
                {comment.likeCount !== undefined ? comment.likeCount : 0}
              </div>
              <div className='mr-4'>
                {comment._doc.owner._id === user._id && (
                  editingCommentId === comment._doc._id ? (
                    <div className='grid grid-rows-3'>
                      <button onClick={() => handleEditSave(comment._doc._id)} className="m-2 text-start opacity-65 hover:opacity-100 active:opacity-65 ">Save</button>
                      <button onClick={handleEditCancel} className="m-2 text-start opacity-65 hover:opacity-100 active:opacity-65 ">Cancel</button>
                      <button onClick={()=>handleDeleteComment(comment._doc._id)} className="m-2 text-start opacity-65 hover:opacity-100 active:opacity-65 ">Delete</button>
                    </div>
                  ) : (
                    <button onClick={() => handleEditClick(comment._doc._id, comment._doc.content)}>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No comments available</p>
      )}
      <div className="w-full text-center ">
        <i className={`fa-solid fa-arrow-left mr-3 ${currentPage === 1 ? "opacity-40" : "opacity-100"}`} onClick={() => handlePageChange(currentPage - 1)}></i>
        <span>Page {currentPage} of {totalPage}</span>
        <i className={`fa-solid fa-arrow-right ml-3 ${currentPage === totalPage ? "opacity-40" : "opacity-100"}`} onClick={() => handlePageChange(currentPage + 1)}></i>
      </div>

      {error && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
    </div>
  );
}
}

export default VideoComment;