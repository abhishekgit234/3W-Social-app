import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Avatar, 
  IconButton, 
  Typography, 
  TextField, 
  Button,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useAuth } from '../context/AuthContext';
import api from '../services/api/axios';

const PostCard = ({ post, onLikeSuccess }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);

  // Check if current user liked the post
  const isLiked = post.likes?.some(like => (like._id || like) === user._id);

  const handleLike = async () => {
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      if (onLikeSuccess) {
        onLikeSuccess(post._id, res.data); // res.data has the updated likes array
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setComments(res.data); // backend returns updated comments array
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.userId?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        }
        title={
          <Typography variant="subtitle2" fontWeight="bold">
            {post.userId?.username || 'Unknown User'}
          </Typography>
        }
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post media"
          sx={{ maxHeight: 500, objectFit: 'cover' }}
        />
      )}
      {post.text && (
        <CardContent>
          <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        </CardContent>
      )}
      <CardActions disableSpacing>
        <IconButton aria-label="like" onClick={handleLike} color={isLiked ? "secondary" : "default"}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mr: 2, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => setShowLikesModal(true)}
        >
          {post.likes?.length || 0}
        </Typography>

        <IconButton aria-label="comment" onClick={() => setShowComments(!showComments)}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {comments.length || 0}
        </Typography>
      </CardActions>

      {showComments && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, maxHeight: 200, overflowY: 'auto' }}>
              {comments.map((comment, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" component="span" fontWeight="bold" sx={{ mr: 1 }}>
                    {comment.username}
                  </Typography>
                  <Typography variant="body2" component="span">
                    {comment.text}
                  </Typography>
                </Box>
              ))}
              {comments.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </Box>
            
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="outlined"
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={!commentText.trim() || submittingComment}
              >
                Post
              </Button>
            </Box>
          </Box>
        </>
      )}

      <Dialog open={showLikesModal} onClose={() => setShowLikesModal(false)}>
        <DialogTitle>Liked by</DialogTitle>
        <List sx={{ pt: 0, minWidth: 250 }}>
          {post.likes?.map((like) => {
            const userId = typeof like === 'object' ? like._id : like;
            const username = typeof like === 'object' ? like.username : 'Unknown User';
            return (
              <ListItem key={userId}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={username} />
              </ListItem>
            );
          })}
          {(!post.likes || post.likes.length === 0) && (
            <ListItem>
              <ListItemText primary="No likes yet." sx={{ textAlign: 'center' }} />
            </ListItem>
          )}
        </List>
      </Dialog>
    </Card>
  );
};

export default PostCard;
