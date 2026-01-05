import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { PlayCircleIcon, DocumentDuplicateIcon, Cog6ToothIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const TanglishCompiler = () => {
  const [code, setCode] = useState(`// வணக்கம்! Welcome to Tanglish Compiler
// Write your Tanglish code here

karuthu "Hello World Program"

vaippu name = "Tamil"
vaippu age = 25

kaattu "Vanakkam " + name
kaattu "Age: " + age

endraal age > 18 {
    kaattu "You are an adult!"
} illai {
    kaattu "You are young!"
}
`);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const editorRef = useRef(null);

  // Example code snippets
  const examples = [
    {
      name: 'Hello World',
      code: `karuthu "Hello World Program"

vaippu name = "Tamil Nadu"
kaattu "Vanakkam " + name`
    },
    {
      name: 'Variables & Math',
      code: `karuthu "Variables and Math"

vaippu a = 10
vaippu b = 20
vaippu sum = a + b

kaattu "Sum: " + sum`
    },
    {
      name: 'Conditions',
      code: `karuthu "Conditional Statements"

vaippu score = 85

endraal score >= 90 {
    kaattu "Grade: A"
} illai endraal score >= 80 {
    kaattu "Grade: B"
} illai {
    kaattu "Grade: C"
}`
    },
    {
      name: 'Loops',
      code: `karuthu "Loop Example"

vaippu i = 1
thirumba i <= 5 {
    kaattu "Count: " + i
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

        // Store pyodide globally
        window.pyodide = pyodide;
        window.pyodideReady = true;

        // Load the Tanglish interpreter code
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

    // Load Pyodide script if not already loaded
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

  // Execute Tanglish code
  const executeCode = async () => {
    if (!pyodideReady || !window.pyodide) {
      setOutput('⏳ Tanglish compiler is still loading... Please wait.');
      return;
    }

    setIsLoading(true);
    setOutput('🔄 Running your Tanglish code...\n\n');

    try {
      const pyodide = window.pyodide;
      
      // Clear previous output
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      // Execute the Tanglish code
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

    // Define Tanglish language tokens
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

    // Set the language for the editor
    monaco.editor.setModelLanguage(editor.getModel(), 'tanglish');

    // Add keyboard shortcut for run (Ctrl+Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      executeCode();
    });
  };

  // Load example
  const loadExample = (example) => {
    setCode(example.code);
    setShowExamples(false);
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setOutput('📋 Code copied to clipboard!');
    setTimeout(() => setOutput(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F0] via-yellow-50 to-[#F5F5F0]">
      {/* Header */}
      <header className="bg-gradient-to-r from-temple-yellow to-yellow-400 shadow-lg border-b-4 border-temple-maroon">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-temple-maroon rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">த</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-tamil-brown">Tanglish Compiler</h1>
                <p className="text-sm text-tamil-brown/70">Write Tamil thoughts, run in browser</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="px-4 py-2 bg-temple-maroon text-white rounded-lg hover:bg-red-900 transition-colors flex items-center space-x-2"
              >
                <AcademicCapIcon className="w-5 h-5" />
                <span>Examples</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Examples Dropdown */}
      {showExamples && (
        <div className="absolute right-4 top-20 bg-white rounded-lg shadow-xl border-2 border-temple-yellow z-10 w-64">
          <div className="p-4">
            <h3 className="font-semibold text-tamil-brown mb-3">Example Programs</h3>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-yellow-50 transition-colors text-sm"
                >
                  <div className="font-medium text-tamil-brown">{example.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Code Editor */}
          <div className="flex flex-col">
            <div className="bg-white rounded-t-lg border-2 border-tamil-brown px-4 py-2 flex justify-between items-center">
              <h2 className="font-semibold text-tamil-brown flex items-center space-x-2">
                <span>📝</span>
                <span>Tanglish Code Editor</span>
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={copyCode}
                  className="px-3 py-1 bg-gray-100 text-tamil-brown rounded hover:bg-gray-200 transition-colors flex items-center space-x-1"
                  title="Copy code"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 border-2 border-tamil-brown border-t-0 rounded-b-lg overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="tanglish"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  cursorBlinking: 'blink',
                  cursorSmoothCaretAnimation: 'on',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="bg-white rounded-t-lg border-2 border-tamil-brown px-4 py-2 flex justify-between items-center">
              <h2 className="font-semibold text-tamil-brown flex items-center space-x-2">
                <span>🖥️</span>
                <span>Output Console</span>
              </h2>
              <button
                onClick={executeCode}
                disabled={isLoading || !pyodideReady}
                className={`px-4 py-1 rounded-lg transition-all flex items-center space-x-2 ${
                  isLoading || !pyodideReady
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-leaf-green text-white hover:bg-green-600'
                }`}
              >
                <PlayCircleIcon className="w-4 h-4" />
                <span>{isLoading ? 'Running...' : 'Run (Ctrl+Enter)'}</span>
              </button>
            </div>
            <div className="flex-1 border-2 border-tamil-brown border-t-0 rounded-b-lg bg-gray-900 p-4 overflow-auto">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {isLoading && !output ? '🔄 Initializing Tanglish compiler...' : output || '// Output will appear here\n// Press Ctrl+Enter or click Run to execute your code'}
              </pre>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 bg-white rounded-lg border-2 border-tamil-brown px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className={`flex items-center space-x-1 ${pyodideReady ? 'text-green-600' : 'text-yellow-600'}`}>
              <span className={`w-2 h-2 rounded-full ${pyodideReady ? 'bg-green-600' : 'bg-yellow-600 animate-pulse'}`}></span>
              <span>{pyodideReady ? '✅ Tanglish Ready' : '⏳ Loading Tanglish...'}</span>
            </span>
          </div>
          <div className="text-tamil-brown/70">
            Tip: Press Ctrl+Enter to run your code • Use Tamil keywords written in English
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-temple-maroon text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Made with ❤️ in Tamil Nadu • வணக்கம் மீண்டும் சந்திப்போம்</p>
        </div>
      </footer>
    </div>
  );
};

export default TanglishCompiler;
