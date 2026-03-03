# app/cruds/script.py
from sqlalchemy.orm import Session
from app.models.script import Course, Chapter, ChapterDependency, Script


def get_all_courses(db: Session) -> list[Course]:
    """全コースを表示順で取得する"""
    return db.query(Course).order_by(Course.order).all()


def get_course(db: Session, course_id: int) -> Course | None:
    """指定したコースを取得する"""
    return db.query(Course).filter(Course.id == course_id).first()


def get_all_chapters(db: Session) -> list[Chapter]:
    """全チャプターを取得する"""
    return db.query(Chapter).order_by(Chapter.order).all()


def get_chapter_with_scripts(db: Session, chapter_id: int) -> Chapter | None:
    """指定したチャプターとスクリプトを取得する"""
    return db.query(Chapter).filter(Chapter.id == chapter_id).first()


def get_chapter_dependencies(db: Session, chapter_id: int) -> list[int]:
    """指定チャプターの前提チャプターIDリストを取得する"""
    deps = (
        db.query(ChapterDependency)
        .filter(ChapterDependency.chapter_id == chapter_id)
        .all()
    )
    return [d.requires_chapter_id for d in deps]


def create_course(
    db: Session, title: str, description: str | None, icon: str | None, order: int
) -> Course:
    """コースを新規作成する"""
    course = Course(title=title, description=description, icon=icon, order=order)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def create_chapter(
    db: Session,
    course_id: int,
    title: str,
    description: str | None = None,  # デフォルトNoneを追加
    order: int = 0,
) -> Chapter:
    """チャプターを新規作成する"""
    chapter = Chapter(
        course_id=course_id, title=title, description=description, order=order
    )
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter


def create_dependency(
    db: Session, chapter_id: int, requires_chapter_id: int
) -> ChapterDependency:
    """チャプター間の依存関係を作成する"""
    dep = ChapterDependency(
        chapter_id=chapter_id, requires_chapter_id=requires_chapter_id
    )
    db.add(dep)
    db.commit()
    db.refresh(dep)
    return dep


def create_script(db: Session, chapter_id: int, text: str, order: int) -> Script:
    """スクリプトを新規作成する"""
    script = Script(chapter_id=chapter_id, text=text, order=order)
    db.add(script)
    db.commit()
    db.refresh(script)
    return script
