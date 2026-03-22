// --- 1. Grab our UI Elements ---
const input = document.getElementById('topic-input');
const btn = document.getElementById('search-btn');
const status = document.getElementById('status');
const graphContainer = document.getElementById('graph-container');
const panel = document.getElementById('details-panel');
const closePanel = document.getElementById('close-panel');
const panelTitle = document.getElementById('panel-title');
const panelDesc = document.getElementById('panel-desc');
const panelMath = document.getElementById('panel-math');

// New UI Elements for V2
const nodeSlider = document.getElementById('node-slider');
const nodeLabel = document.getElementById('node-label');
const panelBullets = document.getElementById('panel-bullets');

let Graph = null; // This will hold our physics engine instance

// --- 2. The Event Listeners ---
// Update the label when slider moves
nodeSlider.addEventListener('input', (e) => {
    nodeLabel.textContent = `Nodes: ${e.target.value}`;
});

btn.addEventListener('click', fetchAndDrawGraph);

// Allow pressing "Enter" to search
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchAndDrawGraph();
    }
});

// Close the details panel
closePanel.addEventListener('click', () => {
    panel.classList.add('hidden');
});

// --- 3. The Brain Fetcher ---
async function fetchAndDrawGraph() {
    const topic = input.value.trim();
    if (!topic) return;

    // Show loading state
    status.textContent = "🧠 Synthesizing knowledge...";
    btn.disabled = true;
    btn.style.opacity = "0.5";

    try {
        // HIT OUR FASTAPI BACKEND WITH THE SLIDER VALUE
        const nodes = nodeSlider.value;
        const response = await fetch(`/api/graph?topic=${encodeURIComponent(topic)}&nodes=${nodes}`);
        
        if (!response.ok) throw new Error("Backend failed to respond.");
        
        const data = await response.json();
        
        // Clear loading state
        status.textContent = "";
        
        // Draw the visualizer!
        renderGraph(data);

    } catch (error) {
        console.error("Graph Error:", error);
        status.textContent = "❌ Failed to map topic. Check the server console.";
    } finally {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

// --- 4. The Visual Physics Engine (Hackathon Edition) ---
function renderGraph(data) {
    if (Graph) {
        Graph._destructor();
        graphContainer.innerHTML = ''; 
    }

    let hoverNode = null; // Track what we are hovering over for the glow effect

    Graph = ForceGraph()(graphContainer)
        .graphData(data)
        .backgroundColor('#0d0d0d')
        
        // --- Link Aesthetics: Electric Pulses ---
        .linkColor(() => 'rgba(189, 89, 255, 0.4)') // Faint carmine red links
        .linkDirectionalParticles(4)                 // More particles
        .linkDirectionalParticleWidth(2.5)           // Thicker particles
        .linkDirectionalParticleSpeed(0.006)         // Faster pulse
        .linkDirectionalParticleColor(() => '#fff49e') // Blue electricity
        
        // --- Custom Canvas Rendering for Nodes (The Wow Factor) ---
        .nodeCanvasObject((node, ctx, globalScale) => {
            // 1. Setup the text size based on zoom level
            const label = node.id;
            const isMain = node.group === 1;
            const fontSize = isMain ? 16 / globalScale : 12 / globalScale;
            ctx.font = `${fontSize}px -apple-system, sans-serif`;
            
            // 2. Draw the Node Circle
            const nodeRadius = isMain ? 8 : 5;
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
            
            // If hovered, make it glow white. Otherwise, use our theme colors.
            ctx.fillStyle = node === hoverNode ? '#ffffff' : (isMain ? '#ff8b8b' : '#1f2937');
            
            // Add a subtle glow effect
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = node === hoverNode ? 15 : 5;
            ctx.fill();
            
            // Reset shadow so it doesn't blur the text
            ctx.shadowBlur = 0; 

            // 3. Draw the Text Label below the node
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = node === hoverNode ? '#ffffff' : '#9ca3af'; // Brighten text on hover
            ctx.fillText(label, node.x, node.y + nodeRadius + (4 / globalScale));
        })
        
        // --- Interactivity ---
        .onNodeHover(node => {
            // Change the cursor to a pointer and trigger the glow redraw
            graphContainer.style.cursor = node ? 'pointer' : null;
            hoverNode = node || null;
        })
        
        .onNodeClick(node => {
            panelTitle.textContent = node.id;
            panelDesc.textContent = node.description;
            
            // RENDER BULLET POINTS
            if (node.bullets && node.bullets.length > 0) {
                let bulletHtml = '<ul style="margin-top: 10px; padding-left: 20px;">';
                node.bullets.forEach(b => bulletHtml += `<li style="margin-bottom: 6px;">${b}</li>`);
                bulletHtml += '</ul>';
                panelBullets.innerHTML = bulletHtml;
                panelBullets.style.display = 'block';
            } else {
                panelBullets.style.display = 'none';
            }
            
            // RENDER MATH (If it exists and isn't N/A)
            try {
                if (node.formula && node.formula !== "N/A" && node.formula.trim() !== "") {
                    katex.render(node.formula, panelMath, {
                        displayMode: true,
                        throwOnError: false
                    });
                    panelMath.style.display = 'block';
                } else {
                    panelMath.style.display = 'none';
                }
            } catch (e) {
                console.error("Math render error", e);
                panelMath.textContent = node.formula;
                panelMath.style.display = 'block';
            }

            panel.classList.remove('hidden');
            
            // Dynamic Camera: Zoom in smoothly on the clicked concept
            Graph.centerAt(node.x, node.y, 800);
            Graph.zoom(3, 1000);
        });

    // --- Physics Tweak: Increase repulsion so the larger web spreads out ---
    Graph.d3Force('charge').strength(-400);
}