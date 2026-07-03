import os, re
base = os.path.join(os.path.expanduser("~"), r"Desktop\lithos-hero")
p = os.path.join(base, "src", "components", "PortfolioScene.tsx")
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

# Insert BASE constant after the NatureBackground import
c = c.replace(
    "import NatureBackground from ",
    'const BASE = import.meta.env.BASE_URL;\n\nimport NatureBackground from '
)

# Replace all "/portfolio/ paths with BASE + "portfolio/
c = c.replace('"/portfolio/', 'BASE + "portfolio/')

with open(p, "w", encoding="utf-8", newline="\n") as f:
    f.write(c)
print("3/3 PortfolioScene.tsx OK")