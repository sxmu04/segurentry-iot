import firebase_admin

from firebase_admin import credentials

from firebase_admin import firestore

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SERVICE_ACCOUNT_KEY = (
    BASE_DIR
    / "config"
    / "firebase"
    / "serviceAccountKey.json"
)

if not firebase_admin._apps:

    cred = credentials.Certificate(
        SERVICE_ACCOUNT_KEY
    )

    firebase_admin.initialize_app(cred)

db = firestore.client()