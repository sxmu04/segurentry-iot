from config.firebase import db
from datetime import datetime

def register_access(data):
    access = {
        "userId": data.get("userId"),
        "method": data.get("method"),
        "status": data.get("status"),
        "timestamp": datetime.utcnow()
    }

    db.collection("access_logs").add(access)

    return {"message": "Acceso registrado", "access": access}


def get_access_logs():
    docs = db.collection("access_logs").stream()

    logs = []
    for doc in docs:
        item = doc.to_dict()
        item["id"] = doc.id
        logs.append(item)

    return logs