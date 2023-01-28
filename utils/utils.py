from datetime import datetime


def datify(u):
    return datetime.fromtimestamp(u).strftime('%Y-%m-%d') if u else "Indefinite"

def shorten_address(a):
    if isinstance(str, a):
        return a[:7]
    else:
        return "unknown"