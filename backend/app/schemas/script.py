# app/schemas/script.py
from pydantic import BaseModel


# --- Script ---

class ScriptBase(BaseModel):
    text: str
    order: int


class ScriptResponse(ScriptBase):
    id: int
    chapter_id: int

    class Config:
        from_attributes = True


# --- Chapter ---


class ChapterBase(BaseModel):
    title: str
    description: str | None = None
    order: int


class ChapterResponse(ChapterBase):
    id: int
    course_id: int
    scripts: list[ScriptResponse] = []
    dependency_ids: list[int] = []  # 前提チャプターのID一覧

    class Config:
        from_attributes = True


# --- Course ---


class CourseBase(BaseModel):
    title: str
    description: str | None = None
    icon: str | None = None
    order: int


class CourseResponse(CourseBase):
    id: int
    chapters: list[ChapterResponse] = []

    class Config:
        from_attributes = True
