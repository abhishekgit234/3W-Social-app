import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import api from '../services/api/axios';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum) => {
    try {
      const res = await api.get(`/posts?page=${pageNum}&limit=10`);
      if (pageNum === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }
      setHasMore(pageNum < res.data.pages);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikeSuccess = (postId, updatedLikes) => {
    setPosts((prev) =>
      prev.map(p => p._id === postId ? { ...p, likes: updatedLikes } : p)
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Feed
        </Typography>
        <Button
          variant="contained"
          startIcon={<CreateIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Post
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onLikeSuccess={handleLikeSuccess}
          />
        ))}
        {posts.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6">No posts yet</Typography>
            <Typography variant="body2">Be the first to share something!</Typography>
          </Box>
        )}
      </Box>

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={loadMore}
            disabled={loadingMore}
            sx={{ px: 4, py: 1 }}
          >
            {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
          </Button>
        </Box>
      )}

      <CreatePostModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </Container>
  );
};

export default Home;
