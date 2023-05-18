#!/bin/bash

# get grant data and allowlists
#python get_grants_data.py

# resize and process images
#python process_images.py

# shorten project titles and descriptions
python ai_description.py

# upload to web3.storage
source .env
path="../../../node_modules/@web3-storage/web3-storage-quickstart/put-files.js"

r1=$(node $path --token="$WEB3_STORAGE_TOKEN" data/img/)
img_cid=$(echo "$r1" | awk '{gsub(/\r/,""); $1=$1; print $NF}' | tr -d 'files\n')

r2=$(node $path --token="$WEB3_STORAGE_TOKEN" data/allowlists/)
allowlist_cid=$(echo "$r2" | awk '{gsub(/\r/,""); $1=$1; print $NF}' | tr -d 'files\n')

echo "{\"img\": \"$img_cid\", \"allowlists\": \"$allowlist_cid\"}" > data/cids.json

#python create_hypercert_minting_urls.py