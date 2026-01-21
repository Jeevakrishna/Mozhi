# Mozhi – A Tanglish Programming Language

## 1. What is Mozhi?
Mozhi is a Tanglish-based programming language inspired by Tamil culture, logic clarity, and simplicity, designed to be:
- Beginner friendly
- Readable in Tanglish (Tamil words in English letters)
- Executed using a Python-based interpreter
- Runnable later in browsers (via WASM / Pyodide)

### Example:
```plaintext
vaippu x = 10
vaippu y = 20
kaattu x + y
```
**Output:**
```plaintext
30
```  

## 2. Language Philosophy (Tamil Roots)
| Tamil Idea | Mozhi Meaning |
|------------|---------------|
| Mozhi      | Language      |
| Kural      | Simple, powerful logic |
| Aram       | Correctness & discipline |
| Sinthanai  | Thinking before execution |

Mozhi syntax favors spoken Tanglish, not pure English keywords.

## 3. Program Structure
A Mozhi program is a sequence of statements:
```plaintext
(statement)
(statement)
(statement)
```
No `main()` required.

## 4. Keywords Reference
Your current keywords (good start):
```plaintext
KEYWORDS = { "karuthu","vaippu","vagai","ennam","ezhuthu","unmai_poi",
"maaththu","kanakku","listu","ottu","settu","agarathi",
"endraal","illai","matchu","thirumba","foru","varambu",
"seyal","thiruppu","arrayu","suththi","thoguppu",
"thethi","kanakku_math","kaattu","unmai","poi" }
```  

 Important observation: Many keywords exist but are not implemented yet (seyal, thiruppu, foru, listu, etc.). That’s okay — languages grow incrementally.

## 5. Comments (karuthu)
### Syntax
```plaintext
karuthu This is a comment
```
### Behavior
Ignored by interpreter.

## 6. Variables (vaippu)
### Syntax
```plaintext
vaippu name = expression
```
### Examples
```plaintext
vaippu age = 21
vaippu price = 99.5
vaippu name = "Jeevakrishna"
```

## 7. Data Types (Current)
| Type     | Example     |
|----------|-------------|
| Integer  | 10          |
| Float    | 10.5        |
| String   | "Vanakkam" |
| Boolean  | unmai, poi (planned) |

 Note: unmai / poi are in keywords but not wired yet.

## 8. Print Statement (kaattu)
### Syntax
```plaintext
kaattu expression
```
### Examples
```plaintext
kaattu "Vanakkam Tamil"
kaattu 5 + 3
```
**Output:**
```plaintext
Vanakkam Tamil
8
```

## 9. Operators
### Arithmetic Operators
| Operator | Meaning      |
|----------|--------------|
| +        | Addition     |
| -        | Subtraction  |
| *        | Multiplication|
| /        | Division     |

### Example:
```plaintext
kaattu (10 + 5) * 2
```

### Comparison Operators
| Operator | Meaning         |
|----------|-----------------|
| >        | Greater         |
| <        | Less            |
| >=       | Greater or equal|
| <=       | Less or equal   |
| ==       | Equal           |
| !=       | Not equal       |

### Example:
```plaintext
kaattu 10 > 5
```
**Output:**
```plaintext
True
```

## 10. Conditional Statements (endraal, illai)
### Syntax
```plaintext
endraal condition {
   statements
}
illai {
   statements
}
```
### Example
```plaintext
vaippu age = 17

endraal age >= 18 {
    kaattu "Vote panna mudiyum"
}
illai {
    kaattu "Innum valaranum"
}
```

## 11. Loops (thirumba) – While Loop (Limited)
### Syntax
```plaintext
thirumba condition {
   statements
}
```

Important limitation: Your loop currently runs only once (hardcoded break). This must be fixed for real looping.

### Example (current behavior):
```plaintext
vaippu x = 5
thirumba x > 0 {
   kaattu x
}
```

## 12. Expressions
Mozhi supports nested expressions:
```plaintext
kaattu (5 + 3) * (10 - 2)
```

## 13. What’s Missing (Honest Review)
You do NOT yet have:
-  Functions
-  Return values
-  Boolean literals wired
-  Lists / arrays
-  Proper loops
-  Scope per block
-  Error recovery per line

But that’s normal at this stage.

## 14. Adding Functions (seyal, thiruppu) – Design
### Planned Syntax
```plaintext
seyal add(a, b) {
   thiruppu a + b
}

kaattu add(10, 20)
```

### Needed Changes (High-level)
- Tokenize commas ,
- Parser:
  - Store functions in env.funcs
  - Call stack
  - New AST nodes (recommended)

## 15. Example: Full Mozhi Program
```plaintext
karuthu Simple Mozhi program

vaippu x = 10
vaippu y = 20

endraal x < y {
   kaattu "x is smaller"
}
illai {
   kaattu "x is bigger"
}

kaattu x + y
```

## 16. Running the Interpreter
### Python
```python
from interpreter import run

source = """
vaippu x = 5
kaattu x * 2
"""
run(source)
```

##7. Website Compilation (Future)
### Architecture
```plaintext
Browser
 └── Monaco Editor
 └── Mozhi Code
 └── Pyodide (Python WASM)
 └── Your Interpreter
 └── Output Console
```

You do not compile to JS yet — you interpret in Python-in-browser.

## 18. Open Source Plan
### Recommended:
- GitHub repo name: mozhi-lang
- License: MIT

### Repo structure:
```plaintext
mozhi-lang/
 ├── lexer.py
 ├── parser.py
 ├── interpreter.py
 ├── docs/
 ├── examples/
 └── README.md
```

## 19. Final Honest Assessment
- ✔ This is a real interpreter foundation
- ✔ Syntax is culturally unique
- ✔ Parser logic is understandable
- ⚠ Needs AST refactor for scaling
- ⚠ Loops & functions must be fixed before public release

You are not wasting time — you are building a language the right way.
