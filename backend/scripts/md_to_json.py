# scripts/md_to_json.py
import sys
import json
import re
from pathlib import Path


def parse_md(filepath: str) -> dict:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # chapter_id取得
    chapter_id_match = re.search(r'#\s*chapter_id:\s*(\d+)', text)
    if not chapter_id_match:
        raise ValueError("chapter_idが見つかりません")
    chapter_id = int(chapter_id_match.group(1))

    quizzes = []
    terminals = []
    columns = []

    # セクション分割
    sections = re.split(r'^##\s+', text, flags=re.MULTILINE)

    for section in sections:
        if section.startswith('QUIZ'):
            quizzes = parse_quizzes(section)
        elif section.startswith('TERMINAL'):
            terminals = parse_terminals(section)
        elif section.startswith('COLUMN'):
            columns = parse_columns(section)

    return {
        "chapter_id": chapter_id,
        "quizzes": quizzes,
        "terminals": terminals,
        "columns": columns,
    }


def parse_quizzes(section: str) -> list:
    quizzes = []
    # Q:で始まるブロックを分割
    blocks = re.split(r'\n(?=Q:)', section)
    order = 1

    for block in blocks:
        lines = block.strip().splitlines()
        q = {}
        choices = []

        for line in lines:
            if line.startswith('Q:'):
                q['question'] = line[2:].strip()
            elif line.startswith('A:'):
                choices.append({"text": line[2:].strip(), "is_correct": True})
            elif line.startswith('W:'):
                choices.append({"text": line[2:].strip(), "is_correct": False})
            elif line.startswith('E:'):
                q['explanation'] = line[2:].strip()

        if 'question' in q and choices:
            quizzes.append({
                "question": q['question'],
                "explanation": q.get('explanation', ''),
                "order": order,
                "choices": choices,
            })
            order += 1

    return quizzes


def parse_terminals(section: str) -> list:
    terminals = []
    blocks = re.split(r'\n(?=D:)', section)
    order = 1

    for block in blocks:
        lines = block.strip().splitlines()
        t = {}

        for line in lines:
            if line.startswith('D:'):
                t['description'] = line[2:].strip()
            elif line.startswith('T:'):
                t['command_template'] = line[2:].strip()
            elif line.startswith('ANS:'):
                t['answer'] = line[4:].strip()
            elif line.startswith('H:'):
                t['hint'] = line[2:].strip()
            elif line.startswith('E:'):
                t['explanation'] = line[2:].strip()

        if 'description' in t and 'answer' in t:
            terminals.append({
                "description": t['description'],
                "command_template": t.get('command_template', '___'),
                "answer": t['answer'],
                "hint": t.get('hint', ''),
                "explanation": t.get('explanation', ''),
                "order": order,
            })
            order += 1

    return terminals


def parse_columns(section: str) -> list:
    columns = []
    # COLUMNブロックをTITLE:で分割
    blocks = re.split(r'\n(?=TITLE:)', section)
    order = 1

    for block in blocks:
        lines = block.strip().splitlines()
        col = {}
        content_lines = []
        in_content = False

        for line in lines:
            if line.startswith('CAT:'):
                col['category'] = line[4:].strip()
            elif line.startswith('TITLE:'):
                col['title'] = line[6:].strip()
            elif line.startswith('CONTENT:'):
                in_content = True
            elif in_content:
                content_lines.append(line)

        if 'title' in col and content_lines:
            col['content'] = '\n'.join(content_lines).strip()
            col['order'] = order
            columns.append(col)
            order += 1

    return columns


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使い方: python scripts/md_to_json.py content/chapter_04.md")
        sys.exit(1)

    filepath = sys.argv[1]
    output_path = Path(filepath).with_suffix('.json')

    data = parse_md(filepath)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ {output_path} を生成しました！")
    print(f"   Quiz: {len(data['quizzes'])}問")
    print(f"   Terminal: {len(data['terminals'])}問")
    print(f"   Column: {len(data['columns'])}件")