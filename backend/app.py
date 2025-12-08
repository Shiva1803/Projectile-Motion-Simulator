from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import numpy as np

# Flask setup
app = Flask(__name__)
CORS(app)  # Allow all origins for now, restrict in production if needed

# Health check endpoint for Render
@app.route('/health')
def health():
    return jsonify({"status": "healthy"}), 200

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FORTRAN_FOLDER = os.path.abspath(os.path.join(BASE_DIR, "../fortran"))
FORTRAN_EXE = os.path.join(FORTRAN_FOLDER, "projectile")
INPUT_FILE = os.path.join(FORTRAN_FOLDER, "input.txt")
OUTPUT_FILE = os.path.join(FORTRAN_FOLDER, "output.txt")

FRONTEND_FOLDER = os.path.abspath(os.path.join(BASE_DIR, "../frontend"))

# Serve frontend files
@app.route('/')
def index():
    return send_from_directory(FRONTEND_FOLDER, "index.html")

@app.route('/style.css')
def style():
    return send_from_directory(FRONTEND_FOLDER, "style.css")

@app.route('/script.js')
def script():
    return send_from_directory(FRONTEND_FOLDER, "script.js")

# simulate endpoint
@app.route("/simulate", methods=["POST"])
def simulate():
    try:
        data = request.json
        v0 = float(data.get("velocity", 50.0))
        angle = float(data.get("angle", 45.0))
        k = float(data.get("drag", 0.05))
        dt = float(data.get("dt", 0.01))
        wind = float(data.get("wind", 0.0))

        # Write input.txt for Fortran
        with open(INPUT_FILE, "w") as f:
            f.write(f"{v0} {angle} {k} {dt} {wind}\n")

        # Run Fortran executable in the fortran folder
        subprocess.run([FORTRAN_EXE], check=True, cwd=FORTRAN_FOLDER)

        # Read output.txt
        data_points = np.loadtxt(OUTPUT_FILE, comments="#")
        trajectory = [{"t": float(row[0]), "x": float(row[1]), "y": float(row[2])} for row in data_points]

        print("Simulation complete. Results written to output.txt")  # debug

        return jsonify({"trajectory": trajectory, "status": "success"})

    except subprocess.CalledProcessError:
        return jsonify({"status": "error", "message": "Fortran program failed"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Run server
if __name__ == "__main__":
    from os import environ
    port = int(environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

