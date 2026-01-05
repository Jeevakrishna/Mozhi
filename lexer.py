# lexer.py
from tokens import *

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

    def adv(self):
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
                n=""
                while self.cur and self.cur.isdigit():
                    n+=self.cur; self.adv()
                tokens.append(Token(TT_NUM,int(n)))

            elif self.cur.isalpha() or self.cur=="_":
                w=""
                while self.cur and (self.cur.isalnum() or self.cur=="_"):
                    w+=self.cur; self.adv()
                if w in KEYWORDS:
                    tokens.append(Token(TT_KEY,w))
                elif w=="unmai":
                    tokens.append(Token(TT_BOOL,True))
                elif w=="poi":
                    tokens.append(Token(TT_BOOL,False))
                else:
                    tokens.append(Token(TT_ID,w))

            elif self.cur=='"':
                self.adv(); s=""
                while self.cur!='"':
                    s+=self.cur; self.adv()
                self.adv()
                tokens.append(Token(TT_STR,s))

            elif self.cur in "+-*/%><":
                tokens.append(Token(TT_OP,self.cur)); self.adv()

            elif self.cur=="=":
                self.adv()
                tokens.append(Token(TT_EQ,"="))

            elif self.cur=="{":
                tokens.append(Token(TT_LB)); self.adv()
            elif self.cur=="}":
                tokens.append(Token(TT_RB)); self.adv()
            elif self.cur=="(":
                tokens.append(Token(TT_LP)); self.adv()
            elif self.cur==")":
                tokens.append(Token(TT_RP)); self.adv()
            else:
                raise Exception("Invalid char "+self.cur)

        tokens.append(Token(TT_EOF))
        return tokens
