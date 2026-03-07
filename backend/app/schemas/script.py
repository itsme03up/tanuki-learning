# app/schemas/script.py
from pydantic import BaseModel, ConfigDict

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
    category: str | None = None


class CourseResponse(CourseBase):
    id: int
    chapters: list[ChapterResponse] = []

    class Config:
        from_attributes = True


# --- Quiz ---


class QuizChoiceResponse(BaseModel):
    id: int
    text: str
    is_correct: int

    class Config:
        from_attributes = True


class QuizResponse(BaseModel):
    id: int
    chapter_id: int
    question: str
    explanation: str | None = None
    order: int
    choices: list[QuizChoiceResponse] = []

    class Config:
        from_attributes = True


# --- Terminal ---
class TerminalResponse(BaseModel):
    id: int
    chapter_id: int
    description: str
    command_template: str
    answer: str
    hint: str | None = None
    explanation: str | None = None
    order: int

    class Config:
        from_attributes = True


class ColumnResponse(BaseModel):
    id: int
    chapter_id: int
    title: str
    content: str
    category: str | None = None
    order: int

    model_config = ConfigDict(from_attributes=True)
