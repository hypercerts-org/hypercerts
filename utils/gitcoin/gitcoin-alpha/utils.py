"""
NOTE: 
There is a bug in web3.storage that prevents filenames with
accents on Latin letters like á or ó from being retrieved.
If you run into this issue, uncomment the unidecode module
and apply it to the `create_project_filename` function.

"""

from datetime import datetime
#from unidecode import unidecode


def datify(u):
    return datetime.fromtimestamp(u).strftime('%Y-%m-%d') if u else "indefinite"

def shorten_address(a):
    # todo: build more robust handling
    if isinstance(a, str):
        return a[:5] + "..." + a[-3:]
    else:
        return "unknown"

def create_project_filename(project_name):
    #filename = unidecode(filename)
    filename = project_name.replace("/","-").replace(":", "-")
    filename = filename.replace(" ","_")
    filename = filename if filename[0] != '.' else filename[1:]    
    return filename

def build_scope(name, include_list, exclude_list=[]):
    
    def format_list(lst):
        lst = [x.strip() for x in lst]
        return lst

    include_list = format_list(include_list)
    exclude_list = format_list(exclude_list)

    neg_operator = "¬"
    array_value = include_list + [f"{neg_operator}{x}" for x in exclude_list] 
    display_value = " ∧ ".join([x.replace(" ", "-") for x in array_value])

    return {
        "name": name,
        "value": include_list,
        "excludes": exclude_list,
        "display_value": display_value
    }