import React from 'react';

const TestCompiler = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
      padding: '20px',
      color: '#e2e8f0'
    }}>
      <h1 style={{ color: '#f97316', fontSize: '2rem', marginBottom: '20px' }}>
        🌺 Tanglish Compiler Test
      </h1>
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '20px', 
        borderRadius: '10px',
        border: '1px solid rgba(147, 51, 234, 0.3)'
      }}>
        <p>If you can see this, the React app is working!</p>
        <p style={{ marginTop: '10px', color: '#10b981' }}>
          ✅ Component renders successfully
        </p>
      </div>
    </div>
  );
};

export default TestCompiler;
