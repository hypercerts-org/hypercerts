import json
import yaml
from urllib.parse import urlparse

# read the JSON data from file
with open('optimism_project_data.json') as f:
    data = json.load(f)

# convert the JSON data to the desired YAML format
yaml_data = []
for item in data:
    yaml_item = {
        'name': item['project'],
        'description': item['description'],
        'repos': [],
        'ledgers': [
            {'address': item['address'], 'name': 'Wallet'},
        ],
    }
    for url in item['socials']:
        parsed_url = urlparse(url)
        if parsed_url.netloc == 'github.com':
            owner = parsed_url.path.split('/')[1]
            yaml_item['repos'].append({'name': owner, 'url': url})
    if not yaml_item['repos']:
        print(f"No GitHub URL found for project {yaml_item['name']}. Skipping...")
        continue
    yaml_data.append(yaml_item)

# write the YAML data to file
with open('optimism_project_data.yaml', 'w') as f:
    yaml.dump({'projects': yaml_data}, f, sort_keys=False, indent=4)

