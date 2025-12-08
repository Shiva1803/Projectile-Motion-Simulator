# Projectile Motion Simulator

![Image](https://github.com/user-attachments/assets/508010d3-656a-48cf-b6c3-314c42d745ac)

This is a **web-based physics simulator** that visualizes projectile motion under various conditions.  
Built with **HTML, CSS, JavaScript (Plotly.js)** and a **Python (Flask)** backend, it helps users explore real-time trajectories, velocity vectors, and motion parameters. 

---

## Features

- **Dynamic Simulation:** Visualizes projectile motion in real-time.
- **Velocity Vectors:** Displays directional arrows along the path.
- **Height Gradient:** Trajectory path changes color with height (low → blue, high → red).
- **Drag & Wind Effects:** Adjust air resistance and horizontal wind to see their impact.
- **Custom Parameters:**
  - Initial velocity  
  - Launch angle  
  - Drag coefficient  
  - Time step (`dt`)  
  - Wind speed (positive = tailwind, negative = headwind)
- **Data Table:** Displays time, X, and Y coordinates for each step.
- **Export Options:**
  - Save trajectory data as **CSV**
  - Download the plot as **PNG**

---

## Physics Behind the Simulation

The simulation models projectile motion under gravity, air drag, and optional wind effects using small time-step numerical integration:
vx_next = vx - drag * vx * dt + wind
vy_next = vy - (g + drag * vy) * dt
x_next = x + vx * dt
y_next = y + vy * dt

---

## Tech Stack Used

Frontend: HTML, CSS, JavaScript, Plotly.js 
Backend: Python, Flask
Visualization: Plotly Scatter Plot
Export: JavaScript Blob API (CSV)



