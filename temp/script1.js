document.getElementById("simulate-btn").addEventListener("click", () => {
    // Clear previous warnings
    document.getElementById("velocity-warning").textContent = "";
    document.getElementById("angle-warning").textContent = "";
    document.getElementById("drag-warning").textContent = "";
    document.getElementById("dt-warning").textContent = "";

    const velocity = parseFloat(document.getElementById("velocity").value);
    const angle = parseFloat(document.getElementById("angle").value);
    const drag = parseFloat(document.getElementById("drag").value);
    const dt = parseFloat(document.getElementById("dt").value);

    let valid = true;

    if (isNaN(velocity) || velocity <= 0) {
        document.getElementById("velocity-warning").textContent = "Velocity must be > 0";
        valid = false;
    }
    if (isNaN(angle) || angle <= 0 || angle >= 90) {
        document.getElementById("angle-warning").textContent = "Angle must be 0-90°";
        valid = false;
    }
    if (isNaN(drag) || drag < 0 || drag > 1) {
        document.getElementById("drag-warning").textContent = "Drag must be 0-1";
        valid = false;
    }
    if (isNaN(dt) || dt <= 0 || dt > 1) {
        document.getElementById("dt-warning").textContent = "dt must be 0.001-1";
        valid = false;
    }

    if (!valid) return; 

    // Send POST request to Flask backend
    fetch("http://127.0.0.1:5000/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ velocity, angle, drag, dt })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const trajectory = data.trajectory;

            // Plot trajectory using Plotly
            const x = trajectory.map(point => point.x);
            const y = trajectory.map(point => point.y);
            const trace = {
                x: x,
                y: y,
                mode: 'lines+markers',
                type: 'scatter',
                marker: { color: '#DDA94B' },
                line: { color: '#DDA94B' }
            };
            const layout = {
                title: 'Projectile Trajectory',
                xaxis: { title: 'X (m)' },
                yaxis: { title: 'Y (m)' },
                plot_bgcolor: '#1E4174',
                paper_bgcolor: '#1E4174',
                font: { color: '#DDA94B' }
            };
            Plotly.newPlot('plot', [trace], layout);

            // Populate trajectory table
            const tbody = document.querySelector("#trajectory-table tbody");
            tbody.innerHTML = "";
            trajectory.forEach(point => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${point.t.toFixed(2)}</td><td>${point.x.toFixed(2)}</td><td>${point.y.toFixed(2)}</td>`;
                tbody.appendChild(row);
            });

            // -------------------------------
            // Add sorting functionality
            // -------------------------------
            function sortTableByColumn(table, columnIndex, asc = true) {
                const rows = Array.from(table.tBodies[0].querySelectorAll("tr"));
                rows.sort((a, b) => {
                    const aText = parseFloat(a.children[columnIndex].textContent);
                    const bText = parseFloat(b.children[columnIndex].textContent);
                    return asc ? aText - bText : bText - aText;
                });
                rows.forEach(row => table.tBodies[0].appendChild(row));
            }

            document.querySelectorAll("#trajectory-table th").forEach((header, index) => {
                let asc = true;
                header.onclick = () => {
                    sortTableByColumn(header.closest("table"), index, asc);
                    asc = !asc;
                };
            });

        } else {
            alert("Simulation failed: " + data.message);
        }
    })
    .catch(err => alert("Error connecting to backend: " + err));

    document.getElementById("last-updated").textContent = new Date().toLocaleDateString();

});

// -------------------------------
// Scroll to "How it works" section
// -------------------------------
document.getElementById("how-it-works-btn").addEventListener("click", function() {
  document.getElementById("how-it-works-section").scrollIntoView({
    behavior: "smooth"
  });
});

// Save Plot button listener
document.getElementById("save-plot-btn").addEventListener("click", () => {
    const plotDiv = document.getElementById("plot");
    if (plotDiv.data && plotDiv.data.length > 0) {
        Plotly.toImage(plotDiv, {format: 'png', height: 500, width: 800})
            .then(function(dataUrl) {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'projectile_trajectory.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    } else {
        alert("No plot available to save!");
    }
});

// Inside your simulate POST response success block
if (data.status === "success") {
    const trajectory = data.trajectory;

    // Plot trajectory using Plotly
    const x = trajectory.map(point => point.x);
    const y = trajectory.map(point => point.y);
    const trace = {
        x: x,
        y: y,
        mode: 'lines+markers',
        type: 'scatter',
        marker: { color: '#DDA94B' },
        line: { color: '#DDA94B' }
    };
    const layout = {
        title: 'Projectile Trajectory',
        xaxis: { title: 'X (m)' },
        yaxis: { title: 'Y (m)' },
        plot_bgcolor: '#1E4174',
        paper_bgcolor: '#1E4174',
        font: { color: '#DDA94B' }
    };
    Plotly.newPlot('plot', [trace], layout);

    // Show the Save Plot button only after simulation
    const saveBtn = document.getElementById("save-plot-btn");
    saveBtn.style.display = "inline-block";

    // Populate trajectory table
    const tbody = document.querySelector("#trajectory-table tbody");
    tbody.innerHTML = "";
    trajectory.forEach(point => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${point.t.toFixed(2)}</td><td>${point.x.toFixed(2)}</td><td>${point.y.toFixed(2)}</td>`;
        tbody.appendChild(row);
    });

    // Table sorting functionality...
}
