from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200

    message = response.json()["message"]

    assert len(message) < 40


def test_health():
    response = client.get("/healthcheck")
    assert response.status_code == 200

    message = response.json()["status"]

    assert message == "ok"
