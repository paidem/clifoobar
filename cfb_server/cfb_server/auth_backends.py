from mozilla_django_oidc.auth import OIDCAuthenticationBackend


class KeycloakOIDCAuthenticationBackend(OIDCAuthenticationBackend):
    def filter_users_by_claims(self, claims):
        username = claims.get("preferred_username")
        email = claims.get("email")

        users = self.UserModel.objects.none()
        if username:
            users = self.UserModel.objects.filter(username__iexact=username)
            if users.exists():
                return users

        if email:
            return self.UserModel.objects.filter(email__iexact=email)

        return users

    def get_username(self, claims):
        return claims.get("preferred_username") or super().get_username(claims)

    def create_user(self, claims):
        username = self.get_username(claims)
        email = claims.get("email", "")
        return self.UserModel.objects.create_user(
            username=username,
            email=email,
            first_name=claims.get("given_name", ""),
            last_name=claims.get("family_name", ""),
        )

    def update_user(self, user, claims):
        user.email = claims.get("email", user.email)
        user.first_name = claims.get("given_name", user.first_name)
        user.last_name = claims.get("family_name", user.last_name)
        user.save(update_fields=["email", "first_name", "last_name"])
        return user

    def verify_claims(self, claims):
        return bool(claims.get("preferred_username") or claims.get("email"))
