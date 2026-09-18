# Prexis

Interactive lesson player. Offline library first. Studio AI is optional.

Repo: https://github.com/matpcul-tech/prexis

## Grok Build

```bash
git clone https://github.com/matpcul-tech/prexis.git
cd prexis
grok
```

Then ask Grok Build:

```
Run ./bootstrap.sh, then serve with python3 -m http.server 8765.
Do not replace authored lessons with generated filler. See AGENTS.md.
```

## Local

```bash
chmod +x bootstrap.sh && ./bootstrap.sh
python3 -m http.server 8765
```

Open http://localhost:8765/
