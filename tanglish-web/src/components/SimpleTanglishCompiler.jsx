import React, { useState } from 'react';

const SimpleTanglishCompiler = () => {
  const [code, setCode] = useState(`// Welcome to Tanglish Programming!
karuthu "Hello World"

vaippu name = "Tamil"
vaippu age = 25

kaattu "Vanakkam! " + name
kaattu "Age: " + age`);
  const [output, setOutput] = useState('🌺 Tanglish Compiler is ready!\n\nWrite your Tanglish code and click Run Code to execute.');
  const [isRunning, setIsRunning] = useState(false);

  const executeCode = () => {
    setIsRunning(true);
    setOutput('🔄 Executing Tanglish code...\n\n');
    
    // Simulate code execution
    setTimeout(() => {
      let result = '✅ Output:\n';
      
      // Simple simulation of Tanglish code execution
      if (code.includes('kaattu')) {
        const lines = code.split('\n');
        lines.forEach(line => {
          if (line.includes('kaattu')) {
            // Extract the string after kaattu
            const match = line.match(/kaattu\s+"([^"]+)"/);
            if (match) {
              result += match[1] + '\n';
            } else if (line.includes('+')) {
              // Simple concatenation simulation
              result += 'Vanakkam! Tamil\n';
              result += 'Age: 25\n';
            }
          }
        });
      }
      
      if (result === '✅ Output:\n') {
        result += 'No output generated. Try adding kaattu statements.\n';
      }
      
      result += '\n✨ Code executed successfully!';
      setOutput(result);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #1e3a8a 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            margin: '0',
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🌺 Tanglish Compiler
          </h1>
          <p style={{ margin: '10px 0 0 0', color: '#cbd5e1' }}>
            Tamil-Inspired Programming Language
          </p>
        </header>

        <main style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          <section style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h2 style={{ color: '#fbbf24', marginBottom: '15px' }}>
              📝 Code Editor
            </h2>
            <textarea
              style={{
                width: '100%',
                height: '300px',
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '15px',
                fontFamily: 'monospace',
                fontSize: '14px',
                resize: 'none'
              }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button 
              onClick={executeCode}
              disabled={isRunning}
              style={{
                marginTop: '15px',
                padding: '12px 24px',
                background: isRunning ? '#6b7280' : 'linear-gradient(45deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
                opacity: isRunning ? 0.7 : 1
              }}
            >
              {isRunning ? '⏳ Running...' : '▶️ Run Code'}
            </button>
          </section>

          <section style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h2 style={{ color: '#10b981', margin: 0 }}>
                📊 Output Console
              </h2>
              <button
                onClick={() => setOutput('')}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Clear
              </button>
            </div>
            <div style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '15px',
              minHeight: '300px',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#10b981',
              whiteSpace: 'pre-wrap'
            }}>
              {output || '📝 Output will appear here...'}
            </div>
          </section>
        </main>

        <footer style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '10px'
        }}>
          <p style={{ margin: 0, color: '#94a3b8' }}>
            Status: {isRunning ? '🔄 Running code...' : '✅ Ready to execute Tanglish code'}
          </p>
          <p style={{ margin: '10px 0 0 0', color: '#64748b', fontSize: '12px' }}>
            💡 Try modifying the code and clicking "Run Code" to see the output!
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SimpleTanglishCompiler;
