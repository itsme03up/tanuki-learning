# DB接続設定
# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

# データベースURLを環境変数から取得（なければSQLiteを使用）
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tanuki.db")

# SQLAlchemyエンジンの作成
# connect_args はSQLite使用時のみ必要な設定
engine = create_engine(
    DATABASE_URL,
    connect_args=({"check_same_thread": False} if "sqlite" in DATABASE_URL else {}),
)

# セッションの作成（DBとのやり取りに使う）
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデル定義の基底クラス
Base = declarative_base()


# APIのエンドポイントごとにDBセッションを提供する関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
