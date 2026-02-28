# DBのテーブル定義
# app/models/script.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Chapter(Base):
    """章（学習単元）を表すテーブル"""
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)        # 章のタイトル
    description = Column(Text, nullable=True)          # 章の説明
    order = Column(Integer, nullable=False, default=0) # 表示順

    # 章に紐づくセリフ一覧
    scripts = relationship("Script", back_populates="chapter")


class Script(Base):
    """狸塚先生と主人公の対話セリフを表すテーブル"""
    __tablename__ = "scripts"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    character = Column(String(20), nullable=False)     # "tanuki" or "student"
    text = Column(Text, nullable=False)                # セリフ内容
    order = Column(Integer, nullable=False, default=0) # 章内での表示順

    # 所属する章への参照
    chapter = relationship("Chapter", back_populates="scripts")
