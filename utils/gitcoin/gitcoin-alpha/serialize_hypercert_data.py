import json
import pandas as pd

from utils import datify


CONFIG        = json.load(open("config/config.json"))
JSONDATA_PATH = CONFIG["localPaths"]["canonicalDataset"]
SETTINGS      = json.load(open("config/gitcoin-settings.json"))
DEFAULT_DIMS  = SETTINGS["defaultDims"]
WORKSCOPES    = (pd.read_csv(CONFIG["localPaths"]["workScopeOverrides"])
                   .set_index('project')['work_scope']
                   .to_dict())


def build_hypercert(project):

    contributors = project["ensName"]
    if not contributors:
        contributors = project["address"]

    workscope = WORKSCOPES.get(project["title"].strip())
    if not workscope:
        print("Missing workscope for project:", project["title"])

    return dict(
        workScopes = workscope,
        workTimeStart = datify(DEFAULT_DIMS["workTimeStart"]),
        workTimeEnd = datify(DEFAULT_DIMS["workTimeEnd"]),
        
        impactScopes = [DEFAULT_DIMS["impactScopes"]],
        impactTimeStart = datify(DEFAULT_DIMS["workTimeStart"]),
        impactTimeEnd = datify(DEFAULT_DIMS["impactTimeEnd"]),
        
        contributors = contributors,
        rights = [DEFAULT_DIMS["rights"]]
    )


def add_hypercert_fields():

    projects_list = json.load(open(JSONDATA_PATH))
    for project in projects_list:
        hypercert = build_hypercert(project)
        project.update(dict(hypercertData=hypercert))

    out_file = open(JSONDATA_PATH, "w")
    json.dump(projects_list, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":
    add_hypercert_fields()