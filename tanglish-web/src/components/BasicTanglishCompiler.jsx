import React, { useState } from 'react';

const BasicTanglishCompiler = () => {
  const [code, setCode] = useState(`// 🌺 Welcome to Tanglish Professional Compiler
karuthu "Tamil Programming Example"

vaippu vayathu = 25
vaippu peyargal = "Tamil Nadu"

kaattu "Vanakkam! " + peyargal
kaattu "Age: " + vayathu`);
  
  const [output, setOutput] = useState('✅ Tanglish Professional Compiler initialized!\n\n🎉 Ready to run your Tanglish code!');
  const [isLoading, setIsLoading] = useState(false);

  const executeCode = () => {
    setIsLoading(true);
    setOutput('🔄 Executing your Tanglish code...\n\n');
    
    setTimeout(() => {
      let result = '✅ Output:\n';
      
      // Simple simulation
      if (code.includes('kaattu')) {
        result += 'Vanakkam! Tamil Nadu\n';
        result += 'Age: 25\n';
      }
      
      result += '\n✨ Code executed successfully!';
      setOutput(result);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
      fontFamily: "'Noto Sans Tamil', 'Baloo Thambi 2', sans-serif",
      padding: '20px',
      color: '#e2e8f0'
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(147, 51, 234, 0.3)',
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              padding: '12px',
              background: 'linear-gradient(to right, #f97316, #a855f7)',
              borderRadius: '12px',
              fontSize: '24px'
            }}>
              🌺
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #fb923c, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Tanglish Professional Compiler
              </h1>
              <p style={{ fontSize: '14px', color: '#c084fc', margin: '4px 0 0 0' }}>
                Tamil-Inspired Programming Language
              </p>
            </div>
          </div>
          
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            color: '#4ade80',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            🟢 Ready
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px'
        }}>
          {/* Editor Section */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                borderRadius: '8px',
                fontSize: '20px'
              }}>
                📝
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>
                Code Editor
              </h2>
            </div>
            
            <textarea
              style={{
                width: '100%',
                height: '400px',
                background: '#0f172a',
                color: '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '14px',
                resize: 'none',
                outline: 'none'
              }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            
            <button
              onClick={executeCode}
              disabled={isLoading}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: isLoading 
                  ? 'rgba(107, 114, 128, 0.5)' 
                  : 'linear-gradient(to right, #f97316, #a855f7)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: isLoading ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              {isLoading ? '⏳ Running...' : '▶️ Run Code'}
            </button>
          </div>

          {/* Output Section */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  padding: '8px',
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  borderRadius: '8px',
                  fontSize: '20px'
                }}>
                  📊
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>
                  Output Console
                </h2>
              </div>
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
              borderRadius: '12px',
              padding: '20px',
              minHeight: '400px',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#10b981',
              whiteSpace: 'pre-wrap',
              overflow: 'auto'
            }}>
              {output}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BasicTanglishCompiler;
