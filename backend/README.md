# STL Orientation Optimizer Backend

This is the Python backend for the STL Orientation Optimizer application.

## Features

- Cost function calculation based on quaternion orientation
- Support volume estimation
- Print time calculation
- Surface quality assessment
- Optimization algorithms (grid search, gradient descent)

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/calculate-cost
Calculate cost metrics for a given quaternion orientation.

**Request Body:**
```json
{
  "quaternion": {
    "w": 1.0,
    "x": 0.0,
    "y": 0.0,
    "z": 0.0
  }
}
```

**Response:**
```json
{
  "supportVolume": 45.67,
  "printTime": 142.5,
  "surfaceQuality": 0.85,
  "totalCost": 23.45
}
```

### POST /api/optimize
Find the optimal orientation using grid search.

**Request Body:**
```json
{
  "sampleCount": 100
}
```

**Response:**
```json
{
  "quaternion": {
    "w": 0.7071,
    "x": 0.7071,
    "y": 0.0,
    "z": 0.0
  },
  "cost": 18.23
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "STL Orientation Optimizer"
}
```

## Cost Function

The cost function combines three main factors:

1. **Support Volume**: Amount of support material needed
2. **Print Time**: Estimated printing time
3. **Surface Quality**: Quality of the printed surface

The total cost is calculated as:
```
f(q) = support_volume * 0.1 + print_time * 0.05 + (1 - surface_quality) * 100
```

## Optimization

The optimization uses a grid search approach:
1. Generate random quaternion samples
2. Calculate cost for each sample
3. Return the quaternion with the lowest cost

For production use, more sophisticated optimization algorithms like gradient descent or evolutionary algorithms could be implemented.