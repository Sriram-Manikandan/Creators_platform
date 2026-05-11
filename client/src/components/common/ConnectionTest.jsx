import { useState } from 'react';

function ConnectionTest() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(null);

    const testConnection = async () => {
        setLoading(true);
        setStatus('');
        try {
            const res = await fetch('/api/health');  // ← Relative URL (proxy!)
            const data = await res.json();
            setIsSuccess(true);
            setStatus(`✅ Connected! Server says: "${data.message}"`);
        } catch (_err) {
            setIsSuccess(false);
            setStatus('❌ Failed to connect. Is the backend running?');
        }
        setLoading(false);
    };

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px auto',
            maxWidth: '400px',
            textAlign: 'center'
        }}>
            <h3>Backend Connection Test</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
                Tests if frontend can reach the Express backend
            </p>
            <button
                onClick={testConnection}
                disabled={loading}
                style={{
                    padding: '10px 24px',
                    backgroundColor: loading ? '#ccc' : '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                }}
            >
                {loading ? 'Testing...' : 'Test Connection'}
            </button>

            {status && (
                <p style={{
                    marginTop: '16px',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: isSuccess ? '#dcfce7' : '#fee2e2',
                    color: isSuccess ? '#166534' : '#991b1b',
                    fontWeight: 'bold'
                }}>
                    {status}
                </p>
            )}
        </div>
    );
}

export default ConnectionTest;