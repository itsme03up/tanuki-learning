# エントリーポイント
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import script as script_router

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI(
    title="CODE VOYAGER API",
    description="小学生〜高校生向けプログラミング学習サイトのバックエンド",
    version="0.1.0",
)

# フロントエンド(React)からのリクエストを許可するためのCORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Viteのデフォルトポート
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

# ルーターを登録
app.include_router(script_router.router)

# 動作確認用のルート
@app.get("/")
def read_root():
    return {"message": "CODE VOYAGER // ONLINE"}
