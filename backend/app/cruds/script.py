# DB操作ロジック
# app/cruds/script.py
from sqlalchemy.orm import Session
from app.models.script import Chapter, Script


def get_all_chapters(db: Session) -> list[Chapter]:
    """全ての章を表示順で取得する"""
    return db.query(Chapter).order_by(Chapter.order).all()


def get_chapter_with_scripts(db: Session, chapter_id: int) -> Chapter | None:
    """指定した章とそのセリフ一覧を取得する"""
    return db.query(Chapter).filter(Chapter.id == chapter_id).first()


def create_chapter(db: Session, title: str, description: str | None, order: int) -> Chapter:
    """章を新規作成する"""
    chapter = Chapter(title=title, description=description, order=order)
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter


def create_script(db: Session, chapter_id: int, character: str, text: str, order: int) -> Script:
    """セリフを新規作成する"""
    script = Script(
        chapter_id=chapter_id,
        character=character,
        text=text,
        order=order
    )
    db.add(script)
    db.commit()
    db.refresh(script)
    return script