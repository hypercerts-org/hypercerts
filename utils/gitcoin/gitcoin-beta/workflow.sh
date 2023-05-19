#!/bin/bash

# get grant data and allowlists
#python get_grants_data.py

# resize and process images
#python process_images.py

# shorten project titles and descriptions
#python ai_helper.py

# upload to web3.storage
source .env
path="../../../node_modules/@web3-storage/web3-storage-quickstart/put-files.js"

r=$(node $path --token="$WEB3_STORAGE_TOKEN" data/img/)
img_cid=$(echo "$r" | awk -F'CID: ' '{print $2}' | tr -d '\n')

r=$(node $path --token="$WEB3_STORAGE_TOKEN" data/allowlists/)
allowlist_cid=$(echo "$r" | awk -F'CID: ' '{print $2}' | tr -d '\n')

echo "{\"img\": \"$img_cid\", \"allowlists\": \"$allowlist_cid\"}" > data/cids.json

#python create_hypercert_minting_urls.py