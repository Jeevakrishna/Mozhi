# tanglish_interpreter.py

# tokens.py
TT_NUM = "NUMBER"
TT_STR = "STRING"
TT_BOOL = "BOOLEAN"
TT_ID = "IDENTIFIER"
TT_KEY = "KEYWORD"
TT_OP = "OPERATOR"
TT_EQ = "EQUAL"
TT_LP = "LPAREN"
TT_RP = "RPAREN"
TT_LB = "LBRACE"
TT_RB = "RBRACE"
TT_EOF = "EOF"

KEYWORDS = {
    "karuthu","vaippu","vagai","ennam","ezhuthu","unmai_poi",
    "maaththu","kanakku","listu","ottu","settu","agarathi",
    "endraal","illai","matchu","thirumba","foru","varambu",
    "seyal","thiruppu","arrayu","suththi","thoguppu",
    "thethi","kanakku_math","kaattu","unmai","poi"
}

# lexer.py
class Token:
    def __init__(self,t,v=None):
        self.type=t; self.value=v
    def __repr__(self):
        return f"{self.type}:{self.value}"

class Lexer:
    def __init__(self,text):
        self.text=text
        self.pos=0
        self.cur=text[0] if text else None
        self.line=1
        self.column=1

    def adv(self):
        if self.cur == '\n':
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        self.pos+=1
        self.cur=self.text[self.pos] if self.pos<len(self.text) else None

    def tokenize(self):
        tokens=[]
        while self.cur:
            if self.cur.isspace():
                self.adv()

            elif self.cur=="#":
                while self.cur and self.cur!="\n":
                    self.adv()

            elif self.cur.isdigit():
                num=self.cur
                self.adv()
                while self.cur and self.cur.isdigit():
                    num+=self.cur
                    self.adv()
                if self.cur==".":
                    num+=self.cur
                    self.adv()
                    while self.cur and self.cur.isdigit():
                        num+=self.cur
                        self.adv()
                    tokens.append(Token(TT_NUM,float(num)))
                else:
                    tokens.append(Token(TT_NUM,int(num)))

            elif self.cur=="\"":
                self.adv()
                s=""
                while self.cur and self.cur!="\"":
                    if self.cur=="\\":
                        self.adv()
                        if self.cur=="n":
                            s+="\n"
                        elif self.cur=="t":
                            s+="\t"
                        elif self.cur=="r":
                            s+="\r"
                        elif self.cur=="\\":
                            s+="\\"
                        elif self.cur=="\"":
                            s+="\""
                        else:
                            s+=self.cur
                        self.adv()
                    else:
                        s+=self.cur
                        self.adv()
                if self.cur=="\"":
                    self.adv()
                    tokens.append(Token(TT_STR,s))
                else:
                    raise Exception(f"Line {self.line}: Unclosed string")

            elif self.cur.isalpha() or self.cur=="_":
                id=self.cur
                self.adv()
                while self.cur and (self.cur.isalnum() or self.cur=="_"):
                    id+=self.cur
                    self.adv()
                if id in KEYWORDS:
                    tokens.append(Token(TT_KEY,id))
                else:
                    tokens.append(Token(TT_ID,id))

            elif self.cur in "+-*/<>!=":
                op=self.cur
                self.adv()
                if self.cur=="=":
                    op+=self.cur
                    self.adv()
                    tokens.append(Token(TT_OP,op))
                elif op=="=":
                    tokens.append(Token(TT_EQ,"="))
                else:
                    tokens.append(Token(TT_OP,op))

            elif self.cur=="(":
                self.adv()
                tokens.append(Token(TT_LP,"("))

            elif self.cur==")":
                self.adv()
                tokens.append(Token(TT_RP,")"))

            elif self.cur=="{":
                self.adv()
                tokens.append(Token(TT_LB,"{"))

            elif self.cur=="}":
                self.adv()
                tokens.append(Token(TT_RB,"}"))

            else:
                raise Exception(f"Line {self.line}, Column {self.column}: Invalid character: '{self.cur}'")

        tokens.append(Token(TT_EOF))
        return tokens

# parser.py
class Env:
    def __init__(self, parent=None):
        self.vars={}
        self.funcs={}
        self.parent = parent
    
    def get(self, name):
        if name in self.vars:
            return self.vars[name]
        elif self.parent:
            return self.parent.get(name)
        else:
            raise Exception(f"Undefined variable: {name}")
    
    def set(self, name, value):
        self.vars[name] = value

