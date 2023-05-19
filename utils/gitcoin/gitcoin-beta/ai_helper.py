import argparse
from dotenv import load_dotenv
import json
import logging
import openai
import os
import time


PROJECTS_DATA = "data/projects-data.json"
DESCRIPTIONS = "data/descriptions.json"
WORK_SCOPES = "data/workscopes.json"

MAX_TOKENS_SUMMARY = 1250
MAX_TOKENS_WORK_SCOPE = 20
MAX_RETRIES = 5
WAIT_TIME = 10

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
file_handler = logging.FileHandler("error.log")
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

def summarize(text_blob, max_tokens=MAX_TOKENS_SUMMARY):
    if not isinstance(text_blob, str):
        return ""

    tokens = text_blob.split(" ")
    if len(tokens) < 100 or max_tokens < 200:
        return text_blob

    text_blob = " ".join(tokens[:(max_tokens - 200)])

    prompt = (
        f"Consider the following text:\n\n"
        f"---\n\n"
        f"{text_blob}\n\n"
        f"---\n\n"
        f"Please convert this into a 2-3 sentence summary that describes what the project is doing."
        f"Use the name of the project in the description, e.g., 'Project X is an open source protocol for...'."
        f"Only return the summary text; don't return any other comments or superfluous text."
    )

    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.5,
            max_tokens=200,
            n=1,
            stop=None
        )

        new_text = response.choices[0].text.strip().strip('"')

        return new_text

    except Exception as e:
        logger.error(f"Error during summarization: {e}")
        return ""


def shorten_workscope(title, description):
    if not isinstance(title, str):
        return ""

    title = title.strip()

    if len(title) <= 30:
        return title

    text_blob = "\n\n".join([title, description])

    prompt = (
        f"Consider the following text about a project:\n\n"
        f"---\n\n"
        f"{text_blob}\n\n"
        f"---\n\n"
        f"Please shorten this text to just project name. The project name should be 30 characters or less."
        f"Only return the project name; don't return any other comments or superfluous text."
    )

    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.5,
            max_tokens=MAX_TOKENS_WORK_SCOPE,
            n=1,
            stop=None
        )

        new_text = response.choices[0].text.strip().strip('"')

        return new_text

    except Exception as e:
        logger.error(f"Error during work scope shortening: {e}")
        return ""


def process_project_descriptions():
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
        if descr == "":
            break
        descriptions[project_id] = descr

    with open(DESCRIPTIONS, 'w') as f:
        json.dump(descriptions, f, indent=4)


def split_scope(work_scope):
    
    split_chars = ["-", ":", "|"]
    for char in split_chars:
        if char in work_scope:
            return work_scope.split(char)[0].strip()
    
    return work_scope


def process_work_scopes():
    if os.path.exists(WORK_SCOPES):
        with open(WORK_SCOPES) as f:
            work_scopes = json.load(f)
    else:
        work_scopes = {}

    with open(PROJECTS_DATA) as f:
        projects = json.load(f)

    with open(DESCRIPTIONS) as f:
        descriptions = json.load(f)

    for project_id, descr in descriptions.items():
        if work_scopes.get(project_id):
            continue
        title = projects[project_id].get('name')
        work_scope = shorten_workscope(title, descr)
        if work_scope == "":
            break
        work_scopes[project_id] = split_scope(work_scope)

    with open(WORK_SCOPES, 'w') as f:
        json.dump(work_scopes, f, indent=4)


def main():
    load_dotenv()
    openai.api_key = os.environ['OPENAI_API_KEY']
    process_project_descriptions()
    process_work_scopes()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process project descriptions and work scopes.")
    parser.add_argument("--logfile", help="Specify the log file path.")
    args = parser.parse_args()

    if args.logfile:
        file_handler = logging.FileHandler(args.logfile)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    main()
