import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

app = FastAPI()

DB_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(DB_URI)
db = client.codequest

users_store = db.users
subjects_store = db.categories
tasks_store = db.questions

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuthDetails(BaseModel):
    email: str
    password: str

class SubjectEntry(BaseModel):
    id: str
    title: str
    tag: str
    desc: str
    aboutText: str

class TaskEntry(BaseModel):
    language: str
    question: str
    options: List[str]
    answer: str

@app.get("/categories")
async def fetch_subjects():
    items = []
    async for entry in subjects_store.find():
        entry["_id"] = str(entry["_id"])
        entry["id"] = entry.get("id") or entry["_id"]
        items.append(entry)
    return items

@app.get("/about/{slug}")
async def fetch_details(slug: str):
    data = await subjects_store.find_one({"id": slug})
    if not data:
        return {"language": slug, "description": "Information not found"}
    data["_id"] = str(data["_id"])
    return {"language": slug, "description": data["aboutText"]}

@app.get("/quiz/{slug}")
async def fetch_exam(slug: str):
    pool = []
    async for item in tasks_store.find({"language": slug}):
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        pool.append(item)
    return pool

@app.post("/quiz/verify")
async def validate_result(payload: dict = Body(...)):
    ref_id = payload.get("qId")
    user_choice = payload.get("answer")
    try:
        doc = await tasks_store.find_one({"_id": ObjectId(ref_id)})
        if doc:
            return {"correct": doc["answer"] == user_choice}
    except:
        pass
    return {"correct": False}

@app.post("/signup")
async def register_account(acc: AuthDetails):
    existing = await users_store.find_one({"email": acc.email})
    if existing:
        raise HTTPException(status_code=400, detail="Account already exists")
    await users_store.insert_one(acc.dict())
    return {"status": "created"}

@app.post("/login")
async def perform_login(acc: AuthDetails):
    match = await users_store.find_one({"email": acc.email, "password": acc.password})
    if match:
        return {"status": "authenticated", "user": match["email"]}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/admin/add-category")
async def push_subject(payload: SubjectEntry):
    await subjects_store.insert_one(payload.dict())
    return {"status": "success"}

@app.put("/admin/edit-category/{slug}")
async def modify_subject(slug: str, payload: SubjectEntry):
    await subjects_store.update_one({"id": slug}, {"$set": payload.dict()})
    return {"status": "updated"}

@app.delete("/admin/delete-category/{slug}")
async def remove_subject(slug: str):
    await subjects_store.delete_one({"id": slug})
    await tasks_store.delete_many({"language": slug})
    return {"status": "deleted"}

@app.post("/admin/add-question")
async def push_task(payload: TaskEntry):
    await tasks_store.insert_one(payload.dict())
    return {"status": "success"}

@app.put("/admin/edit-question/{ref_id}")
async def modify_task(ref_id: str, payload: TaskEntry):
    await tasks_store.update_one({"_id": ObjectId(ref_id)}, {"$set": payload.dict()})
    return {"status": "updated"}

@app.delete("/admin/delete-question/{ref_id}")
async def remove_task(ref_id: str):
    await tasks_store.delete_one({"_id": ObjectId(ref_id)})
    return {"status": "deleted"}

@app.on_event("startup")
async def boot_db():
    admin_email = os.getenv("ADMIN_USER")
    admin_pass = os.getenv("ADMIN_PASS")
    master = await users_store.find_one({"email": admin_email})
    if not master:
        await users_store.insert_one({"email": admin_email, "password": admin_pass})