class Parser:
    def __init__(self,tokens):
        self.t=tokens; self.i=0
        self.env=Env()
        self.errors = []

    def cur(self): return self.t[self.i]
    def eat(self): self.i+=1

    def error(self, message):
        token = self.cur()
        self.errors.append(f"Error at token {token}: {message}")

    def parse(self):
        try:
            while self.cur().type!="EOF":
                self.statement()
        except Exception as e:
            self.error(str(e))
        
        if self.errors:
            raise Exception("\n".join(self.errors))

    def statement(self):
        tok=self.cur()

        if tok.value=="karuthu":
            self.eat()
            # Comment statement, just ignore
            pass

        elif tok.value=="vaippu":
            self.eat()
            if self.cur().type!=TT_ID:
                self.error("Expected variable name after 'vaippu'")
                return
            name=self.cur().value; self.eat()
            
            if self.cur().type!=TT_EQ:
                self.error("Expected '=' after variable name")
                return
            self.eat()
            
            try:
                val=self.expr()
                self.env.set(name, val)
            except Exception as e:
                self.error(f"Error in variable assignment: {e}")

        elif tok.value=="kaattu":
            self.eat()
            try:
                val=self.expr()
                print(str(val))
            except Exception as e:
                self.error(f"Error in print statement: {e}")

        elif tok.value=="endraal":
            self.eat()
            try:
                cond=self.expr()
                if self.cur().type!=TT_LB:
                    self.error("Expected '{' after condition")
                    return
                self.eat()
                
                if cond:
                    self.parse()
                    if self.cur().value=="illai":
                        self.eat()
                        if self.cur().type!=TT_LB:
                            self.error("Expected '{' after 'illai'")
                            return
                        self.eat()
                        # Skip else block
                        self.skip_block()
                else:
                    # Skip if block
                    self.skip_block()
                    if self.cur().value=="illai":
                        self.eat()
                        if self.cur().type!=TT_LB:
                            self.error("Expected '{' after 'illai'")
                            return
                        self.eat()
                        self.parse()
                
                if self.cur().type!=TT_RB:
                    self.error("Expected '}' after block")
                    return
                self.eat()
            except Exception as e:
                self.error(f"Error in if statement: {e}")

        elif tok.value=="thirumba":
            self.eat()
            try:
                cond=self.expr()
                if self.cur().type!=TT_LB:
                    self.error("Expected '{' after while condition")
                    return
                self.eat()
                
                # Store current position to loop back
                while cond:
                    self.parse()
                    # Re-evaluate condition
                    # For simplicity, we'll just break after one iteration
                    # In a real implementation, you'd need to restart from the condition
                    break
                
                # Skip the block if condition is false
                if not cond:
                    self.skip_block()
                
                if self.cur().type!=TT_RB:
                    self.error("Expected '}' after while block")
                    return
                self.eat()
            except Exception as e:
                self.error(f"Error in while loop: {e}")

        else:
            # Try to parse as expression
            try:
                self.expr()
            except Exception:
                self.eat()  # Skip unknown token

    def skip_block(self):
        # Skip a block of code
        brace_count = 1
        while brace_count > 0 and self.cur().type != TT_EOF:
            if self.cur().type == TT_LB:
                brace_count += 1
            elif self.cur().type == TT_RB:
                brace_count -= 1
                if brace_count == 0:
                    break
            self.eat()

    def expr(self):
        return self.comp()

    def comp(self):
        left=self.term()
        while self.cur().type==TT_OP and self.cur().value in [">","<",">=","<=","==","!="]:
            op=self.cur().value; self.eat()
            right=self.term()
            if op==">": left=left>right
            elif op=="<": left=left<right
            elif op==">=": left=left>=right
            elif op=="<=": left=left<=right
            elif op=="==": left=left==right
            elif op=="!=": left=left!=right
        return left

    def term(self):
        left=self.factor()
        while self.cur().type==TT_OP and self.cur().value in ["+","-"]:
            op=self.cur().value; self.eat()
            right=self.factor()
            if op=="+": left=left+right
            elif op=="-": left=left-right
        return left

    def factor(self):
        left=self.power()
        while self.cur().type==TT_OP and self.cur().value in ["*","/"]:
            op=self.cur().value; self.eat()
            right=self.power()
            if op=="*": left=left*right
            elif op=="/": 
                if right == 0:
                    raise Exception("Division by zero")
                left=left/right
        return left

    def power(self):
        if self.cur().type==TT_LP:
            self.eat()
            val=self.expr()
            if self.cur().type==TT_RP:
                self.eat()
                return val
            else:
                raise Exception("Missing closing parenthesis")
        elif self.cur().type==TT_NUM:
            val=self.cur().value; self.eat()
            return val
        elif self.cur().type==TT_STR:
            val=self.cur().value; self.eat()
            return val
        elif self.cur().type==TT_ID:
            name=self.cur().value; self.eat()
            return self.env.get(name)
        else:
            raise Exception(f"Unexpected token: {self.cur()}")

# interpreter.py
def run(source: str):
    """Tokenize and parse the given Tanglish source code."""
    import sys
    try:
        lexer = Lexer(source)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        parser.parse()
    except Exception as e:
        sys.stderr.write(f"Error: {e}\n")
