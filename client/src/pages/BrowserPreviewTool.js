import React, { useState } from 'react';
import { generatePreviews } from '../services/apiService';
import { Container, TextField, Button, CircularProgress, Grid, Card, CardMedia, CardContent, Typography, Dialog, DialogContent, DialogTitle } from '@mui/material';

const BrowserPreviewTool = () => {
  const [url, setUrl] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  const handleGeneratePreviews = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await generatePreviews(url);
      setScreenshots(response.data.screenshots);
    } catch (err) {
      setError('Failed to generate previews');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = (imageUrl, size) => {
    setSelectedImage(imageUrl);
    setSelectedSize(size);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    setSelectedSize('');
  };

  const getDialogImageStyle = () => {
    if (selectedSize === 'mobile') {
      return { width: '375px', height: 'auto' };
    } else if (selectedSize === 'tablet') {
      return { width: '768px', height: 'auto' };
    } else {
      return { width: '100%', height: 'auto', maxHeight: '80vh' };
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Cross-Browser Preview Tool
      </Typography>
      <TextField
        label="Enter URL"
        variant="outlined"
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={!!error}
        helperText={error}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGeneratePreviews}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Previews'}
      </Button>
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        {screenshots.map((screenshot, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleClickOpen(screenshot.imageUrl, screenshot.size)}>
              <CardMedia
                component="img"
                alt={`${screenshot.browser} - ${screenshot.size}`}
                height="200"
                image={screenshot.imageUrl}
              />
              <CardContent>
                <Typography variant="h6">
                  {screenshot.browser} - {screenshot.size}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Screenshot</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Screenshot"
              style={getDialogImageStyle()}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default BrowserPreviewTool;