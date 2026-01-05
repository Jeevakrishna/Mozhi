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

const ModernTanglishCompiler = () => {
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

  // Initialize Pyodide with robust error handling
  useEffect(() => {
    const initializePyodide = async () => {
      console.log('🚀 Starting Pyodide initialization...');
      setIsLoading(true);
      setOutput('🔄 Initializing Tanglish Professional Compiler...\n\n');

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
        console.log('✅ Tanglish Professional Compiler ready!');
        setPyodideReady(true);
        setOutput('✅ Tanglish Professional Compiler initialized successfully!\n\n🎉 Ready to run your Tanglish code!\n\n💡 Try running the example code or write your own programs.');
        
      } catch (error) {
        console.error('❌ Initialization failed:', error);
        setOutput(`❌ Failed to initialize Tanglish Professional Compiler\n\n${error.message}\n\n🔧 Troubleshooting:\n• Check your internet connection\n• Refresh the page (Ctrl+F5)\n• Disable ad blockers\n• Try a different browser`);
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

    // Set language and theme
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 backdrop-blur-lg bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                    Tanglish Professional Compiler
                  </h1>
                  <p className="text-xs text-purple-300">Tamil-Inspired Programming Language</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  pyodideReady 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {pyodideReady ? '🟢 Ready' : '🟡 Loading'}
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  v2.0 Pro
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg border border-purple-600/30 transition-all duration-200"
              >
                <AcademicCapIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Examples</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg border border-purple-600/30 transition-all duration-200"
              >
                <Cog6ToothIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                  <CodeBracketIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Code Editor</h2>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg border border-blue-600/30 transition-all duration-200 text-sm"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                <span>Copy</span>
              </button>
            </div>
            
            <div className="relative rounded-xl overflow-hidden border border-purple-800/30 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 pointer-events-none"></div>
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
            
            <div className="flex items-center justify-between">
              <button
                onClick={executeCode}
                disabled={isLoading || !pyodideReady}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isLoading || !pyodideReady
                    ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed border border-gray-600/30'
                    : 'bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-5 w-5" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
              
              {executionTime > 0 && (
                <div className="flex items-center space-x-2 text-sm text-purple-300">
                  <CpuChipIcon className="h-4 w-4" />
                  <span>{executionTime}ms</span>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <TerminalIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Output Console</h2>
              </div>
              <button
                onClick={clearOutput}
                className="flex items-center space-x-2 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg border border-red-600/30 transition-all duration-200 text-sm"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
            
            <div className="relative rounded-xl overflow-hidden border border-purple-800/30 shadow-2xl bg-black/40 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 pointer-events-none"></div>
              <div className="relative p-6">
                <pre className={`font-mono text-sm leading-relaxed ${
                  output.includes('❌') ? 'text-red-400' : 'text-green-400'
                }`}>
                  {output || '📝 Your output will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Examples Panel */}
        {showExamples && (
          <div className="mt-8 p-6 rounded-xl border border-purple-800/30 bg-black/40 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Example Programs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {examples.map((example, index) => (
                <div key={index} className="p-4 rounded-lg border border-purple-700/30 bg-purple-900/20 hover:bg-purple-900/30 transition-all duration-200">
                  <h4 className="font-medium text-white mb-1">{example.name}</h4>
                  <span className="text-xs text-purple-300">{example.category}</span>
                  <button
                    onClick={() => {
                      setCode(example.code);
                      setShowExamples(false);
                    }}
                    className="mt-3 w-full px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 rounded-lg border border-purple-600/30 transition-all duration-200 text-sm"
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
          <div className="mt-8 p-6 rounded-xl border border-purple-800/30 bg-black/40 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Editor Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-purple-300">Font Size</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-purple-300 w-12">{fontSize}px</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ModernTanglishCompiler;
