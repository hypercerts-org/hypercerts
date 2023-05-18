from dotenv import load_dotenv
import json
import logging
import openai
import os
import requests
import time


PROJECTS_DATA  = "data/projects-data.json"
DESCRIPTIONS   = "data/descriptions.json"


def summarize(text_blob, max_tokens=1250, tries=0):

    if not isinstance(text_blob, str):
        return ""

    tokens = text_blob.split(" ")
    if len(tokens) < 100:
        return text_blob

    text_blob = " ".join(tokens[:(max_tokens-200)])
    print(len(tokens), "out of", max_tokens, "max", len(text_blob))

    prompt = (f"Consider the following text:\n\n"
              f"---\n\n"
              f"{text_blob}\n\n"
              f"---\n\n"
              f"Please convert this into a 2-3 sentence summary that describes what the project is doing." 
              f"Use the name of the project in the description, eg: 'Project X is an open source protocol for...'."
              f"Only return the summary text; don't return any other comments or superfluous text.")

    try:

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.5,
            max_tokens=200,
            n=1,
            stop=None
        )
        
        new_text = response.choices[0].text
        new_text = new_text.strip()
        new_text = new_text.strip('"')

        return new_text    
    
    except Exception as e:

        tries += 1
        if tries == 5:
            print(f"Aborting process after {tries} tries.")
            return "aborted"

        print(e)        
        time.sleep(10)

        return summarize(text_blob, max_tokens-250, tries)


def process_projects():

    if os.path.exists(DESCRIPTIONS):
        with open(DESCRIPTIONS) as f:
            descriptions = json.load(f)
    else:
        descriptions = {}

    with open(PROJECTS_DATA) as f:
        projects = json.load(f)

    for project_id, data in projects.items():
        if descriptions.get(project_id):
            continue
        descr = summarize(data['description'])
        if descr == "aborted":
            break
        descriptions.update({project_id:descr})

    with open(DESCRIPTIONS, 'w') as f:
        json.dump(descriptions, f, indent=4)


if __name__ == "__main__":
    load_dotenv()
    openai.api_key = os.environ['OPENAI_API_KEY']
    process_projects()
