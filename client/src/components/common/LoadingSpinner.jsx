export default function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <div className="loading-spinner" />
      <p style={{
        color: '#6366f1',
        fontFamily: 'sans-serif',
        fontSize: '0.95rem',
        marginTop: '1rem',
      }}>
        Restoring session...
      </p>
    </div>
  );
}
