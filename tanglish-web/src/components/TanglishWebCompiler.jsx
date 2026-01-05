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

const TanglishWebCompiler = () => {
  const [code, setCode] = useState(`// 🌺 Welcome to Tanglish Web Compiler
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

  // Initialize Pyodide with robust error handling
  useEffect(() => {
    const initializePyodide = async () => {
      console.log('🚀 Starting Pyodide initialization...');
      setIsLoading(true);
      setOutput('🔄 Initializing Tanglish Web Compiler...\n\n');

      try {
        // Step 1: Load Pyodide script
        console.log('📦 Loading Pyodide script...');
        await loadPyodideScript();
        
        // Step 2: Initialize Pyodide
        console.log('⚙️ Initializing Pyodide runtime...');
        const pyodide = await initializePyodideRuntime();
        
        // Step 3: Load Tanglish interpreter
        console.log('📝 Loading Tanglish interpreter...');
        await loadTanglishInterpreter(pyodide);
        
        // Success
        console.log('✅ Tanglish Web Compiler ready!');
        setPyodideReady(true);
        setOutput('✅ Tanglish Web Compiler initialized successfully!\n\n🎉 Ready to run your Tanglish code!\n\n💡 Try running the example code or write your own programs.');
        
      } catch (error) {
        console.error('❌ Initialization failed:', error);
        setOutput(`❌ Failed to initialize Tanglish Web Compiler\n\n${error.message}\n\n🔧 Troubleshooting:\n• Check your internet connection\n• Refresh the page (Ctrl+F5)\n• Disable ad blockers\n• Try a different browser`);
      } finally {
        setIsLoading(false);
      }
    };

    initializePyodide();
  }, []);

  // Load Pyodide script with multiple fallbacks
  const loadPyodideScript = async () => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof window.loadPyodide === 'function') {
        console.log('✅ Pyodide already available');
        resolve();
        return;
      }

      // Multiple CDN URLs for redundancy
      const cdnUrls = [
        'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js',
        'https://pyodide-cdn2.iodide.io/v0.23.4/full/pyodide.js'
      ];

      let attempts = 0;
      const tryLoadScript = () => {
        if (attempts >= cdnUrls.length) {
          reject(new Error('Failed to load Pyodide from all CDN sources'));
          return;
        }

        const url = cdnUrls[attempts];
        console.log(`📡 Attempting to load Pyodide from: ${url}`);
        
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        const timeout = setTimeout(() => {
          script.remove();
          attempts++;
          if (attempts < cdnUrls.length) {
            console.log(`⏱️ Timeout, trying next CDN...`);
            tryLoadScript();
          } else {
            reject(new Error('Pyodide loading timeout'));
          }
        }, 15000);

        script.onload = () => {
          clearTimeout(timeout);
          console.log('✅ Pyodide script loaded successfully');
          
          // Wait a bit for the script to fully initialize
          setTimeout(() => {
            if (typeof window.loadPyodide === 'function') {
              resolve();
            } else {
              attempts++;
              tryLoadScript();
            }
          }, 500);
        };

        script.onerror = () => {
          clearTimeout(timeout);
          console.error(`❌ Failed to load from CDN: ${url}`);
          attempts++;
          tryLoadScript();
        };

        document.head.appendChild(script);
      };

      tryLoadScript();
    });
  };

  // Initialize Pyodide runtime
  const initializePyodideRuntime = async () => {
    if (typeof window.loadPyodide !== 'function') {
      throw new Error('Pyodide loader not available after script load');
    }

    try {
      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
        fullStdLib: false
      });

      // Set up global references
      window.pyodide = pyodide;
      window.pyodideReady = true;
      
      console.log('✅ Pyodide runtime initialized');
      return pyodide;
    } catch (error) {
      throw new Error(`Pyodide initialization failed: ${error.message}`);
    }
  };

  // Load Tanglish interpreter
  const loadTanglishInterpreter = async (pyodide) => {
    try {
      // Fetch interpreter code
      const response = await fetch('/tanglish-interpreter.py');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load interpreter`);
      }
      
      const interpreterCode = await response.text();
      console.log('📄 Interpreter code loaded, size:', interpreterCode.length);
      
      // Write to Pyodide filesystem
      pyodide.FS.writeFile('/tanglish_interpreter.py', interpreterCode);
      
      // Import and test the interpreter
      await pyodide.runPythonAsync(`
import sys
sys.path.insert(0, '/')
import tanglish_interpreter
print("✅ Tanglish interpreter loaded successfully")
`);
      
      console.log('✅ Tanglish interpreter loaded and tested');
    } catch (error) {
      throw new Error(`Failed to load Tanglish interpreter: ${error.message}`);
    }
  };

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
    # Return as JSON string for reliable parsing
    json.dumps({"output": output, "error": error, "success": True})
except Exception as e:
    error_msg = "".join(traceback.format_exception(type(e), e, e.__traceback__))
    json.dumps({"output": "", "error": error_msg, "success": False})
