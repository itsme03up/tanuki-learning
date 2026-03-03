# app/routers/script.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.script import CourseResponse, ChapterResponse
from app.cruds import script as crud

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
