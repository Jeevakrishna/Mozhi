import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  PlayIcon, 
  DocumentDuplicateIcon, 
  Cog6ToothIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  XMarkIcon,
  SparklesIcon,
  CpuChipIcon,
  TerminalIcon
} from '@heroicons/react/24/outline';

const WorkingModernCompiler = () => {
  const [code, setCode] = useState(`// 🌺 Welcome to Tanglish Professional Compiler
// Write your Tanglish code with Tamil-inspired keywords

karuthu "Tamil Programming Example"

// Variables with Tamil names
vaippu vayathu = 25
vaippu peyargal = "Tamil Nadu"
vaippu irandu_peranbu = unmai

// Basic operations
kaattu "Vanakkam! " + peyargal
kaattu "Age: " + vayathu

// Conditional logic
endraal vayathu >= 18 {
    kaattu "🎉 You are eligible to vote!"
} illai {
    kaattu "📚 Keep learning and growing!"
}

// Boolean check
endraal irandu_peranbu == unmai {
    kaattu "✨ Truth prevails!"
}

// Simple loop demonstration
vaippu counter = 1
thirumba counter <= 3 {
    kaattu "Count: " + counter
    counter = counter + 1
}`);
  
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [executionTime, setExecutionTime] = useState(0);
  const editorRef = useRef(null);

  // Example programs
  const examples = [
    {
      name: '👋 Hello World',
      category: 'Basic',
      code: `karuthu "Hello World in Tanglish"

vaippu name = "Tamil"
vaippu greeting = "Vanakkam"

kaattu greeting + " " + name + "!"
kaattu "Welcome to Tanglish Programming!"`
    },
    {
      name: '🔢 Variables & Math',
      category: 'Basic',
      code: `karuthu "Mathematics in Tanglish"

vaippu a = 15
vaippu b = 7
vaippu sum = a + b
vaippu product = a * b

kaattu "Addition: " + sum
kaattu "Multiplication: " + product`
    },
    {
      name: '🎯 Conditions',
      category: 'Logic',
      code: `karuthu "Conditional Logic"

vaippu score = 85
vaippu grade = ""

endraal score >= 90 {
    grade = "A+"
    kaattu "Excellent! Grade: " + grade
} illai endraal score >= 80 {
    grade = "A"
    kaattu "Great! Grade: " + grade
} illai {
    grade = "Need Improvement"
    kaattu "Keep practicing! Grade: " + grade
}`
    },
    {
      name: '🔄 Loops',
      category: 'Control',
      code: `karuthu "Loop Examples"

// While loop example
vaippu i = 1
kaattu "Counting with while loop:"
thirumba i <= 5 {
    kaattu "Number: " + i
    i = i + 1
}`
    }
  ];

  // Initialize Pyodide
  useEffect(() => {
    const initializePyodide = async () => {
      console.log('🚀 Starting Pyodide initialization...');
      setIsLoading(true);
      setOutput('🔄 Initializing Tanglish Professional Compiler...\n\n');

      try {
        // Load Pyodide script
        if (typeof window.loadPyodide !== 'function') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
          script.async = true;
          script.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Initialize Pyodide
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
          fullStdLib: false
        });

        window.pyodide = pyodide;
        window.pyodideReady = true;
        
        console.log('✅ Pyodide runtime initialized');

        // Load Tanglish interpreter
        const response = await fetch('/tanglish-interpreter.py');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to load interpreter`);
        }
        
        const interpreterCode = await response.text();
        console.log('📄 Interpreter code loaded, size:', interpreterCode.length);
        
        pyodide.FS.writeFile('/tanglish_interpreter.py', interpreterCode);
        
        await pyodide.runPythonAsync(`
import sys
sys.path.insert(0, '/')
import tanglish_interpreter
print("✅ Tanglish interpreter loaded successfully")
`);
        
        console.log('✅ Tanglish interpreter loaded and tested');
        setPyodideReady(true);
        setOutput('✅ Tanglish Professional Compiler initialized successfully!\n\n🎉 Ready to run your Tanglish code!\n\n💡 Try running the example code or write your own programs.');
        
      } catch (error) {
        console.error('❌ Initialization failed:', error);
        setOutput(`❌ Failed to initialize Tanglish Professional Compiler\n\n${error.message}\n\n🔧 Troubleshooting:\n• Check your internet connection\n• Refresh the page (Ctrl+F5)\n• Disable ad blockers`);
      } finally {
        setIsLoading(false);
      }
    };

    initializePyodide();
  }, []);

  // Execute Tanglish code
  const executeCode = async () => {
    if (!pyodideReady || !window.pyodide) {
      setOutput('⏳ Tanglish compiler is still loading... Please wait.');
      return;
    }

    const startTime = performance.now();
    setIsLoading(true);
    setOutput('🔄 Executing your Tanglish code...\n\n');

    try {
      const pyodide = window.pyodide;
      console.log('🚀 Starting code execution...');
      
      // Reset output streams
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      // Prepare and execute code
      const escapedCode = code
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');

      const pythonCode = `
import sys
import traceback
import json

try:
    from tanglish_interpreter import run
    result = run("""${escapedCode}""")
    output = sys.stdout.getvalue()
    error = sys.stderr.getvalue()
    json.dumps({"output": output, "error": error, "success": True})
except Exception as e:
    error_msg = "".join(traceback.format_exception(type(e), e, e.__traceback__))
    json.dumps({"output": "", "error": error_msg, "success": False})
`;

      console.log('📝 Executing Python wrapper...');
      const result = await pyodide.runPythonAsync(pythonCode);
      
      // Process result
      let resultObj;
      try {
        if (typeof result === 'string') {
          resultObj = JSON.parse(result);
          console.log('✅ Result parsed from JSON string');
        }
        else if (result && typeof result.toJS === 'function') {
          resultObj = result.toJS();
          console.log('✅ Result processed via toJS()');
        }
        else if (result && typeof result === 'object') {
          resultObj = result;
          console.log('✅ Result used as direct object');
        }
        else {
          throw new Error('Unexpected result format from Python execution');
        }
        
        if (!resultObj || typeof resultObj !== 'object') {
          throw new Error('Invalid result format after processing');
        }
        
      } catch (e) {
        console.error('❌ Error processing result:', e);
        throw new Error(`Failed to process execution result: ${e.message}`);
      }

      const { output = '', error = '', success = false } = resultObj;
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));

      // Format output
      let finalOutput = '';
      if (error) {
        finalOutput += `❌ Error:\n${error}\n`;
      }
      if (output) {
        finalOutput += `✅ Output:\n${output}`;
      }

      if (!finalOutput) {
        finalOutput = success 
          ? '✨ Code executed successfully (no output)'
          : '❌ No output or error received';
      }

      setOutput(finalOutput);
      console.log('✅ Execution completed successfully');
      
    } catch (error) {
      console.error('❌ Execution error:', error);
      setOutput(`❌ Runtime Error:\n${error.message}\n\n💡 Please check your code syntax and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register Tanglish language
    monaco.languages.register({ id: 'tanglish' });

    // Define language tokens
    monaco.languages.setMonarchTokensProvider('tanglish', {
      tokenizer: {
        root: [
          [/#.*$/, 'comment'],
          [/(karuthu|vaippu|vagai|ennam|ezhuthu|unmai_poi|maaththu|kanakku|listu|ottu|settu|agarathi|endraal|illai|matchu|thirumba|foru|varambu|seyal|thiruppu|arrayu|suththi|thoguppu|thethi|kanakku_math|kaattu|unmai|poi)/, 'keyword'],
          [/(unmai|poi)/, 'boolean'],
          [/\d*\.\d+/, 'number.float'],
          [/\d+/, 'number'],
          [/"/, 'string', '@string'],
          [/[+\-*/<>!=]=?/, 'operator'],
          [/=/, 'operator'],
          [/[{}]/, 'delimiter.bracket'],
          [/[()]/, 'delimiter.parenthesis'],
          [/[\x5B\x5D]/, 'delimiter.parenthesis'],
          [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],
        ],
        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop'],
        ],
      },
    });

    // Set theme
    monaco.editor.defineTheme('tanglish-professional', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'f97316', fontStyle: 'bold' },
        { token: 'boolean', foreground: 'a855f7' },
        { token: 'number', foreground: '3b82f6' },
        { token: 'string', foreground: '10b981' },
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'operator', foreground: 'f59e0b' },
        { token: 'identifier', foreground: '06b6d4' },
        { token: 'delimiter.bracket', foreground: 'ef4444' },
        { token: 'delimiter.parenthesis', foreground: 'ef4444' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editorCursor.foreground': '#f97316',
        'editor.lineHighlightBackground': '#1e293b',
        'editor.selectionBackground': '#334155',
        'editor.inactiveSelectionBackground': '#1e293b',
        'editorIndentGuide.background': '#334155',
        'editorIndentGuide.activeBackground': '#475569',
      },
    });

    monaco.editor.setModelLanguage(editor.getModel(), 'tanglish');
    monaco.editor.setTheme('tanglish-professional');
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setOutput('📋 Code copied to clipboard!');
  };

  // Clear output
  const clearOutput = () => {
    setOutput('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
      fontFamily: "'Noto Sans Tamil', 'Baloo Thambi 2', sans-serif"
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(147, 51, 234, 0.3)',
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: '0 16px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(to right, #f97316, #a855f7)',
                borderRadius: '8px'
              }}>
                <SparklesIcon style={{ height: '24px', width: '24px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #fb923c, #c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  Tanglish Professional Compiler
                </h1>
                <p style={{ fontSize: '12px', color: '#c084fc', margin: 0 }}>
                  Tamil-Inspired Programming Language
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: pyodideReady ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                color: pyodideReady ? '#4ade80' : '#facc15',
                border: pyodideReady ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)'
              }}>
                {pyodideReady ? '🟢 Ready' : '🟡 Loading'}
              </div>
              <div style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                border: '1px solid rgba(168, 85, 247, 0.3)'
              }}>
                v2.0 Pro
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowExamples(!showExamples)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                borderRadius: '8px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
              }}
            >
              <AcademicCapIcon style={{ height: '16px', width: '16px' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Examples</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                borderRadius: '8px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
              }}
            >
              <Cog6ToothIcon style={{ height: '16px', width: '16px' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px'
        }}>
          {/* Editor Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '8px',
                  background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                  borderRadius: '8px'
                }}>
                  <CodeBracketIcon style={{ height: '20px', width: '20px', color: 'white' }} />
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>
                  Code Editor
                </h2>
              </div>
              <button
                onClick={copyCode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                }}
              >
                <DocumentDuplicateIcon style={{ height: '16px', width: '16px' }} />
                <span>Copy</span>
              </button>
            </div>
            
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))',
                pointerEvents: 'none'
              }}></div>
              <Editor
                height="500px"
                language="tanglish"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme="tanglish-professional"
                options={{
                  fontSize: fontSize,
                  wordWrap: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  padding: { top: 16, bottom: 16 },
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  cursorBlinking: 'smooth',
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={executeCode}
                disabled={isLoading || !pyodideReady}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  cursor: (isLoading || !pyodideReady) ? 'not-allowed' : 'pointer',
                  background: (isLoading || !pyodideReady) 
                    ? 'rgba(107, 114, 128, 0.3)' 
                    : 'linear-gradient(to right, #f97316, #a855f7)',
                  color: (isLoading || !pyodideReady) ? '#9ca3af' : 'white',
                  border: (isLoading || !pyodideReady) 
                    ? '1px solid rgba(107, 114, 128, 0.3)' 
                    : 'none',
                  boxShadow: (isLoading || !pyodideReady) 
                    ? 'none' 
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  if (!isLoading && pyodideReady) {
                    e.target.style.background = 'linear-gradient(to right, #ea580c, #9333ea)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading && pyodideReady) {
                    e.target.style.background = 'linear-gradient(to right, #f97316, #a855f7)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <PlayIcon style={{ height: '20px', width: '20px' }} />
                    <span>Run Code</span>
                  </>
                )}
              </button>
              
              {executionTime > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#c084fc'
                }}>
                  <CpuChipIcon style={{ height: '16px', width: '16px' }} />
                  <span>{executionTime}ms</span>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '8px',
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  borderRadius: '8px'
                }}>
                  <TerminalIcon style={{ height: '20px', width: '20px', color: 'white' }} />
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>
                  Output Console
                </h2>
              </div>
              <button
                onClick={clearOutput}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                }}
              >
                <XMarkIcon style={{ height: '16px', width: '16px' }} />
                <span>Clear</span>
              </button>
            </div>
            
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))',
                pointerEvents: 'none'
              }}></div>
              <div style={{ position: 'relative', padding: '24px' }}>
                <pre style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  margin: 0,
                  color: output.includes('❌') ? '#f87171' : '#4ade80',
                  whiteSpace: 'pre-wrap'
                }}>
                  {output || '📝 Your output will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Examples Panel */}
        {showExamples && (
          <div style={{
            marginTop: '32px',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              Example Programs
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {examples.map((example, index) => (
                <div key={index} style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
                }}>
                  <h4 style={{ fontWeight: '500', color: 'white', marginBottom: '4px' }}>
                    {example.name}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#c084fc' }}>
                    {example.category}
                  </span>
                  <button
                    onClick={() => {
                      setCode(example.code);
                      setShowExamples(false);
                    }}
                    style={{
                      marginTop: '12px',
                      width: '100%',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(168, 85, 247, 0.3)',
                      color: '#c084fc',
                      borderRadius: '8px',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
                    }}
                  >
                    Load Example
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div style={{
            marginTop: '32px',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              Editor Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#c084fc' }}>
                  Font Size
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    style={{ width: '128px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#c084fc', width: '48px' }}>
                    {fontSize}px
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WorkingModernCompiler;
