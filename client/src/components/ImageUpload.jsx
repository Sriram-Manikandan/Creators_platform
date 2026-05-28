import React, { useState, useEffect } from 'react';

export default function ImageUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  // Validate the file size and type
  const validateFile = (file) => {
    // 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return 'Please select an image file (jpeg, png, webp, gif)';
    }

    if (file.size > MAX_SIZE) {
      return `File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Max size is 5MB.`;
    }

    return null; // Null means no error
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      // Optional: Clear the input
      e.target.value = null;
      return;
    }

    // Revoke old URL to prevent memory leaks if user selects another image
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      // This will run when component unmounts OR before previewUrl changes
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    // Call parent handler
    if (onUpload) {
      onUpload(formData);
    }
  };

  return (
    <div className="image-upload-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        
        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        {previewUrl && (
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #444' }} 
          />
        )}
        
        <button 
          type="button" 
          onClick={handleSubmit}
          disabled={!selectedFile || error}
          style={{ padding: '0.5rem 1rem', cursor: selectedFile && !error ? 'pointer' : 'not-allowed' }}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}
