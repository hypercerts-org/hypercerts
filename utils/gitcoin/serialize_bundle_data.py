from dotenv import load_dotenv
import json
import openai
import os
import pandas as pd
import time


# Set up OpenAI API client
load_dotenv()
openai.api_key = os.environ['OPENAI_API_KEY']


CONFIG        = json.load(open("config/config.json"))
GRAPH_DATA    = json.load(open(CONFIG["localPaths"]["graphData"]))
ALLOWLIST_DIR = CONFIG["localPaths"]["allowlistDirectory"]
DONORLIST_DIR = CONFIG["localPaths"]["donorlistDirectory"]
OUTPATH       = CONFIG["localPaths"]["bundleDataset"]
SETTINGS      = json.load(open("config/gitcoin-settings.json"))


BUNDLE_IDS = [
    "0x0b84bfa1e358e2c7816e5244258c16e4d6d06930fb4cf20f2d714ce35d330308",
    "0x95adaaef6d0a11b862f47a236bbca9d93dcfe35d1ae044edc0223d5485e1bfbb",
    "0x89c4fbe0d97ba25cba17b36c837c27cb7b39c96ccc8b43a99df2dfaca9732763",
    "0x5b82b9d0cb3d0d14c8fe693502b197cfbc0f55115446632448549da20538c96c",
    "0x42c5410440da06b29d782ee691783aad21d76b0de61c1034432f816af89aa57f",
    "0xd716c3a7c353f0458ff8387fb435606934e25b631a83db017e5eb9a0022358f0",
    "0xedc8c2863195c102234eb522c94568c4aabd91d4eb2df52d2c4dc9f953e01295",
    "0xe8017af6c0a19b08c86e8ef94d9b3dadcbe8f55bc446d7359a6f294d68227b84",
    "0x52f41f0f49803ae47f13977a8a5dd1b170348e82e2d59303861efb83d1413b50",
    "0xf39a20c932f2445f48214e8726d305bac89d54b3c99940d601a168e2b8745014"
]
ROUND_ID = "0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0"


def extract_projects(text_blob, max_tokens=1250):

    prompt = (f"Consider the following text:\n\n"
              f"---\n\n"
              f"{text_blob}\n\n"
              f"---\n\n"
              f"Convert the text into a JSON that lists the projects and has the following keys for each project:" 
              f"`project_name`, `twitter_handle`, `description`."
              f"Edit the `description` field to 2-3 sentences.")

    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.5,
            max_tokens=max_tokens,
            n=1,
            stop=None
        )
        
        data = response.choices[0].text

        data = data.replace("```json", "")
        data = data.replace("```", "")
        data = data.strip()

        json_data = json.loads(data)
        print(f"Retrieved {len(json_data)} projects.")
        return json_data    
    
    # most common exceptions are rate limiting or a mis-formatted JSON object
    except Exception as e:
        print(e)        
        time.sleep(30)
        return(extract_projects(text_blob))


def extract_bundles():

    bundles = []
    for project_record in GRAPH_DATA:
        bundle_id = project_record["projectId"]
        round_id = project_record["roundId"]
        info = project_record["data"]["application"]["project"]
        bundle_name = info["title"]
        description = info["description"]        
        if bundle_id in BUNDLE_IDS and round_id == ROUND_ID:
            print(f"Getting project data for: {bundle_name}.")
            bundles.append(dict(
                            bundleId=bundle_id,
                            roundId=round_id,
                            bundleName=bundle_name,
                            bundleDescription=description,
                            projects=extract_projects(description)
                        ))
            time.sleep(10)
    
    out_file = open(OUTPATH, "w")
    json.dump(bundles, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":
    # run this to generate the initial JSON
    #extract_bundles()