`;

      console.log('📝 Executing Python wrapper...');
      const result = await pyodide.runPythonAsync(pythonCode);
      
      // Process result safely - now expecting JSON string
      let resultObj;
      try {
        // The result should be a JSON string
        if (typeof result === 'string') {
          resultObj = JSON.parse(result);
          console.log('✅ Result parsed from JSON string');
        }
        // Fallback: Try toJS() if available
        else if (result && typeof result.toJS === 'function') {
          resultObj = result.toJS();
          console.log('✅ Result processed via toJS()');
        }
        // Fallback: Direct object access
        else if (result && typeof result === 'object') {
          resultObj = result;
          console.log('✅ Result used as direct object');
        }
        else {
          throw new Error('Unexpected result format from Python execution');
        }
        
        // Ensure we have a valid object
        if (!resultObj || typeof resultObj !== 'object') {
          throw new Error('Invalid result format after processing');
        }
        
      } catch (e) {
        console.error('❌ Error processing result:', e);
        console.log('🔍 Raw result type:', typeof result);
        console.log('🔍 Raw result:', result);
        
        // Fallback: try to extract values directly
        try {
          const output = await pyodide.runPythonAsync('sys.stdout.getvalue()');
          const error = await pyodide.runPythonAsync('sys.stderr.getvalue()');
          resultObj = {
            output: await output,
            error: await error,
            success: true
          };
          console.log('✅ Used fallback method to get output');
        } catch (fallbackError) {
          throw new Error(`Failed to process execution result: ${e.message}. Fallback also failed: ${fallbackError.message}`);
        }
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
          // Comments
          [/#.*$/, 'comment'],
          // Keywords
          [/(karuthu|vaippu|vagai|ennam|ezhuthu|unmai_poi|maaththu|kanakku|listu|ottu|settu|agarathi|endraal|illai|matchu|thirumba|foru|varambu|seyal|thiruppu|arrayu|suththi|thoguppu|thethi|kanakku_math|kaattu|unmai|poi)/, 'keyword'],
          // Boolean literals
          [/(unmai|poi)/, 'boolean'],
          // Numbers
          [/\d*\.\d+/, 'number.float'],
          [/\d+/, 'number'],
          // Strings
          [/"/, 'string', '@string'],
          // Operators
          [/[+\-*/<>!=]=?/, 'operator'],
          [/=/, 'operator'],
          // Braces
          [/[{}]/, 'delimiter.bracket'],
          [/[()]/, 'delimiter.parenthesis'],
          [/[\x5B\x5D]/, 'delimiter.parenthesis'],
          // Identifiers
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
    monaco.editor.defineTheme('tanglish-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
        { token: 'boolean', foreground: 'c792ea' },
        { token: 'number', foreground: 'f78c6c' },
        { token: 'string', foreground: 'c3e88d' },
        { token: 'comment', foreground: '546e7a', fontStyle: 'italic' },
        { token: 'operator', foreground: '89ddff' },
        { token: 'identifier', foreground: '82aaff' },
        { token: 'delimiter.bracket', foreground: 'ff5370' },
        { token: 'delimiter.parenthesis', foreground: 'ff5370' },
      ],
      colors: {
        'editor.background': '#1e1e2e',
        'editor.foreground': '#cdd6f4',
        'editorCursor.foreground': '#f5e0dc',
        'editor.lineHighlightBackground': '#313244',
        'editor.selectionBackground': '#45475a',
        'editor.inactiveSelectionBackground': '#313244',
      },
    });

    // Set language and theme
    monaco.editor.setModelLanguage(editor.getModel(), 'tanglish');
    monaco.editor.setTheme('tanglish-dark');
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
    <div className="compiler-container">
      <div className="compiler-header">
        <div className="header-left">
          <h1 className="compiler-title">
            <span className="title-icon">🌺</span>
            Tanglish Web Compiler
          </h1>
          <span className="version-badge">v2.0</span>
        </div>
        <div className="header-right">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="header-btn examples-btn"
          >
            <AcademicCapIcon className="btn-icon" />
            Examples
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="header-btn settings-btn"
          >
            <Cog6ToothIcon className="btn-icon" />
            Settings
          </button>
        </div>
      </div>

      <div className="compiler-main">
        <div className="editor-section">
          <div className="section-header">
            <h2 className="section-title">
              <CodeBracketIcon className="title-icon" />
              Code Editor
            </h2>
            <div className="editor-actions">
              <button onClick={copyCode} className="action-btn">
                <DocumentDuplicateIcon className="btn-icon" />
                Copy
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <Editor
              height="400px"
              language="tanglish"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              theme="tanglish-dark"
              options={{
                fontSize: fontSize,
                wordWrap: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
              }}
            />
          </div>
          <div className="run-section">
            <button
              onClick={executeCode}
              disabled={isLoading || !pyodideReady}
              className={`run-btn ${isLoading ? 'loading' : ''} ${pyodideReady ? 'ready' : 'disabled'}`}
            >
              <PlayIcon className="btn-icon" />
              {isLoading ? 'Running...' : 'Run Code (Ctrl+Enter)'}
            </button>
            {executionTime > 0 && (
              <span className="execution-time">
                ⏱️ {executionTime}ms
              </span>
            )}
          </div>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
              Output Console
            </h2>
            <button onClick={clearOutput} className="action-btn">
              <XMarkIcon className="btn-icon" />
              Clear
            </button>
          </div>
          <div className="output-wrapper">
            <pre className={`output-content ${output.includes('❌') ? 'error' : ''}`}>
              {output || '📝 Your output will appear here...'}
            </pre>
          </div>
        </div>
      </div>

      {showExamples && (
        <div className="examples-panel">
          <h3 className="panel-title">Example Programs</h3>
          <div className="examples-grid">
            {examples.map((example, index) => (
              <div key={index} className="example-card">
                <h4 className="example-name">{example.name}</h4>
                <span className="example-category">{example.category}</span>
                <button
                  onClick={() => {
                    setCode(example.code);
                    setShowExamples(false);
                  }}
                  className="example-load-btn"
                >
                  Load Example
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-panel">
          <h3 className="panel-title">Editor Settings</h3>
          <div className="setting-item">
            <label>Font Size: {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="setting-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TanglishWebCompiler;
