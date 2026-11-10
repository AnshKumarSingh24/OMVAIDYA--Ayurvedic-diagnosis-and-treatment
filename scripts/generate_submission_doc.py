"""
Script to generate a print-ready, professional HTML version of the Phase 1 Proposal
that can be viewed, shared, or printed directly to PDF (via browser Print -> Save as PDF).
"""

import os
from markdown_it import MarkdownIt

def build_submission_html():
    proposal_path = os.path.join(os.path.dirname(__file__), "..", "docs", "PHASE_1_PROPOSAL.md")
    output_html_path = os.path.join(os.path.dirname(__file__), "..", "docs", "AyurSetu_Phase1_Proposal.html")

    with open(proposal_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    md = MarkdownIt("commonmark", {"breaks": True, "html": True})
    rendered_body = md.render(md_text)

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AyurSetu: Phase 1 Technical & Clinical Proposal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Martel:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {{
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #1c1917;
      line-height: 1.65;
    }}
    .font-sanskrit {{
      font-family: 'Martel', serif;
    }}
    h1, h2, h3, h4 {{
      font-weight: 700;
      color: #0c0a09;
    }}
    h1 {{ font-size: 1.85rem; border-bottom: 2px solid #059669; padding-bottom: 0.5rem; margin-top: 1.5rem; }}
    h2 {{ font-size: 1.4rem; border-bottom: 1px solid #e7e5e4; padding-bottom: 0.35rem; margin-top: 2rem; margin-bottom: 0.75rem; color: #065f46; }}
    h3 {{ font-size: 1.15rem; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #1f2937; }}
    table {{ width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.875rem; }}
    th, td {{ border: 1px solid #d6d3d1; padding: 8px 12px; text-align: left; }}
    th {{ background-color: #f5f5f4; font-weight: 600; color: #292524; }}
    tr:nth-child(even) {{ background-color: #fafaf9; }}
    code {{ background-color: #f5f5f4; padding: 2px 5px; border-radius: 4px; font-size: 0.85em; font-family: monospace; }}
    pre code {{ display: block; padding: 12px; overflow-x: auto; background-color: #1c1917; color: #f5f5f4; border-radius: 8px; }}
    blockquote {{ border-left: 4px solid #059669; padding-left: 1rem; color: #57534e; margin: 1rem 0; font-style: italic; }}
    @media print {{
      body {{ font-size: 11pt; }}
      .no-print {{ display: none !important; }}
      a {{ text-decoration: none; color: inherit; }}
      pre code {{ white-space: pre-wrap; }}
    }}
  </style>
</head>
<body class="bg-stone-50 py-10">

  <!-- Print Button Bar (Hidden in Print) -->
  <div class="no-print max-w-4xl mx-auto mb-6 px-6 flex justify-between items-center">
    <div class="text-xs text-stone-500">
      <strong>Techfest 2026–27</strong> &bull; Ministry of Ayush &bull; AIIA Challenge Submission
    </div>
    <button onclick="window.print()" class="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
      Print / Save as PDF
    </button>
  </div>

  <!-- Document Container -->
  <article class="max-w-4xl mx-auto bg-white border border-stone-200 rounded-2xl shadow-sm p-8 sm:p-14">
    {rendered_body}
  </article>

</body>
</html>
"""

    with open(output_html_path, "w", encoding="utf-8") as f:
        f.write(full_html)

    print(f"Submission document generated successfully: {output_html_path}")

if __name__ == "__main__":
    build_submission_html()
