import { useState } from 'react';

const SimpleCompiler = () => {
  const [code, setCode] = useState(`karuthu "Hello Tanglish"
vaippu name = "Tamil"
kaattu "Vanakkam " + name`);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff', padding: '20px' }}>
      <h1 style={{ color: '#f4c430', marginBottom: '20px' }}>Tanglish Compiler</h1>
      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 200px)' }}>
        <div style={{ flex: 1, backgroundColor: '#2d2d2d', padding: '10px', borderRadius: '8px' }}>
          <h3 style={{ color: '#fff', marginBottom: '10px' }}>Code Editor</h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              height: 'calc(100% - 40px)',
              backgroundColor: '#1e1e1e',
              color: '#fff',
              border: 'none',
              padding: '10px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'none'
            }}
          />
        </div>
        <div style={{ flex: 1, backgroundColor: '#2d2d2d', padding: '10px', borderRadius: '8px' }}>
          <h3 style={{ color: '#fff', marginBottom: '10px' }}>Output</h3>
          <div style={{
            width: '100%',
            height: 'calc(100% - 40px)',
            backgroundColor: '#1e1e1e',
            color: '#00ff00',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '14px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            Output will appear here...
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCompiler;
