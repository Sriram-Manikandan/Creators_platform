import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';

export default function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  
  // Image Upload State
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = async (uploadFormData) => {
    setUploading(true);
    setUploadError(null);
    try {
      // NOTE: Axios automatically sets the multipart/form-data boundary
      const res = await api.post('/api/upload', uploadFormData);
      setCoverImageUrl(res.data.url);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload image';
      setUploadError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        ...formData,
        coverImage: coverImageUrl,
      };
      await api.post('/api/posts', postData);
      toast.success('Post created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to create post. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .create-root { min-height: 100vh; background: #0a0a0a; font-family: 'DM Sans', sans-serif; color: #f1f5f9; padding: 4rem 2rem; display: flex; justify-content: center; align-items: center; }
        .create-container { background: #111827; border: 1px solid #1f2937; border-radius: 14px; padding: 3rem; width: 100%; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .create-header { margin-bottom: 2rem; text-align: center; }
        .create-header h1 { font-family: 'DM Serif Display', serif; font-size: 2.2rem; color: #f8fafc; margin-bottom: 0.5rem; }
        .create-header p { color: #94a3b8; font-size: 0.95rem; }
        
        .msg-banner { padding: 12px 16px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; }
        .msg-banner.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }

        .field { margin-bottom: 1.5rem; }
        .field label { display: block; font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .field input, .field textarea { width: 100%; background: #0f172a; border: 1px solid #1f2937; border-radius: 10px; color: #f1f5f9; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 1rem; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
        .field input::placeholder, .field textarea::placeholder { color: #475569; }
        .field input:focus, .field textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .field textarea { min-height: 150px; resize: vertical; }

        .btn-group { display: flex; gap: 1rem; margin-top: 2rem; }
        .btn { flex: 1; padding: 12px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: center; border: none; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary { background: transparent; border: 1px solid #334155; color: #cbd5e1; }
        .btn-secondary:hover { background: rgba(51,65,85,0.3); }

        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="create-root">
        <div className="create-container">
          <div className="create-header">
            <h1>Create New Post</h1>
            <p>Share your ideas with the world.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Post Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., 10 Tips for Modern Web Design"
              />
            </div>

            <div className="field">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
              />
            </div>

            <div className="field">
              <label>Cover Image (Optional)</label>
              {/* Orphaned upload problem: If user uploads an image, then uploads a different one, the first remains on Cloudinary */}
              <ImageUpload onUpload={handleUpload} />
              {uploading && <div style={{ marginTop: '0.5rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px' }}><div className="spinner" style={{ width: '12px', height: '12px', borderColor: 'rgba(129,140,248,0.2)', borderTopColor: '#818cf8' }} /> Uploading image...</div>}
              {uploadError && <div className="error-msg" style={{ marginTop: '0.5rem' }}>{uploadError}</div>}
              {coverImageUrl && !uploading && <div style={{ marginTop: '0.5rem', color: '#22c55e' }}>Image successfully attached to post!</div>}
            </div>

            <div className="btn-group">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || uploading}
              >
                {loading ? <><div className="spinner" />Publishing...</> : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
