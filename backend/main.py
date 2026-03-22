from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.llm import generate_graph_data
from backend.database import get_cached_graph, save_graph_to_cache

app = FastAPI(title="Rene Knowledge Graph API")

# Mount the API Route
@app.get("/api/graph")
async def get_graph(topic: str, nodes: int = 10): # Added nodes param
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")
    
    print(f"🔍 Searching for: {topic} with {nodes} nodes")
    
    print("🧠 Generating new graph via Groq...")
    graph_data = generate_graph_data(topic, nodes) # Passed nodes to brain
    
    return graph_data

# Mount the Frontend (Vanilla HTML/CSS/JS)
# This MUST be at the bottom so it doesn't override the /api routes
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")