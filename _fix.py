import os
base = os.path.join(os.path.expanduser("~"), r"Desktop\lithos-hero")

# 1. vite.config.ts
p = os.path.join(base, "vite.config.ts")
with open(p, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace("build: { outDir:", 'base: "/songyu-portfolio/",\n  build: { outDir:')
with open(p, "w", encoding="utf-8", newline="\n") as f:
    f.write(c)
print("1/3 vite.config.ts OK")