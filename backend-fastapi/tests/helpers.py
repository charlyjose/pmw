import app.utils.auth as auth

TEAM_TUTOR = "TUTOR"
TEAM_CSD = "CSD"


def get_token(user: str):
    return auth.encodeJWT(user).access_token
