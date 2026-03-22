import os
import json
from groq import Groq
from dotenv import load_dotenv

# Import the NEW function, not the old string
from backend.prompts import get_graph_maker_prompt

# Load the API key from .env
load_dotenv()

# Initialize the Brain
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Use the current 70B model
MODEL_NAME = "llama-3.3-70b-versatile" 

def generate_graph_data(topic: str, node_count: int) -> dict:
    """
    Forces the LLM to generate a strict JSON graph structure for the given topic.
    """
    user_prompt = f"Generate the knowledge graph JSON for the topic: {topic}"

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": get_graph_maker_prompt(node_count)}, 
                {"role": "user", "content": user_prompt}
            ],
            model=MODEL_NAME,
            temperature=0.2, 
            response_format={"type": "json_object"} 
        )
        
        raw_output = response.choices[0].message.content
        return json.loads(raw_output)

    except Exception as e:
        print(f"Brain Error: {e}")
        return {"nodes": [{"id": "Error", "group": 1, "description": "API Limit or Failure", "bullets": [], "formula": "N/A"}], "links": []}