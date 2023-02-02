from datetime import datetime


def datify(u):
    return datetime.fromtimestamp(u).strftime('%Y-%m-%d') if u else "Indefinite"

def shorten_address(a):
    # todo: build more robust handling
    if isinstance(a, str):
        return a[:5] + "..." + a[-3:]
    else:
        return "unknown"

def create_project_filename(project_name):
    filename = project_name.replace("/","-").replace(":", "-")
    filename = filename if filename[0] != '.' else filename[1:]
    return filename

def build_scope(name, include_list, exclude_list=[]):
    
    def format_list(lst):
        lst = [x.strip() for x in lst]
        #lst = [x.lower() if x.upper() != x else x for x in lst]
        return lst

    include_list = format_list(include_list)
    exclude_list = format_list(exclude_list)

    neg_operator = "¬"
    array_value = include_list + [f"{neg_operator}{x}" for x in exclude_list] 
    display_value = " ∧ ".join([x.replace(" ", "-") for x in array_value])

    return {
        "name": name,
        "includes": include_list,
        "excludes": exclude_list,
        "value": array_value,
        "display_value": display_value
    }