# app/models/script.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    """コース（Linux・Pythonなど大きな括り）"""

    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)  # コース名
    description = Column(Text, nullable=True)  # コースの説明
    category = Column(String(50), nullable=True)  # カテゴリー（例: "Linux", "Python"）
    icon = Column(String(10), nullable=True)  # 絵文字アイコン
    order = Column(Integer, nullable=False, default=0)  # 表示順

    chapters = relationship("Chapter", back_populates="course")


class Chapter(Base):
    """章（各コースの中のトピック）"""
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, nullable=False, default=0)

    course = relationship("Course", back_populates="chapters")
    scripts = relationship("Script", back_populates="chapter")
    # このchapterが必要とする前提チャプター
    dependencies = relationship(
        "ChapterDependency",
        foreign_keys="ChapterDependency.chapter_id",
        back_populates="chapter",
    )
    quizzes = relationship("Quiz", back_populates="chapter")
    terminals = relationship("Terminal", back_populates="chapter")


class ChapterDependency(Base):
    """チャプター間の依存関係（前提条件）"""

    __tablename__ = "chapter_dependencies"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    requires_chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)

    chapter = relationship(
        "Chapter", foreign_keys=[chapter_id], back_populates="dependencies"
    )


class Script(Base):
    """学習コンテンツ（テキスト）"""
    __tablename__ = "scripts"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    character = Column(String(20), nullable=True)
    text = Column(Text, nullable=False)
    order = Column(Integer, nullable=False, default=0)

    chapter = relationship("Chapter", back_populates="scripts")


class Quiz(Base):
    """クイズ問題"""

    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    question = Column(Text, nullable=False)  # 問題文
    explanation = Column(Text, nullable=True)  # 解説文
    order = Column(Integer, nullable=False, default=0)

    chapter = relationship("Chapter", back_populates="quizzes")
    choices = relationship("QuizChoice", back_populates="quiz")


class QuizChoice(Base):
    """クイズの選択肢"""

    __tablename__ = "quiz_choices"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    text = Column(Text, nullable=False)  # 選択肢テキスト
    is_correct = Column(Integer, nullable=False, default=0)  # 1=正解

    quiz = relationship("Quiz", back_populates="choices")


class Terminal(Base):
    """コマンド穴埋め問題"""

    __tablename__ = "terminals"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    description = Column(Text, nullable=False)  # 問題の説明
    command_template = Column(Text, nullable=False)  # 例: "chmod ___ file.txt"
    answer = Column(Text, nullable=False)  # 正解コマンド
    hint = Column(Text, nullable=True)  # ヒント
    explanation = Column(Text, nullable=True)  # 解説
    order = Column(Integer, nullable=False, default=0)

    chapter = relationship("Chapter", back_populates="terminals")
