# parser.py
class Env:
    def __init__(self):
        self.vars={}
        self.funcs={}

class Parser:
    def __init__(self,tokens):
        self.t=tokens; self.i=0
        self.env=Env()

    def cur(self): return self.t[self.i]
    def eat(self): self.i+=1

    def parse(self):
        while self.cur().type!="EOF":
            self.statement()

    def statement(self):
        tok=self.cur()

        if tok.value=="vaippu":
            self.eat()
            name=self.cur().value; self.eat()
            self.eat()
            val=self.expr()
            self.env.vars[name]=val

        elif tok.value=="kaattu":
            self.eat()
            print(self.expr())

        else:
            self.eat()

    def expr(self):
        tok=self.cur()
        if tok.type=="NUMBER":
            self.eat(); return tok.value
        if tok.type=="STRING":
            self.eat(); return tok.value
        if tok.type=="BOOLEAN":
            self.eat(); return tok.value
        if tok.type=="IDENTIFIER":
            self.eat()
            return self.env.vars.get(tok.value)
        raise Exception("Invalid expression")
