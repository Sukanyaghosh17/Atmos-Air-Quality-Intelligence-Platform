import os
import sys

# Add the backend directory to sys.path so backend imports work seamlessly
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from backend.main import app
