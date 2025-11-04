#!/bin/bash

# Force Python 3.9
rm -f /opt/vercel/python
ln -s /opt/python/3.9.16 /opt/vercel/python

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create a simple Python version checker
echo "import sys; print(f'Python version: {sys.version}')" > version_check.py
python version_check.py
