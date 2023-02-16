import json
import os
import requests
from io import BytesIO
from PIL import Image

from utils import create_project_filename

with open("config.json") as config_file:
    CONFIG = json.load(config_file)    

with open(CONFIG["gitcoin_settings"]["path_to_project_list"]) as projects_file:
    PROJECTS_DB = json.load(projects_file)

IMG_WIDTH, IMG_HEIGHT = 320, 214
IMG_DIR = 'data/images/'

 
def getsizes(uri, name):

    response = requests.get(uri)
    img = Image.open(BytesIO(response.content))
    
    width, height = img.size
    needs_resizing = (width < IMG_WIDTH or height < IMG_HEIGHT)
    if needs_resizing:
        print(name, width, height)
    
    outpath = IMG_DIR + create_project_filename(name) + ".png"
    img.save(outpath)

    return dict(
        name=name,
        outpath=outpath, 
        width=width,
        height=height,
        needsResizing=needs_resizing
    )


if __name__ == "__main__":

    images = []
    for matching_pool, grants_list in PROJECTS_DB.items():
        for grant in grants_list:
            name = grant['title']
            uri = grant['projectBannerUrl']
            images.append(getsizes(uri, name))

    outpath = IMG_DIR + "image_data.json"
    outfile = open(outpath, "w")
    json.dump(images, outfile, indent=4)                
    outfile.close()