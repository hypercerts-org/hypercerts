#!/bin/bash
python get_grants_data.py

python allowlist.py
# python screen_allowlist.py

python serialize_project_data.py
python serialize_address_data.py
python serialize_hypercert_data.py

python process_images.py
python create_hypercert_minting_urls.py