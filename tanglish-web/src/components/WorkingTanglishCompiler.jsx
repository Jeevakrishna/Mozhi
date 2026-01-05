import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  PlayIcon, 
  DocumentDuplicateIcon, 
  Cog6ToothIcon, 
  AcademicCapIcon,
  CodeBracketIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const WorkingTanglishCompiler = () => {
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
    const initPyodide = async () => {
      if (window.pyodide) {
        setPyodideReady(true);
        return;
      }

      setIsLoading(true);
      try {
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
        });

        window.pyodide = pyodide;
        window.pyodideReady = true;

        const tanglishCode = await fetch('/tanglish-interpreter.py').then(r => r.text());
        pyodide.runPython(tanglishCode);

        setPyodideReady(true);
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error);
        setOutput('❌ Error: Failed to initialize Tanglish compiler. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!window.loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
      script.async = true;
      script.onload = initPyodide;
      document.body.appendChild(script);
    } else {
      initPyodide();
    }
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
      
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      const result = pyodide.runPython(`
try:
    from interpreter import run
    run("""${code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
    output = sys.stdout.getvalue()
    error = sys.stderr.getvalue()
    {"output": output, "error": error}
except Exception as e:
    {"output": "", "error": str(e)}
`);

      const stdout = result.get('output', '');
      const stderr = result.get('error', '');
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));

      let finalOutput = '';
      if (stderr) {
        finalOutput += `❌ Error:\n${stderr}\n`;
      }
      if (stdout) {
        finalOutput += `✅ Output:\n${stdout}`;
      }

      setOutput(finalOutput || '✨ Code executed successfully (no output)');
    } catch (error) {
      setOutput(`❌ Runtime Error:\n${error.message}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-lg border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">த</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Tanglish Professional Compiler
                </h1>
                <p className="text-sm text-gray-400">Tamil-inspired programming language</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2 shadow-lg"
              >
                <AcademicCapIcon className="w-4 h-4" />
                <span>Examples</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all flex items-center space-x-2 shadow-lg"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Examples Dropdown */}
      {showExamples && (
        <div className="absolute right-4 top-20 bg-slate-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-purple-500/20 z-10 w-80 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5 text-yellow-400" />
                <span>Example Programs</span>
              </h3>
              <button
                onClick={() => setShowExamples(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-600/20 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white group-hover:text-yellow-400">
                        {example.name}
                      </div>
                      <div className="text-xs text-gray-400">{example.category}</div>
                    </div>
                    <CodeBracketIcon className="w-4 h-4 text-gray-400 group-hover:text-yellow-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-4 top-20 bg-slate-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-purple-500/20 z-10 w-80">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center space-x-2">
                <Cog6ToothIcon className="w-5 h-5 text-purple-400" />
                <span>Editor Settings</span>
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">{fontSize}px</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Code Editor */}
          <div className="flex flex-col">
            <div className="bg-slate-800/90 backdrop-blur-lg rounded-t-xl border border-purple-500/20 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400 ml-2">Tanglish Code</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={copyCode}
                  className="px-3 py-1 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition-all flex items-center space-x-1"
                  title="Copy code"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 border border-purple-500/20 border-t-0 rounded-b-xl overflow-hidden">
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

          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="bg-slate-800/90 backdrop-blur-lg rounded-t-xl border border-purple-500/20 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Output Console</span>
                {executionTime > 0 && (
                  <span className="text-xs text-green-400">{executionTime}ms</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={clearOutput}
                  className="px-3 py-1 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={executeCode}
                  disabled={isLoading || !pyodideReady}
                  className={`px-4 py-1 rounded-lg transition-all flex items-center space-x-2 ${
                    isLoading || !pyodideReady
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4" />
                      <span>Run (Ctrl+Enter)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex-1 border border-purple-500/20 border-t-0 rounded-b-xl bg-slate-900/90 backdrop-blur-lg p-4 overflow-auto">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {isLoading && !output ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Initializing Tanglish compiler...</span>
                  </div>
                ) : output ? (
                  output.split('\n').map((line, index) => (
                    <div key={index} className={line.includes('❌') ? 'text-red-400' : line.includes('✅') ? 'text-green-400' : 'text-green-400'}>
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-green-400">●</span>
                      <span>Ready to execute Tanglish code</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Press Ctrl+Enter or click Run to execute your code
                    </div>
                  </div>
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 bg-slate-800/90 backdrop-blur-lg rounded-xl border border-purple-500/20 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${pyodideReady ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`}></div>
              <span className={`text-sm ${pyodideReady ? 'text-green-400' : 'text-yellow-400'}`}>
                {pyodideReady ? '🟢 Tanglish Ready' : '🟡 Loading Tanglish...'}
              </span>
            </div>
            
            {executionTime > 0 && (
              <div className="text-sm text-gray-400">
                Execution: {executionTime}ms
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-400 flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4 text-purple-400" />
            <span>Tanglish Professional v1.0</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-lg border-t border-purple-500/20 py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>for Tamil programming community</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            வணக்கம் மீண்டும் சந்திப்போம் • Vanakkam Meet Again
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WorkingTanglishCompiler;
