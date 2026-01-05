import React from 'react';

const DebugTest = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '20px' }}>
        🌺 Tanglish Compiler Test
      </h1>
      <p style={{ color: 'white', fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px' }}>
        If you can see this page, React is working correctly!
      </p>
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <p style={{ color: 'white', margin: 0 }}>✅ Component Renders Successfully</p>
        <p style={{ color: 'white', margin: '10px 0 0 0' }}>✅ No Import Errors</p>
        <p style={{ color: 'white', margin: '10px 0 0 0' }}>✅ Styles Applied</p>
      </div>
    </div>
  );
};

export default DebugTest;
