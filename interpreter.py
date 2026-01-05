# interpreter.py
from lexer import Lexer
from parser import Parser


def run(source: str):
    """Tokenize and parse the given Tanglish source code."""
    lexer = Lexer(source)
    tokens = lexer.tokenize()
    parser = Parser(tokens)
    parser.parse()
