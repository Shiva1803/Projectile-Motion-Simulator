# Use Python base image with build tools
FROM python:3.11-slim

# Install Fortran compiler and build essentials
RUN apt-get update && apt-get install -y \
    gfortran \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/
COPY fortran/ /app/fortran/

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Compile Fortran code
WORKDIR /app/fortran
RUN gfortran -o projectile projectile.f90

# Return to app directory
WORKDIR /app

# Expose port
EXPOSE 5000

# Set environment variables for production
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=production
ENV PORT=5000

# Run with Gunicorn for production
CMD gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 backend.app:app
