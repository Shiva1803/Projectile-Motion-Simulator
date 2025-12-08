# Projectile Motion Simulator

A web-based physics simulator that calculates projectile motion with air resistance using Fortran for computation.

## Features
- Real-time projectile trajectory calculation
- Air resistance (drag) simulation
- Wind effects
- Interactive visualization with Plotly
- Export plots as PNG
- Export data as CSV
- Sortable trajectory data table

## Tech Stack
- **Backend**: Flask (Python)
- **Computation**: Fortran 90
- **Frontend**: HTML, CSS, JavaScript
- **Visualization**: Plotly.js

## Local Development

### Prerequisites
- Python 3.11+
- Fortran compiler (gfortran)
- pip

### Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Compile Fortran code
cd fortran
gfortran -o projectile projectile.f90
cd ..

# Run Flask server
python backend/app.py
```

Visit `http://localhost:5000` in your browser.

## Docker Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Start with Docker
```bash
# Build and run
docker-compose up

# Or build manually
docker build -t projectile-simulator .
docker run -p 5000:5000 projectile-simulator
```

## Project Structure
```
.
├── backend/
│   └── app.py              # Flask API server
├── frontend/
│   ├── index.html          # Main UI
│   ├── script.js           # Frontend logic
│   └── style.css           # Styling
├── fortran/
│   └── projectile.f90      # Physics computation
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Local development
└── requirements.txt        # Python dependencies
```

## API Endpoints

### POST /simulate
Runs projectile motion simulation.

**Request Body:**
```json
{
  "velocity": 50.0,
  "angle": 45.0,
  "drag": 0.05,
  "dt": 0.01,
  "wind": 0.0
}
```

**Response:**
```json
{
  "status": "success",
  "trajectory": [
    {"t": 0.0, "x": 0.0, "y": 0.0},
    {"t": 0.01, "x": 0.35, "y": 0.35}
  ]
}
```

## License
MIT 