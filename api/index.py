import sys
import os
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add local fallback paths if libqutrub is packaged locally
current_dir = os.path.dirname(os.path.abspath(__file__))
lib_dir = os.path.join(current_dir, "_lib")
if os.path.exists(lib_dir):
    sys.path.insert(0, lib_dir)

try:
    import libqutrub.conjugator as conjugator
    import libqutrub.verb_valid as verb_valid
except ImportError:
    # If not in top-level sys.path, check support dirs
    support_dir = os.path.join(lib_dir, "pyarabic")
    if os.path.exists(support_dir):
        sys.path.insert(0, support_dir)
    import libqutrub.conjugator as conjugator
    import libqutrub.verb_valid as verb_valid

app = FastAPI(
    title="Tashrif Digital Qutrub API",
    description="API Konjugasi Verba Arab berbasis Qutrub untuk Tashrif Digital",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VALID_FUTURE_TYPES = {"فتحة", "ضمة", "كسرة"}


class ConjugationRequest(BaseModel):
    verb: str
    future_type: str = "فتحة"
    transitive: bool = True
    passive: bool = True


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Tashrif Digital Qutrub API",
        "version": "1.0.0",
    }


@app.get("/suggest")
@app.get("/api/suggest")
def suggest(
    query: str = Query(..., description="Potongan huruf verba tanpa harakat, mis. 'صل'")
):
    trimmed = query.strip()
    if not trimmed:
        return {"query": query, "suggestions": []}

    try:
        suggestions = verb_valid.suggest_verb(trimmed)
    except Exception:
        suggestions = []

    return {"query": query, "suggestions": suggestions or []}


@app.get("/conjugate")
@app.get("/api/conjugate")
def conjugate(
    verb: str = Query(..., description="Verba berharakat atau unvocalized untuk mazid"),
    future_type: str = Query(
        "فتحة",
        description="Harakat 'ain fi'il mudhari' untuk fi'il tsulatsi: فتحة | ضمة | كسرة",
    ),
    transitive: bool = Query(True, description="Apakah verba transitif (muta'addi)"),
    passive: bool = Query(True, description="Sertakan bentuk majhul/pasif"),
):
    trimmed = verb.strip()
    if not trimmed:
        raise HTTPException(status_code=400, detail="Parameter 'verb' tidak boleh kosong.")

    ft = future_type if future_type in VALID_FUTURE_TYPES else "فتحة"

    try:
        result = conjugator.conjugate(
            trimmed,
            future_type=ft,
            alltense=True,
            past=True,
            future=True,
            passive=passive,
            imperative=True,
            future_moode=True,
            confirmed=True,
            transitive=transitive,
            display_format="DICT",
        )
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Gagal mengonjugasikan verba '{verb}': {e}",
        )

    if not result:
        raise HTTPException(
            status_code=422,
            detail=f"Verba '{verb}' tidak dapat dikonjugasikan oleh mesin Qutrub.",
        )

    return {
        "verb": trimmed,
        "future_type": ft,
        "transitive": transitive,
        "conjugation": result,
    }


@app.post("/conjugate")
@app.post("/api/conjugate")
def conjugate_post(payload: ConjugationRequest):
    return conjugate(
        verb=payload.verb,
        future_type=payload.future_type,
        transitive=payload.transitive,
        passive=payload.passive,
    )
