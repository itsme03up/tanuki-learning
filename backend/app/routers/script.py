# app/routers/script.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.script import (
    CourseResponse,
    ChapterResponse,
    QuizResponse,
    TerminalResponse,
)
from app.cruds import script as crud
from app.cruds.script import get_columns_by_chapter
from app.schemas.script import ColumnResponse

router = APIRouter(
    prefix="/api",
    tags=["voyager"],
)


@router.get("/courses", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    """全コース一覧を取得する"""
    return crud.get_all_courses(db)


@router.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    """指定したコースを取得する"""
    course = crud.get_course(db, course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="コースが見つかりません")
    return course


@router.get("/chapters", response_model=list[ChapterResponse])
def get_chapters(db: Session = Depends(get_db)):
    """全チャプター一覧を取得する"""
    chapters = crud.get_all_chapters(db)
    # 各チャプターの依存関係を付加する
    for chapter in chapters:
        chapter.dependency_ids = crud.get_chapter_dependencies(db, chapter.id)
    return chapters


@router.get("/chapters/{chapter_id}", response_model=ChapterResponse)
def get_chapter(chapter_id: int, db: Session = Depends(get_db)):
    """指定したチャプターとスクリプトを取得する"""
    chapter = crud.get_chapter_with_scripts(db, chapter_id)
    if chapter is None:
        raise HTTPException(status_code=404, detail="チャプターが見つかりません")
    chapter.dependency_ids = crud.get_chapter_dependencies(db, chapter_id)
    return chapter


@router.get("/chapters/{chapter_id}/quizzes", response_model=list[QuizResponse])
def get_quizzes(chapter_id: int, db: Session = Depends(get_db)):
    """指定チャプターのクイズ一覧を取得する"""
    return crud.get_quizzes_by_chapter(db, chapter_id)


@router.get("/chapters/{chapter_id}/terminals", response_model=list[TerminalResponse])
def get_terminals(chapter_id: int, db: Session = Depends(get_db)):
    """指定チャプターのターミナル問題一覧を取得する"""
    return crud.get_terminals_by_chapter(db, chapter_id)


@router.get("/chapters/{chapter_id}/columns", response_model=list[ColumnResponse])
def get_columns(chapter_id: int, db: Session = Depends(get_db)):
    return get_columns_by_chapter(db, chapter_id)


@router.get("/columns", response_model=list[ColumnResponse])
def get_all_columns(db: Session = Depends(get_db)):
    from app.cruds.script import get_all_columns as _get_all_columns

    return _get_all_columns(db)
