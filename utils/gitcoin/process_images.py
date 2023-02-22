from io import BytesIO
import json
from math import ceil
import os
from PIL import Image
import requests

from utils import create_project_filename


GITCOIN        = json.load(open("config/gitcoin-settings.json"))
CID_HOST_URL   = GITCOIN["resources"]["hostedCidBaseUrl"]
DEFAULT_BANNER = GITCOIN["defaultArt"]["banner"]

CONFIG         = json.load(open("config/config.json"))
JSONDATA_PATH  = CONFIG["localPaths"]["canonicalDataset"]
IMG_DIR        = CONFIG["localPaths"]["imagesDirectory"]

IMG_WIDTH, IMG_HEIGHT = 320, 214


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

 
def process_image(uri, name, overwrite=False):

    outpath = create_project_filename(name) + ".png"
    if not overwrite:
        if outpath in os.listdir(IMG_DIR):
            return

    response = requests.get(uri)
    img = Image.open(BytesIO(response.content))
    img = crop_and_resize(img)    
    img.save(IMG_DIR + outpath)


def run_image_processing():

    projects_list = json.load(open(JSONDATA_PATH))
    for i, project in enumerate(projects_list):
        name = project['title']
        cid = project['projectBannerCid']
        if cid is None:
            cid = DEFAULT_BANNER
        uri = CID_HOST_URL + cid
        print("Processing", name, uri)
        
        process_image(uri, name)


if __name__ == "__main__":
    run_image_processing()