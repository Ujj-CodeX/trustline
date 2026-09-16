import time

_calls = []
MAX_CALLS = 30
WINDOW = 60  #--> sECONDS

def check_outbound_limit():
    now = time.time()

    _calls[:] = [t for t in _calls if now - t < WINDOW]

    if len(_calls) >= MAX_CALLS:
        return False
    _calls.append(now)

    return True

