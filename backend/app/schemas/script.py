# PIのリクエスト・レスポンスの形を定義
# app/schemas/script.py
from pydantic import BaseModel
# --- Script（セリフ）---

class ScriptBase(BaseModel):
    """セリフの基本項目"""
    character: str  # "tanuki" or "student"
    text: str       # セリフ内容
    order: int      # 表示順

class ScriptResponse(ScriptBase):
    """APIレスポンス用（DBのidを含む）"""
    id: int

    class Config:
        from_attributes = True  # SQLAlchemyモデルから変換を許可


# --- Chapter（章）---

class ChapterBase(BaseModel):
    """章の基本項目"""
    title: str
    description: str | None = None  # 任意項目
    order: int

class ChapterResponse(ChapterBase):
    """APIレスポンス用（セリフ一覧を含む）"""
    id: int
    scripts: list[ScriptResponse] = []

    class Config:
        from_attributes = True
