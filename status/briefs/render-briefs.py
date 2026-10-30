"""Render every brief in status/briefs/*.md to a readable .html page beside it.

Run from anywhere: python -I status/briefs/render-briefs.py
Handles the subset the briefs use: headings, paragraphs, bullet and numbered lists
(one nesting level), fenced code, inline code, bold and links.
"""
import html
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent

PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>
:root {{ --bg:#090B12; --surf:#12151E; --line:#262B38; --text:#F8F9FB; --muted:#A9ADBA; --accent:#8C85FF; }}
body {{ margin:0; background:var(--bg); color:var(--text); font:15px/1.6 Inter, system-ui, sans-serif; }}
main {{ max-width:900px; margin:0 auto; padding:24px 16px 56px; }}
a {{ color:var(--accent); word-break:break-word; }}
h1 {{ font-size:24px; }} h2 {{ font-size:19px; margin-top:28px; border-top:1px solid var(--line); padding-top:18px; }} h3 {{ font-size:16px; }}
code {{ background:var(--surf); padding:1px 5px; border-radius:4px; font-size:13px; }}
pre {{ background:var(--surf); border:1px solid var(--line); padding:12px; border-radius:8px; overflow-x:auto; }}
pre code {{ padding:0; background:none; }}
li {{ margin:4px 0; }}
.top {{ color:var(--muted); font-size:13px; }}
</style></head>
<body><main><p class="top"><a href="./">&larr; All briefs</a> &middot; <a href="../#platform">Board</a> &middot; source: <a href="{md}">{md}</a></p>
{body}
</main></body></html>
"""


def inline(text: str) -> str:
    out = html.escape(text, quote=False)
    out = re.sub(r"`([^`]+)`", r"<code>\1</code>", out)
    out = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", out)
    out = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2">\1</a>', out)
    out = re.sub(r'(?<![">])(https?://[^\s<)]+)', r'<a href="\1">\1</a>', out)
    return out


def render(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    para: list[str] = []
    lists: list[str] = []
    in_code = False

    def flush_para() -> None:
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para.clear()

    def close_lists(depth: int = 0) -> None:
        while len(lists) > depth:
            out.append("</li></" + lists.pop() + ">")

    for raw in lines:
        if raw.strip().startswith("```"):
            flush_para()
            close_lists()
            out.append("</code></pre>" if in_code else "<pre><code>")
            in_code = not in_code
            continue
        if in_code:
            out.append(html.escape(raw))
            continue
        m = re.match(r"^(#{1,4})\s+(.*)$", raw)
        if m:
            flush_para()
            close_lists()
            level = len(m.group(1))
            out.append(f"<h{level}>{inline(m.group(2))}</h{level}>")
            continue
        m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", raw)
        if m:
            flush_para()
            depth = 1 if len(m.group(1)) < 2 else 2
            kind = "ol" if m.group(2)[0].isdigit() else "ul"
            if len(lists) < depth:
                lists.append(kind)
                out.append(f"<{kind}><li>")
            else:
                close_lists(depth)
                out.append("</li><li>")
            out.append(inline(m.group(3)))
            continue
        if not raw.strip():
            flush_para()
            close_lists()
            continue
        if lists:
            out.append(" " + inline(raw.strip()))
        else:
            para.append(raw.strip())
    flush_para()
    close_lists()
    return "\n".join(out)


for md_path in sorted(HERE.glob("*.md")):
    md = md_path.read_text(encoding="utf-8")
    title_match = re.search(r"^#\s+(.*)$", md, re.M)
    title = title_match.group(1) if title_match else md_path.stem
    page = PAGE.format(title=html.escape(title), md=md_path.name, body=render(md))
    md_path.with_suffix(".html").write_text(page, encoding="utf-8", newline="\n")
    print("rendered", md_path.with_suffix(".html").name)
