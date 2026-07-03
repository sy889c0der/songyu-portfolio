import os
base = os.path.join(os.path.expanduser("~"), r"Desktop\lithos-hero")

# 2. Fix index.css - bg-nature
p = os.path.join(base, "src", "index.css")
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

old = ".bg-nature {\n  position: relative;\n  background:\n    radial-gradient(ellipse at 20% 10%, rgba(18,50,16,0.55) 0%, transparent 55%),\n    radial-gradient(ellipse at 80% 90%, rgba(14,38,12,0.5)  0%, transparent 55%),\n    radial-gradient(ellipse at 35% 55%, rgba(8,25,8,0.6)    0%, transparent 50%),\n    radial-gradient(ellipse at 65% 25%, rgba(15,35,14,0.45) 0%, transparent 48%),\n    radial-gradient(ellipse at 50% 50%, rgba(3,10,3,1)      0%, rgba(1,3,1,1) 100%),\n    #010201;\n}"

new = ".bg-nature {\n  position: relative;\n  background:\n    radial-gradient(ellipse at 20% 10%, rgba(18,50,16,0.65) 0%, rgba(10,28,10,0.35) 50%, transparent 85%),\n    radial-gradient(ellipse at 80% 90%, rgba(14,38,12,0.58) 0%, rgba(9,25,8,0.32)  50%, transparent 85%),\n    radial-gradient(ellipse at 35% 55%, rgba(10,30,10,0.6)  0%, rgba(7,20,7,0.35)  50%, transparent 82%),\n    radial-gradient(ellipse at 65% 25%, rgba(15,35,14,0.55) 0%, rgba(9,22,9,0.3)   50%, transparent 82%),\n    radial-gradient(ellipse at 50% 35%, rgba(12,32,12,0.55) 0%, rgba(6,18,6,0.35)  50%, transparent 80%),\n    radial-gradient(ellipse at 5%  50%, rgba(8,22,8,0.45)   0%, transparent 70%),\n    radial-gradient(ellipse at 95% 50%, rgba(8,22,8,0.45)   0%, transparent 70%),\n    radial-gradient(ellipse at 50% 75%, rgba(10,26,10,0.52) 0%, rgba(5,14,3,0.35)  50%, transparent 80%),\n    linear-gradient(180deg, #040c04 0%, #030a03 30%, #040e04 60%, #030b03 100%),\n    #030903;\n}"

if old in c:
    c = c.replace(old, new)
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(c)
    print("2/3 index.css OK")
else:
    print("2/3 WARNING: bg-nature pattern NOT FOUND")
    idx = c.find(".bg-nature")
    if idx >= 0:
        print("  Found at", idx, "chars:", repr(c[idx:idx+200]))