from datetime import datetime


def datify(u):
    return datetime.fromtimestamp(u).strftime('%Y-%m-%d') if u else "Indefinite"