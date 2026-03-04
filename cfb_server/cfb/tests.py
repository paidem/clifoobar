from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.test import APITestCase

from cfb.models import Language, Snippet


User = get_user_model()


class BackendApiSmokeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alice",
            email="alice@example.com",
            password="secret123",
            first_name="Alice",
            last_name="Doe",
        )
        self.other_user = User.objects.create_user(
            username="bob",
            email="bob@example.com",
            password="secret123",
        )
        self.staff_user = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="admin123",
        )
        self.language = Language.objects.create(code="python", name="Python")
        self.public_snippet = Snippet.objects.create(
            author=self.user,
            name="Public snippet",
            description="Public",
            body="print('public')",
            language="python",
            personal=False,
        )
        self.public_snippet.tags.add("public-tag")
        self.personal_snippet = Snippet.objects.create(
            author=self.user,
            name="Personal snippet",
            description="Personal",
            body="print('private')",
            language="python",
            personal=True,
        )

    def test_public_endpoints_for_anonymous_user(self):
        snippets_response = self.client.get("/api/snippets/")
        self.assertEqual(snippets_response.status_code, 200)
        snippet_names = [item["name"] for item in snippets_response.data["results"]]
        self.assertIn("Public snippet", snippet_names)
        self.assertNotIn("Personal snippet", snippet_names)

        tags_response = self.client.get("/api/tags/")
        self.assertEqual(tags_response.status_code, 200)
        tag_names = [item["name"] for item in tags_response.data]
        self.assertIn("public-tag", tag_names)

        languages_response = self.client.get("/api/languages/")
        self.assertEqual(languages_response.status_code, 200)
        language_codes = [item["code"] for item in languages_response.data]
        self.assertIn("python", language_codes)

        auth_config_response = self.client.get("/api/auth/config")
        self.assertEqual(auth_config_response.status_code, 200)
        self.assertEqual(auth_config_response.data["mode"], "local")
        self.assertEqual(auth_config_response.data["oauth"], False)

    def test_users_endpoints_require_and_respect_authentication(self):
        current_anon_response = self.client.get("/api/users/current/")
        self.assertIn(current_anon_response.status_code, [401, 403])

        self.client.force_authenticate(user=self.user)
        current_auth_response = self.client.get("/api/users/current/")
        self.assertEqual(current_auth_response.status_code, 200)
        self.assertEqual(current_auth_response.data["username"], "alice")

        users_response = self.client.get("/api/users/")
        self.assertEqual(users_response.status_code, 200)
        self.assertGreaterEqual(len(users_response.data), 2)

    def test_snippet_create_and_vote(self):
        self.client.force_authenticate(user=self.user)
        create_response = self.client.post(
            "/api/snippets/",
            {
                "name": "Created snippet",
                "description": "Created from test",
                "body": "print('created')",
                "language": "python",
                "personal": False,
                "tags": ["created-tag"],
            },
            format="json",
        )
        self.assertEqual(create_response.status_code, 201)
        created_id = create_response.data["id"]

        vote_response = self.client.post(f"/api/snippets/{created_id}/vote")
        self.assertEqual(vote_response.status_code, 202)
        created_snippet = Snippet.objects.get(pk=created_id)
        self.assertEqual(created_snippet.popularity, 1)

    def test_snippet_create_accepts_stringified_tags_payload(self):
        self.client.force_authenticate(user=self.user)
        create_response = self.client.post(
            "/api/snippets/",
            {
                "name": "Created snippet",
                "description": "Created from test",
                "body": "print('created')",
                "language": "python",
                "personal": False,
                "tags": '["first","second"]',
            },
        )
        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(create_response.data["tags"], ["first", "second"])

    def test_admin_login_logout_smoke(self):
        web_client = Client()
        login_page_response = web_client.get("/admin/login/")
        self.assertEqual(login_page_response.status_code, 200)

        login_response = web_client.post(
            "/admin/login/",
            {
                "username": self.staff_user.username,
                "password": "admin123",
            },
            follow=False,
        )
        self.assertIn(login_response.status_code, [301, 302])

        logout_response = web_client.get("/admin/logout/", follow=False)
        self.assertIn(logout_response.status_code, [301, 302])

        api_logout_response = web_client.get("/api/auth/logout", follow=False)
        self.assertIn(api_logout_response.status_code, [301, 302])

    def test_snippets_list_without_trailing_slash_redirects(self):
        response = self.client.get("/api/snippets", follow=False)
        self.assertIn(response.status_code, [301, 302, 307, 308])
