// Reset button logic
document.getElementById("reset-btn").addEventListener("click", () => {
    // Reset all input values to zero
    document.getElementById("velocity").value = 0;
    document.getElementById("angle").value = 0;
    document.getElementById("drag").value = 0;
    document.getElementById("dt").value = 0;
    document.getElementById("wind").value = 0;

    // Clear warnings
    document.getElementById("velocity-warning").textContent = "";
    document.getElementById("angle-warning").textContent = "";
    document.getElementById("drag-warning").textContent = "";
    document.getElementById("dt-warning").textContent = "";
    document.getElementById("wind-warning").textContent = "";

    // Clear plot
    Plotly.purge('plot');

    // Clear wind display
    document.getElementById("wind-display").innerHTML = "";

    // Clear table
    const tbody = document.querySelector("#trajectory-table tbody");
    tbody.innerHTML = "";

    // Hide export buttons
    document.getElementById("save-plot-btn").style.display = "none";
    document.getElementById("save-data-btn").style.display = "none";
});
document.getElementById("simulate-btn").addEventListener("click", () => {
    // Clear previous warnings
    document.getElementById("velocity-warning").textContent = "";
    document.getElementById("angle-warning").textContent = "";
    document.getElementById("drag-warning").textContent = "";
    document.getElementById("dt-warning").textContent = "";
    document.getElementById("wind-warning").textContent = "";

    const velocity = parseFloat(document.getElementById("velocity").value);
    const angle = parseFloat(document.getElementById("angle").value);
    const drag = parseFloat(document.getElementById("drag").value);
    const dt = parseFloat(document.getElementById("dt").value);
    const wind = parseFloat(document.getElementById("wind").value);

    let valid = true;
    if (isNaN(velocity) || velocity <= 0) { document.getElementById("velocity-warning").textContent = "Velocity must be > 0"; valid = false; }
    if (isNaN(angle) || angle <= 0 || angle >= 90) { document.getElementById("angle-warning").textContent = "Angle must be 0-90°"; valid = false; }
    if (isNaN(drag) || drag < 0 || drag > 1) { document.getElementById("drag-warning").textContent = "Drag must be 0-1"; valid = false; }
    if (isNaN(dt) || dt <= 0 || dt > 1) { document.getElementById("dt-warning").textContent = "dt must be 0.001-1"; valid = false; }
    if (isNaN(wind) || wind < -20 || wind > 20) { document.getElementById("wind-warning").textContent = "Wind must be between -20 and 20 m/s"; valid = false; }
    if (!valid) return; 

    // Use relative URL so it works in both local and production
    fetch("/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ velocity, angle, drag, dt, wind })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const trajectory = data.trajectory;
            const x = trajectory.map(p => p.x);
            const y = trajectory.map(p => p.y);

            // Velocity vector ke arrows
            const arrowScale = 0.5;
            const arrowX = [], arrowY = [], arrowU = [], arrowV = [];
            trajectory.forEach((p, i) => {
                if (i % 5 === 0) {
                    arrowX.push(p.x);
                    arrowY.push(p.y);
                    arrowU.push(p.vx * arrowScale);
                    arrowV.push(p.vy * arrowScale);
                }
            });

            // trajectory path aur height ka gradient h ye
            const tracePath = {
                x, y, 
                mode: 'lines+markers',
                type: 'scatter',
                line: { color: '#DDA94B', width: 2 },
                marker: {
                    size: 6,
                    color: y,
                    colorscale: 'Jet',
                    cmin: Math.min(...y),
                    cmax: Math.max(...y),
                    colorbar: {title: 'Height (m)'}
                },
                name: "Trajectory"
            };

            const traceArrows = {
                type: 'scatter', x: [], y: [], mode: 'lines',
                line: { color: '#FF6B6B', width: 2 }, showlegend: false
            };

            for (let i = 0; i < arrowX.length; i++) {
                traceArrows.x.push(arrowX[i], arrowX[i] + arrowU[i], null);
                traceArrows.y.push(arrowY[i], arrowY[i] + arrowV[i], null);
            }

            // Add wind arrow/indicator
            const windArrow = {
                type: 'scatter',
                x: [0, wind * 2],
                y: [Math.max(...y) + 2, Math.max(...y) + 2],
                mode: 'lines+markers',
                line: { color: wind >= 0 ? 'lightgreen' : 'tomato', width: 3 },
                name: 'Wind'
            };

            Plotly.newPlot('plot', [tracePath, traceArrows, windArrow], {
                title: 'Projectile Trajectory',
                xaxis: { title: 'X (m)' },
                yaxis: { title: 'Y (m)' },
                plot_bgcolor: '#1E4174',
                paper_bgcolor: '#1E4174',
                font: { color: '#DDA94B' },
                showlegend: false
            });

            //buttons ka code 
            document.getElementById("save-plot-btn").style.display = "inline-block";
            document.getElementById("save-data-btn").style.display = "inline-block";

            const tbody = document.querySelector("#trajectory-table tbody");
            tbody.innerHTML = "";
            trajectory.forEach(p => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${p.t.toFixed(2)}</td><td>${p.x.toFixed(2)}</td><td>${p.y.toFixed(2)}</td>`;
                tbody.appendChild(row);
            });

            // table ki sorting
            document.querySelectorAll("#trajectory-table th").forEach((header, idx) => {
                let asc = true;
                header.onclick = () => {
                    const rows = Array.from(tbody.querySelectorAll("tr"));
                    rows.sort((a, b) => (asc ? a.children[idx].textContent - b.children[idx].textContent : b.children[idx].textContent - a.children[idx].textContent));
                    rows.forEach(r => tbody.appendChild(r));
                    asc = !asc;
                };
            });

            // Update wind display
            const windDisplay = document.getElementById("wind-display");
            if (wind > 0)
                windDisplay.innerHTML = `<span style="color:lightgreen;">Tailwind: +${wind} m/s</span>`;
            else if (wind < 0)
                windDisplay.innerHTML = `<span style="color:tomato;">Headwind: ${wind} m/s</span>`;
            else
                windDisplay.innerHTML = `<span style="color:gray;">No Wind</span>`;

        } else alert("Simulation failed: " + data.message);
    })
    .catch(err => alert("Error connecting to backend: " + err));

    document.getElementById("last-updated").textContent = new Date().toLocaleDateString();
});

// Save Plot as PNG
document.getElementById("save-plot-btn").addEventListener("click", () => {
    const plotDiv = document.getElementById("plot");
    if (plotDiv.data && plotDiv.data.length > 0) {
        Plotly.toImage(plotDiv, { format: 'png', height: 600, width: 900 })
            .then(dataUrl => {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'projectile_trajectory.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    } else {
        alert("No plot to save!");
    }
});

// Save Data as CSV
document.getElementById("save-data-btn").addEventListener("click", () => {
    const rows = Array.from(document.querySelectorAll("#trajectory-table tbody tr"));
    if (rows.length === 0) {
        alert("No data available to save!");
        return;
    }

    let csv = `Wind Speed (m/s),${document.getElementById("wind").value}\n`;
    csv += "Time (s),X (m),Y (m)\n";
    rows.forEach(row => {
        const cols = Array.from(row.children).map(td => td.textContent);
        csv += cols.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trajectory_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
