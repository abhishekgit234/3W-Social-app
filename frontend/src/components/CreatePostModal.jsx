import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  CircularProgress 
} from '@mui/material';
import api from '../services/api/axios';

const CreatePostModal = ({ open, onClose, onPostCreated }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      setError('Please provide text or an image.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (file) formData.append('imageFile', file);

      const res = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onPostCreated(res.data);
      setText('');
      setFile(null);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Post</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="What's on your mind?"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              {file ? file.name : 'Upload Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
            {error && (
              <Box color="error.main" fontSize="0.875rem">
                {error}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || (!text.trim() && !file)}
          >
            {loading ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePostModal;
