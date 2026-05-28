import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

export default function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${id}`);
        setFormData({
          title: res.data.data.title,
          content: res.data.data.content,
        });
      } catch (err) {
        toast.error(
          err.response?.data?.message || 'Failed to load post. It may not exist or you do not have permission.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/api/posts/${id}`, formData);
      toast.success('Post updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update post. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .edit-root { min-height: 100vh; background: #0a0a0a; font-family: 'DM Sans', sans-serif; color: #f1f5f9; padding: 4rem 2rem; display: flex; justify-content: center; align-items: center; }
        .edit-container { background: #111827; border: 1px solid #1f2937; border-radius: 14px; padding: 3rem; width: 100%; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .edit-header { margin-bottom: 2rem; text-align: center; }
        .edit-header h1 { font-family: 'DM Serif Display', serif; font-size: 2.2rem; color: #f8fafc; margin-bottom: 0.5rem; }
        .edit-header p { color: #94a3b8; font-size: 0.95rem; }
        
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
        .spinner-large { width: 30px; height: 30px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
        
        .loading-container { text-align: center; padding: 3rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="edit-root">
        <div className="edit-container">
          <div className="edit-header">
            <h1>Edit Post</h1>
            <p>Make changes to your published content.</p>
          </div>

          {loading ? (
             <div className="loading-container">
               <div className="spinner-large"></div>
               <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Loading post data...</p>
             </div>
          ) : (
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

              <div className="btn-group">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? <><div className="spinner" />Saving...</> : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
