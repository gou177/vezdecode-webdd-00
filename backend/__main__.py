from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from pydantic import BaseModel
import uvicorn
import time
from pydantic.fields import Field
from enum import Enum
from itertools import count
import json
from threading import RLock
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WorkerRole(str, Enum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"


class Worker(BaseModel):
    login: str
    password: str
    role: WorkerRole = WorkerRole.MEMBER


class Storage(object):
    data: List["Form"]

    def __init__(self):
        self.lock = RLock()
        self.load()
        self.id_gen = count(len(self.data))

    def load(self):
        with self.lock:
            try:
                with open("./data.json") as f:
                    self.data = list(map(lambda d: Form(**d), json.load(f)))
            except FileNotFoundError:
                self.data = []

    def save(self):
        with self.lock:
            with open("./data.json", "w") as f:
                json.dump(list(map(Form.dict, self.data)), f)


class ReportStatus(str, Enum):
    NEW = "NEW"
    IN_WORK = "IN_WORK"
    CLOSED = "CLOSED"


class Form(BaseModel):
    text: str
    phone: int
    first_name: str
    last_name: str
    patronymic_name: Optional[str]
    id: int = Field(default_factory=lambda: next(s.id_gen))
    created_at: int = Field(default_factory=time.time)
    closed_at: Optional[int] = None
    status: ReportStatus = ReportStatus.NEW
    worker: Optional[Worker] = None


workers = [
    Worker(
        login="admin",
        password="admin",
        role=WorkerRole.ADMIN,
    ),
    Worker(
        login="worker1",
        password="worker1",
    ),
    Worker(
        login="worker2",
        password="worker2",
    ),
]

s = Storage()


@app.post("/form")
def create_report(form: Form):
    s.data.append(form)
    s.save()
    return {"success": True}


@app.post("/user")
def get_user(login: str):
    for worker in workers:
        if worker.login == login:
            return worker
    raise HTTPException(404, "User not found")


@app.get("/form/{form_id}")
def get_form(form_id: int):
    try:
        return list(filter(lambda x: x.id == form_id, s.data))[0]
    except IndexError:
        raise HTTPException(404, "Form not found")


@app.put("/form/{form_id}/assign")
def assign(form_id: int, worker_login: str, user: Worker = Depends(get_user)):  # type: ignore
    if user.role != WorkerRole.ADMIN:
        raise HTTPException(403, "User not admin")
    worker = get_user(login=worker_login)
    form = get_form(form_id)
    form.worker = worker
    form.status = ReportStatus.IN_WORK
    s.save()
    return form


@app.get("/forms")
def get_forms():
    return s.data


@app.put("/form/setStatus")
def set_form_status(form_id: int, status: ReportStatus):
    for form in s.data:
        if form.id == form_id:
            form.status = status
            return s.save()

app.mount("/", StaticFiles(directory="./static"))
uvicorn.run(app, host="0.0.0.0", port=6403)
