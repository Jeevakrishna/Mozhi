from interpreter import run

print("🪔 Tanglish IDE 🪔")
print("Empty line = Run | exit = Quit")

while True:
    src=""
    while True:
        line=input(">>> ")
        if line=="exit": quit()
        if line.strip()=="":
            break
        src+=line+"\n"
    run(src)
