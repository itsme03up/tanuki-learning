# scripts/seed_from_json.py
import sys
import json
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.cruds.script import (
    create_quiz,
    create_quiz_choice,
    create_terminal,
    create_column,
    get_quiz_by_slug,
    get_terminal_by_slug,
    get_column_by_slug,
)


def seed_from_json(filepath: str):
    db = SessionLocal()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        chapter_id = data['chapter_id']
        print(f"📖 chapter_id={chapter_id} にデータを投入中...")

        for q in data.get('quizzes', []):
            slug = q.get("slug")
            if slug and get_quiz_by_slug(db, slug):
                print(f"⚠️ quiz slug '{slug}' already exists. Skipping.")
                continue
            quiz = create_quiz(
                db,
                chapter_id=chapter_id,
                question=q["question"],
                explanation=q["explanation"],
                order=q["order"],
                slug=slug,
            )
            for c in q['choices']:
                create_quiz_choice(db, quiz_id=quiz.id, text=c['text'], is_correct=c['is_correct'])

        for t in data.get('terminals', []):
            slug = t.get("slug")
            if slug and get_terminal_by_slug(db, slug):
                print(f"⚠️ terminal slug '{slug}' already exists. Skipping.")
                continue
            create_terminal(
                db,
                chapter_id=chapter_id,
                description=t["description"],
                command_template=t["command_template"],
                answer=t["answer"],
                hint=t["hint"],
                explanation=t["explanation"],
                order=t["order"],
                slug=slug,
            )

        for c in data.get("columns", []):
            slug = c.get("slug")
            if slug and get_column_by_slug(db, slug):
                print(f"⚠️ column slug '{slug}' already exists. Skipping.")
                continue
            create_column(
                db,
                chapter_id=chapter_id,
                title=c["title"],
                content=c["content"],
                category=c.get("category"),
                order=c["order"],
                slug=slug,
            )

        print(f"✅ 完了！")

    except Exception as e:
        db.rollback()
        print(f"❌ エラー: {e}")
    finally:
        db.close()

def seed_all():
    content_dir = Path(__file__).parent.parent / 'content'
    json_files = sorted(content_dir.glob('*.json'))

    if not json_files:
        print("❌ contentディレクトリにJSONファイルが見つかりません")
        return

    for f in json_files:
        seed_from_json(str(f))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # 特定ファイルを指定: python scripts/seed_from_json.py content/chapter_04.json
        seed_from_json(sys.argv[1])
    else:
        # 全ファイルを投入
        seed_all()
