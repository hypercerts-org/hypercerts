from datetime import datetime


def datify(u):
    return datetime.fromtimestamp(u).strftime('%Y-%m-%d') if u else "Indefinite"

def shorten_address(a):
    # todo: build more robust handling
    if isinstance(a, str):
        return a[:5] + "..." + a[-3:]
    else:
        return "unknown"