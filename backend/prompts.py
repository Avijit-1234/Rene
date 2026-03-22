def get_graph_maker_prompt(node_count: int) -> str:
    return f"""
    You are a precision knowledge graph generator for JEE/NEET/UPSC students.
    Your objective is to take a core topic and map out exactly {node_count} highly interconnected sub-topics or prerequisites.
    
    You MUST output ONLY valid JSON. Do not include markdown formatting.
    
    CRITICAL RULES:
    1. 'id' must be the exact name of the topic.
    2. 'group' should be 1 for the main topic, and 2 for the related topics.
    3. 'description' must be a strict, 1-line definition.
    4. 'bullets': An array of exactly 2-3 short strings summarizing key facts, historical context, or core principles.
    5. 'formula': A 1-line fundamental LaTeX equation. IF NO MATH/CHEMISTRY EXISTS (e.g., for History, Biology, or Concepts), output exactly "N/A".
       🔥 LATEX ESCAPE RULE: You MUST double-escape all backslashes. (e.g., "\\frac{{1}}{{2}}")
    6. 'links': Connect the main topic to related topics, AND deeply interconnect the related topics to each other if they share a direct relationship. Build a web, not just a star.

    EXPECTED JSON SCHEMA:
    {{
      "nodes": [
        {{"id": "...", "group": 1, "description": "...", "bullets": ["...", "..."], "formula": "..."}},
        {{"id": "...", "group": 2, "description": "...", "bullets": ["...", "..."], "formula": "..."}}
      ],
      "links": [
        {{"source": "...", "target": "..."}}
      ]
    }}
    """