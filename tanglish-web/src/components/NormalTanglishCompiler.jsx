import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  PlayIcon, 
  DocumentDuplicateIcon, 
  Cog6ToothIcon, 
  AcademicCapIcon,
  CodeBracketIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const NormalTanglishCompiler = () => {
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
    const ensurePyodideScript = () => new Promise((resolve, reject) => {
      // If loadPyodide is already a function, we're good
      if (typeof globalThis.loadPyodide === 'function') {
        return resolve();
      }
      // Avoid double-injecting the script
      if (window.__pyodideLoading) {
        const checkInterval = setInterval(() => {
          if (typeof globalThis.loadPyodide === 'function') {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
        // Fallback timeout
        setTimeout(() => {
          clearInterval(checkInterval);
          if (typeof globalThis.loadPyodide === 'function') {
            resolve();
          } else {
            reject(new Error('Timed out waiting for Pyodide to load'));
          }
        }, 10000);
        return;
      }

      console.log('Loading Pyodide script...');
      window.__pyodideLoading = true;
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
      script.async = true;
      script.onload = () => {
        if (typeof globalThis.loadPyodide === 'function') {
          resolve();
        } else {
          reject(new Error('Pyodide script loaded but loadPyodide is unavailable'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load Pyodide script'));
      };
      document.body.appendChild(script);
    });

    const initPyodide = async () => {
      console.log('Initializing Pyodide...');
      setIsLoading(true);
      
      try {
        await ensurePyodideScript();

        const loadFn = globalThis.loadPyodide;
        if (typeof loadFn !== 'function') {
          throw new Error('loadPyodide is not available after script load');
        }

        // Load Pyodide
        const pyodide = await loadFn({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
        });

        console.log('Pyodide loaded successfully');
        window.pyodide = pyodide;
        window.pyodideReady = true;

        // Load Tanglish interpreter
        try {
          const tanglishCode = await fetch('/tanglish-interpreter.py');
          if (!tanglishCode.ok) {
            throw new Error('Failed to load tanglish-interpreter.py');
          }
          const codeText = await tanglishCode.text();
          console.log('Tanglish interpreter code loaded, length:', codeText.length);
          
          // Save as a real module so `from interpreter import run` works
          window.pyodide.FS.writeFile('interpreter.py', codeText);
          // Validate import once to ensure module is loadable
          await window.pyodide.runPythonAsync('import importlib; import interpreter; importlib.reload(interpreter)');
          console.log('Tanglish interpreter module loaded successfully');
          
          setPyodideReady(true);
          setOutput('✅ Tanglish compiler initialized successfully!');
        } catch (interpreterError) {
          console.error('Failed to load Tanglish interpreter:', interpreterError);
          setOutput('❌ Error: Failed to load Tanglish interpreter.\n\nDetails: ' + interpreterError.message);
        }
      } catch (pyodideError) {
        console.error('Failed to initialize Pyodide:', pyodideError);
        setOutput('❌ Error: Failed to initialize Pyodide.\n\nPlease check your internet connection and refresh the page.\n\nDetails: ' + pyodideError.message);
      } finally {
        setIsLoading(false);
      }
    };

    initPyodide();
  }, []);

  // Execute code
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
      console.log('Executing Tanglish code...');
      
      // Clear previous output
      await pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      // Prepare the Tanglish code with proper error handling
      const escapedCode = code
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/"/g, '\\"')    // Escape double quotes
        .replace(/\n/g, '\\n')   // Escape newlines
        .replace(/\r/g, '\\r');  // Escape carriage returns

      const pythonCode = `
import sys
import traceback

try:
    from interpreter import run
    result = run("""${escapedCode}""")
    output = sys.stdout.getvalue()
    error = sys.stderr.getvalue()
    {"output": output, "error": error, "success": True}
except Exception as e:
    error_msg = "".join(traceback.format_exception(type(e), e, e.__traceback__))
    {"output": "", "error": error_msg, "success": False}
`;

      console.log('Running Python code...');
      const result = await pyodide.runPythonAsync(pythonCode);
      
      // Handle the result safely
      let resultObj;
      try {
        resultObj = result && typeof result.toJS === 'function' ? result.toJS() : result;
        if (!resultObj || typeof resultObj !== 'object') {
          throw new Error('Invalid result format from Python execution');
        }
      } catch (e) {
        console.error('Error processing result:', e);
        throw new Error('Failed to process execution result');
      }

      const { output = '', error = '', success = false } = resultObj;
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));

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
          : '❌ No output or error message received from the interpreter';
      }

      setOutput(finalOutput);
      console.log('Execution completed');
    } catch (error) {
      console.error('Execution error:', error);
      setOutput(`❌ Runtime Error:\n${error.message}\n\nPlease check your code and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register Tanglish language
    monaco.languages.register({ id: 'tanglish' });

    // Tanglish language tokens
    monaco.languages.setMonarchTokensProvider('tanglish', {
      tokenizer: {
        root: [
          // Comments
          [/#.*$/, 'comment'],
          
          // Keywords
          [/\b(karuthu|vaippu|vagai|ennam|ezhuthu|unmai_poi|maaththu|kanakku|listu|ottu|settu|agarathi|endraal|illai|matchu|thirumba|foru|varambu|seyal|thiruppu|arrayu|suththi|thoguppu|thethi|kanakku_math|kaattu|unmai|poi)\b/, 'keyword'],
          
          // Numbers
          [/\d*\.\d+([eE][+-]?\d+)?/, 'number.float'],
          [/\d+/, 'number'],
          
          // Strings
          [/"/, 'string', '@string_double'],
          
          // Operators
          [/[+*/=<>!-]+/, 'operators'],
          
          // Brackets
          [/[()[\]{}]+/, '@brackets'],
          
          // Identifiers
          [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],
        ],
        
        string_double: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop'],
        ],
      },
    });

    // Custom theme
    monaco.editor.defineTheme('tanglish-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'f4c430', fontStyle: 'bold' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
        { token: 'operators', foreground: 'ff7b72' },
        { token: 'identifier', foreground: 'ffa657' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#161b22',
        'editorCursor.foreground': '#58a6ff',
      }
    });

    monaco.editor.setModelLanguage(editor.getModel(), 'tanglish');
    monaco.editor.setTheme('tanglish-dark');

    // Keyboard shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      executeCode();
    });
  };

  // Load example
  const loadExample = (example) => {
    setCode(example.code);
    setShowExamples(false);
    setOutput('');
  };

  // Copy code
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setOutput('📋 Code copied to clipboard!');
    setTimeout(() => setOutput(''), 2000);
  };

  // Clear output
  const clearOutput = () => {
    setOutput('');
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo">
                <span className="logo-text">த</span>
                <div className="status-dot"></div>
              </div>
              <div className="title-section">
                <h1>Tanglish Professional Compiler</h1>
                <p>Tamil-inspired programming language</p>
              </div>
            </div>
            
            <div className="header-buttons">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="btn btn-primary"
              >
                <AcademicCapIcon style={{width: '16px', height: '16px'}} />
                <span>Examples</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn btn-secondary"
              >
                <Cog6ToothIcon style={{width: '16px', height: '16px'}} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Examples Dropdown */}
      {showExamples && (
        <div className="dropdown">
          <div className="dropdown-header">
            <div className="dropdown-title">
              <span style={{color: '#fbbf24'}}>✨</span>
              <span>Example Programs</span>
            </div>
            <button
              onClick={() => setShowExamples(false)}
              className="dropdown-close"
            >
              <XMarkIcon style={{width: '20px', height: '20px'}} />
            </button>
          </div>
          <div>
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example)}
                className="example-item"
              >
                <div>
                  <div className="example-name">{example.name}</div>
                  <div className="example-category">{example.category}</div>
                </div>
                <CodeBracketIcon style={{width: '16px', height: '16px'}} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="dropdown">
          <div className="dropdown-header">
            <div className="dropdown-title">
              <Cog6ToothIcon style={{width: '20px', height: '20px', color: '#a78bfa'}} />
              <span>Editor Settings</span>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="dropdown-close"
            >
              <XMarkIcon style={{width: '20px', height: '20px'}} />
            </button>
          </div>
          <div style={{padding: '16px'}}>
            <div style={{marginBottom: '16px'}}>
              <label style={{color: '#d1d5db', fontSize: '14px', display: 'block', marginBottom: '8px'}}>
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={{width: '100%'}}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="editor-grid">
            {/* Code Editor */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="window-controls">
                    <div className="window-dot red"></div>
                    <div className="window-dot yellow"></div>
                    <div className="window-dot green"></div>
                  </div>
                  <span>Tanglish Code</span>
                </div>
                <div className="panel-actions">
                  <button
                    onClick={copyCode}
                    className="btn btn-secondary"
                    style={{padding: '4px 8px'}}
                    title="Copy code"
                  >
                    <DocumentDuplicateIcon style={{width: '16px', height: '16px'}} />
                  </button>
                </div>
              </div>
              <div className="panel-content">
                <div className="editor-container">
                  <Editor
                    height="100%"
                    defaultLanguage="tanglish"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    onMount={handleEditorDidMount}
                    theme="tanglish-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: fontSize,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      lineNumbers: 'on',
                      renderLineHighlight: 'line',
                      cursorBlinking: 'blink',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="status-dot" style={{background: '#3b82f6', animation: 'pulse 2s infinite'}}></div>
                  <span>Output Console</span>
                  {executionTime > 0 && (
                    <span style={{color: '#10b981', fontSize: '12px'}}>{executionTime}ms</span>
                  )}
                </div>
                <div className="panel-actions">
                  <button
                    onClick={clearOutput}
                    className="btn btn-secondary"
                    style={{padding: '4px 8px'}}
                  >
                    Clear
                  </button>
                  <button
                    onClick={executeCode}
                    disabled={isLoading || !pyodideReady}
                    className="btn btn-success"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon style={{width: '16px', height: '16px'}} />
                        <span>Run (Ctrl+Enter)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="panel-content">
                <div className="output-console">
                  {isLoading && !output ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div className="loading-spinner"></div>
                      <span>Initializing Tanglish compiler...</span>
                    </div>
                  ) : output ? (
                    output.split('\n').map((line, index) => (
                      <div key={index} className={line.includes('❌') ? 'error' : line.includes('✅') ? 'success' : ''}>
                        {line}
                      </div>
                    ))
                  ) : (
                    <div style={{color: '#6b7280'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                        <span style={{color: '#10b981'}}>●</span>
                        <span>Ready to execute Tanglish code</span>
                      </div>
                      <div style={{fontSize: '12px', color: '#4b5563'}}>
                        Press Ctrl+Enter or click Run to execute your code
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="status-bar">
            <div className="status-left">
              <div className="status-indicator">
                <div className={`status-dot ${pyodideReady ? 'ready' : 'loading'}`}></div>
                <span style={{color: pyodideReady ? '#10b981' : '#f59e0b'}}>
                  {pyodideReady ? '🟢 Tanglish Ready' : '🟡 Loading Tanglish...'}
                </span>
              </div>
              
              {executionTime > 0 && (
                <div style={{fontSize: '14px', color: '#9ca3af'}}>
                  Execution: {executionTime}ms
                </div>
              )}
            </div>
            
            <div className="status-right">
              <span style={{color: '#a78bfa'}}>✨</span>
              <span>Tanglish Professional v1.0</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <span>Made with</span>
            <span className="footer-heart">❤️</span>
            <span>for Tamil programming community</span>
          </div>
          <p className="footer-tamil">
            வணக்கம் மீண்டும் சந்திப்போம் • Vanakkam Meet Again
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NormalTanglishCompiler;
