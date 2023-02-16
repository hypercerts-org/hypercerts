import json
from math import ceil
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


def crop_and_resize(img):

    width, height = img.size
    cropped_dims = img.getbbox()
    cropped_width = cropped_dims[2] - cropped_dims[0]
    cropped_height = cropped_dims[3] - cropped_dims[1]

    if cropped_width < width:
        cropped_img = img.crop(cropped_dims)
        ratio = IMG_WIDTH / cropped_width
        resized_img = cropped_img.resize((IMG_WIDTH, ceil(cropped_height * ratio)))
        _, resized_height = resized_img.size
        cropper = ceil((resized_height - IMG_HEIGHT) / 2)
        new_img = resized_img.crop((0,cropper,IMG_WIDTH,cropper+IMG_HEIGHT))
    else:
        ratio = IMG_HEIGHT / height
        resized_img = img.resize((ceil(width * ratio), IMG_HEIGHT))
        resized_width, _ = resized_img.size
        cropper = ceil((resized_width - IMG_WIDTH) / 2)
        new_img = resized_img.crop((cropper,0,cropper+IMG_WIDTH,IMG_HEIGHT))

    return new_img

 
def getsizes(uri, name):

    response = requests.get(uri)
    img = Image.open(BytesIO(response.content))
    
    width, height = img.size
    needs_resizing = (width != IMG_WIDTH or height != IMG_HEIGHT)
    img = crop_and_resize(img)
    
    outpath = IMG_DIR + create_project_filename(name) + ".png"
    img.save(outpath)

    return dict(
        name=name,
        outpath=outpath, 
        width=width,
        height=height,
        resized=needs_resizing
    )



if __name__ == "__main__":

    images = []
    for matching_pool, grants_list in PROJECTS_DB.items():
        for grant in grants_list:
            name = grant['title']
            uri = grant['projectBannerUrlOriginal']
            images.append(getsizes(uri, name))

    outpath = IMG_DIR + "image_data.json"
    outfile = open(outpath, "w")
    json.dump(images, outfile, indent=4)                
    outfile.close()