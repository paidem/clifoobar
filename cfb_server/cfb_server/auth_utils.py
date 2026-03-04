from urllib.parse import urlencode

from django.conf import settings
from mozilla_django_oidc.utils import absolutify


def keycloak_logout_url(request):
    post_logout_redirect_uri = absolutify(request, settings.LOGOUT_REDIRECT_URL)
    params = {"post_logout_redirect_uri": post_logout_redirect_uri}

    id_token = request.session.get("oidc_id_token")
    if id_token:
        params["id_token_hint"] = id_token

    return f"{settings.OIDC_OP_LOGOUT_ENDPOINT}?{urlencode(params)}"
