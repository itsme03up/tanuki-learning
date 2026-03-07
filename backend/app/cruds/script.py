# app/cruds/script.py
from sqlalchemy.orm import Session
from app.models.script import (
    Course,
    Chapter,
    ChapterDependency,
    Script,
    Quiz,
    QuizChoice,
    Terminal,
)
from app.models.script import Column as ColumnModel


def get_quizzes_by_chapter(db: Session, chapter_id: int) -> list[Quiz]:
    """指定したチャプターのクイズを取得する"""
    return (
        db.query(Quiz)
        .filter(Quiz.chapter_id == chapter_id)
        .order_by(Quiz.order)
        .all()
    )


def get_quiz_choices_by_quiz(db: Session, quiz_id: int) -> list[QuizChoice]:
    """指定したクイズの選択肢を取得する"""
    return (
        db.query(QuizChoice)
        .filter(QuizChoice.quiz_id == quiz_id)
        .order_by(QuizChoice.id)
        .all()
    )


def get_terminals_by_chapter(db: Session, chapter_id: int) -> list[Terminal]:
    return (
        db.query(Terminal)
        .filter(Terminal.chapter_id == chapter_id)
        .order_by(Terminal.order)
        .all()
    )


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
    db: Session,
    title: str,
    description: str | None,
    icon: str | None,
    order: int,
    category: str | None = None,  # 追加
) -> Course:
    course = Course(
        title=title,
        description=description,
        icon=icon,
        order=order,
        category=category,
    )
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


def create_quiz(
    db: Session,
    chapter_id: int,
    question: str,
    explanation: str | None,
    order: int,
    slug: str | None = None,
) -> Quiz:
    quiz = Quiz(
        chapter_id=chapter_id,
        question=question,
        explanation=explanation,
        order=order,
        slug=slug,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


def create_quiz_choice(
    db: Session, quiz_id: int, text: str, is_correct: bool
) -> QuizChoice:
    choice = QuizChoice(
        quiz_id=quiz_id, text=text, is_correct=1 if is_correct else 0
    )
    db.add(choice)
    db.commit()
    db.refresh(choice)
    return choice


def create_terminal(
    db: Session,
    chapter_id: int,
    description: str,
    command_template: str,
    answer: str,
    hint: str | None,
    explanation: str | None,
    order: int,
    slug: str | None = None,
) -> Terminal:
    terminal = Terminal(
        chapter_id=chapter_id,
        description=description,
        command_template=command_template,
        answer=answer,
        hint=hint,
        explanation=explanation,
        order=order,
        slug=slug,
    )
    db.add(terminal)
    db.commit()
    db.refresh(terminal)
    return terminal


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


def create_script(
    db: Session, chapter_id: int, text: str, order: int
) -> Script:
    """スクリプトを新規作成する"""
    script = Script(chapter_id=chapter_id, text=text, order=order)
    db.add(script)
    db.commit()
    db.refresh(script)
    return script


def create_column(
    db: Session,
    chapter_id: int,
    title: str,
    content: str,
    category: str | None,
    order: int,
    slug: str | None = None,
):
    col = ColumnModel(
        chapter_id=chapter_id,
        title=title,
        content=content,
        category=category,
        order=order,
        slug=slug,
    )
    db.add(col)
    db.commit()
    db.refresh(col)
    return col


def get_columns_by_chapter(db: Session, chapter_id: int):
    return (
        db.query(ColumnModel)
        .filter(ColumnModel.chapter_id == chapter_id)
        .order_by(ColumnModel.order)
        .all()
    )


def get_all_columns(db: Session):
    return (
        db.query(ColumnModel)
        .order_by(ColumnModel.chapter_id, ColumnModel.order)
        .all()
    )


def get_quiz_by_slug(db, slug):
    return db.query(Quiz).filter_by(slug=slug).first()


def get_terminal_by_slug(db, slug):
    return db.query(Terminal).filter_by(slug=slug).first()


def get_column_by_slug(db, slug):
    return db.query(ColumnModel).filter_by(slug=slug).first()
