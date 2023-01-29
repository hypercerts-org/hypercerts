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