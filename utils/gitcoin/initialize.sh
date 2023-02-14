#!/bin/bash
mkdir -p data/allowlists
mkdir -p data/metadata

python get_grants_data.py
python allowlist.py
python serialize_project_stats.py