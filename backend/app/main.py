# エントリーポイント
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI(
    title="Tanuki Learning API",
    description="API for Tanuki Learning platform",
    version="0.1.0"
)

# フロンロントエンド(React)からのリクエストを許可するためのCORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Viteのデフォルトポート
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

# 動作確認用のルート
@app.get("/")
def read_root():
    return {"message": "Welcome to Tanuki Learning!"}
