# AI Agent Instructions for Projectile Motion Simulator

## Project Architecture

This is a hybrid Fortran-Python-JavaScript project that simulates projectile motion with air resistance. The architecture consists of three main components:

1. **Fortran Core** (`fortran/projectile.f90`):
   - Handles numerical computation of projectile trajectories
   - Takes input from `input.txt` and writes to `output.txt`
   - Parameters: initial velocity, angle, drag coefficient, time step

2. **Python Backend** (`backend/app.py`):
   - Flask server that bridges frontend and Fortran
   - Manages file I/O and process execution
   - Serves frontend files and handles simulation requests
   - Converts JSON data to/from Fortran's file format

3. **JavaScript Frontend** (`frontend/`):
   - Interactive UI for parameter input
   - Visualization using Plotly.js
   - Data export features (PNG plots, CSV data)

## Development Workflow

### Setup and Running

1. First disable pyenv if active:
   ```bash
   pyenv shell --unset
   ```

2. Start the Flask backend:
   ```bash
   cd backend
   flask run
   ```

3. Serve the frontend:
   - Open `frontend/index.html` with Live Server

### Fortran Compilation

The Fortran executable needs to be compiled when modified:
```bash
cd fortran
gfortran -o projectile projectile.f90
```

## Key Integration Points

1. **Data Flow**:
   - Frontend → Backend: JSON POST to `/simulate` with parameters
   - Backend → Fortran: Writes parameters to `input.txt`
   - Fortran → Backend: Writes trajectory to `output.txt`
   - Backend → Frontend: JSON response with trajectory array

2. **File Formats**:
   - `input.txt`: `<velocity> <angle> <drag> <dt>` (space-separated)
   - `output.txt`: Tab-separated columns with header `# t(s) x(m) y(m)`

## Project Conventions

1. **Parameter Validation**:
   - Velocity: > 0
   - Angle: 0-90 degrees
   - Drag coefficient: 0-1
   - Time step (dt): 0.001-1

2. **Error Handling**:
   - Frontend displays validation warnings
   - Backend returns JSON with `status` and `message` fields
   - Fortran errors are captured and propagated via exit codes

## Common Development Tasks

1. **Modifying Simulation Parameters**:
   - Add new parameters in `projectile.f90`
   - Update input parsing in both `app.py` and `script.js`
   - Add validation in frontend

2. **Extending Output Data**:
   - Add new columns in Fortran output
   - Update parsing in `app.py`
   - Add visualization in `script.js`