# backend/Dockerfile
# ====================
# Builds a Docker image for the FastAPI backend

# Use the official Python 3.11 slim image (smaller = faster)
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements first (Docker caches this layer if unchanged)
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend code
COPY . .

# Tell Docker which port this container uses
EXPOSE 8000

# The command to run when the container starts
# --host 0.0.0.0 makes it accessible from outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
