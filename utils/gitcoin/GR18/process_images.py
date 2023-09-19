from io import BytesIO
import json
from math import ceil
import os
from PIL import Image
import requests

CID_HOST_URL   = "https://ipfs-grants-stack.gitcoin.co/ipfs/"
PROJECTS_DATA  = "data/projects-data.json"
IMG_DIR        = "data/img/"

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

 
def process_image(uri, project_id, overwrite=False):

    outpath = str(project_id) + ".png"
    if not overwrite:
        if outpath in os.listdir(IMG_DIR):
            return

    response = requests.get(uri)
    try:
        img = Image.open(BytesIO(response.content))
        img = crop_and_resize(img)    
        img.save(IMG_DIR + outpath)
    except:
        print("Error processing image:", uri)


def run_image_processing():

    projects = json.load(open(PROJECTS_DATA))
    for idx, project in enumerate(projects):
        cid = project['bannerImg']
        if cid is None:
            continue
        uri = CID_HOST_URL + cid
        print("Processing", project['name'], uri)
        
        process_image(uri, idx)


if __name__ == "__main__":
    run_image_processing()