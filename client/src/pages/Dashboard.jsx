import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async (currentPage) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/posts?page=${currentPage}&limit=5`);
      setPosts(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotalPosts(res.data.meta.totalPosts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        // Optimistic UI update
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        setTotalPosts((prev) => prev - 1);
        
        await api.delete(`/api/posts/${postId}`);
      } catch (err) {
        // If it fails, we should ideally fetch posts again or show an error
        setError('Failed to delete post. Please refresh and try again.');
        fetchPosts(page);
      }
    }
  };

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const initials = user.name
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root { min-height: 100vh; background: #0a0a0a; font-family: 'DM Sans', sans-serif; color: #f1f5f9; }
        .dash-main { max-width: 960px; margin: 0 auto; padding: 3rem 2rem; }

        .dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
        .dash-greeting h1 { font-family: 'DM Serif Display', serif; font-size: 2.4rem; color: #f8fafc; margin-bottom: 0.4rem; }
        .dash-greeting h1 em { font-style: italic; color: #a5b4fc; }
        .dash-greeting p { color: #64748b; font-size: 0.95rem; }
        
        .btn-create { padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .btn-create:hover { opacity: 0.9; transform: translateY(-1px); }

        .dash-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
        .dash-card { background: #111827; border: 1px solid #1f2937; border-radius: 14px; padding: 1.5rem; }
        .dash-card-icon { font-size: 1.6rem; margin-bottom: 0.75rem; }
        .dash-card-label { font-size: 0.75rem; color: #64748b; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 4px; }
        .dash-card-value { font-size: 1.5rem; font-weight: 700; color: #f8fafc; }
        .dash-card-sub { font-size: 0.78rem; color: #475569; margin-top: 4px; }

        .content-section { margin-top: 3rem; margin-bottom: 2rem; }
        .section-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: #f8fafc; margin-bottom: 1.5rem; }
        
        .post-list { display: flex; flex-direction: column; gap: 1rem; }
        .post-item { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 1.5rem; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; }
        .post-item:hover { border-color: #374151; transform: translateY(-2px); }
        .post-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
        .post-title { font-size: 1.2rem; font-weight: 600; color: #e2e8f0; margin-bottom: 4px; }
        .post-date { font-size: 0.8rem; color: #64748b; margin-bottom: 12px; }
        .post-content { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 1rem; }
        
        .post-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: auto; border-top: 1px dashed #1f2937; padding-top: 1rem; }
        .action-btn { background: transparent; border: 1px solid #374151; padding: 6px 12px; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 4px; }
        .action-btn.edit { color: #818cf8; }
        .action-btn.edit:hover { background: rgba(129,140,248,0.1); border-color: #818cf8; }
        .action-btn.delete { color: #f87171; }
        .action-btn.delete:hover { background: rgba(248,113,113,0.1); border-color: #f87171; }

        .empty-state { text-align: center; padding: 3rem; background: #111827; border: 1px dashed #374151; border-radius: 12px; color: #64748b; }
        
        .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; }
        .page-btn { background: #1f2937; border: 1px solid #374151; color: #f8fafc; padding: 8px 16px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .page-btn:hover:not(:disabled) { background: #374151; }
        .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .page-info { color: #94a3b8; font-size: 0.9rem; }

        .spinner-wrapper { display: flex; justify-content: center; padding: 3rem; }
        .spinner { width: 30px; height: 30px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .error-msg { color: #f87171; background: rgba(239,68,68,0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.2); margin-bottom: 1rem; }

        .logout-section { text-align: center; padding: 2rem 0; margin-top: 2rem; border-top: 1px solid #1f2937; }
        .logout-btn { padding: 10px 28px; background: transparent; border: 1px solid #ef4444; border-radius: 8px; color: #f87171; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .logout-btn:hover { background: rgba(239,68,68,0.1); }

        @media (max-width: 640px) { .dash-cards { grid-template-columns: 1fr; } .dash-header { flex-direction: column; gap: 1.5rem; } .dash-main { padding: 1.5rem 1rem; } }
      `}</style>

      <div className="dash-root">
        <main className="dash-main">
          <div className="dash-header">
            <div className="dash-greeting">
              <h1>Hello, <em>{user.name.split(' ')[0]}</em> 👋</h1>
              <p>Welcome back to your creator dashboard.</p>
            </div>
            <button className="btn-create" onClick={() => navigate('/create-post')}>
              <span>✏️</span> Create Post
            </button>
          </div>

          {/* Stat cards */}
          <div className="dash-cards">
            <div className="dash-card">
              <div className="dash-card-icon">📝</div>
              <div className="dash-card-label">Total Posts</div>
              <div className="dash-card-value">{totalPosts}</div>
              <div className="dash-card-sub">Content you created</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon">👤</div>
              <div className="dash-card-label">Profile</div>
              <div className="dash-card-value" style={{ fontSize: '1.2rem', paddingTop: 4 }}>{user.name}</div>
              <div className="dash-card-sub">Member since {joinedDate}</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon">🔐</div>
              <div className="dash-card-label">Session</div>
              <div className="dash-card-value" style={{ color: '#22c55e', fontSize: '1.2rem', paddingTop: 4 }}>Active</div>
              <div className="dash-card-sub">Secure JWT connection</div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="section-title">Your Content</h2>
            
            {error && <div className="error-msg">⚠️ {error}</div>}

            {loading ? (
              <div className="spinner-wrapper"><div className="spinner"></div></div>
            ) : posts.length > 0 ? (
              <>
                <div className="post-list">
                  {posts.map((post) => (
                    <div className="post-item" key={post._id}>
                      <div className="post-header-row">
                        <div>
                          <h3 className="post-title">{post.title}</h3>
                          <div className="post-date">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <p className="post-content">{post.content}</p>

                      <div className="post-actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => navigate(`/edit-post/${post._id}`)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDelete(post._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="page-btn" 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      ← Previous
                    </button>
                    <span className="page-info">Page {page} of {totalPages}</span>
                    <button 
                      className="page-btn" 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p>You haven't created any posts yet.</p>
                <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Click "Create Post" to get started!</p>
              </div>
            )}
          </div>

          <div className="logout-section">
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </main>
      </div>
    </>
  );
}