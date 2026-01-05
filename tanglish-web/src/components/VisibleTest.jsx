import React from 'react';

const VisibleTest = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0, textAlign: 'center' }}>
        🌺 Tanglish Compiler
      </h1>
      <p style={{ fontSize: '1.5rem', margin: '20px 0', textAlign: 'center' }}>
        Professional Tamil Programming Environment
      </p>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <p style={{ fontSize: '1.2rem', margin: 0 }}>
          ✅ Component is Visible!
        </p>
        <p style={{ fontSize: '1rem', margin: '10px 0 0 0' }}>
          If you can see this page, React is working correctly
        </p>
      </div>
    </div>
  );
};

export default VisibleTest;
