from flask import Flask, request, jsonify
from flask_cors import CORS   # << import CORS
import subprocess
import os
import numpy as np

app = Flask(__name__)
CORS(app)  # << enable CORS for all routes

from flask import send_from_directory

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')


# -----------------------------
# PATH CONFIGURATION
# -----------------------------
# Fortran folder is a sibling of backend
FORTRAN_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), "../fortran"))

FORTRAN_EXE = os.path.join(FORTRAN_FOLDER, "projectile")

INPUT_FILE = os.path.join(FORTRAN_FOLDER, "input.txt")
OUTPUT_FILE = os.path.join(FORTRAN_FOLDER, "output.txt")

# -----------------------------
# FLASK ENDPOINT
# -----------------------------
@app.route("/simulate", methods=["POST"])
def simulate():
    try:
        # Get JSON input from frontend
        data = request.json
        v0 = float(data.get("velocity", 50.0))
        angle = float(data.get("angle", 45.0))
        k = float(data.get("drag", 0.05))
        dt = float(data.get("dt", 0.01))

        # Write input.txt for Fortran program
        with open(INPUT_FILE, "w") as f:
            f.write(f"{v0} {angle} {k} {dt}\n")

        # Run Fortran executable
        subprocess.run([FORTRAN_EXE], check=True, cwd=FORTRAN_FOLDER)

        # Read output.txt
        data_points = np.loadtxt(OUTPUT_FILE, comments="#")
        trajectory = [{"t": float(row[0]), "x": float(row[1]), "y": float(row[2])} for row in data_points]

        return jsonify({"trajectory": trajectory, "status": "success"})

    except subprocess.CalledProcessError:
        return jsonify({"status": "error", "message": "Fortran program failed"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
