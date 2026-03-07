# scripts/seed.py
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.cruds.script import create_course, create_chapter, create_dependency


def seed():
    db = SessionLocal()
    try:
        # --- コース作成 ---

        git = create_course(
            db,
            title="Git",
            icon="🔀",
            description="バージョン管理の基礎",
            category="fundamentals",
            order=0,
        )

        linux = create_course(
            db,
            title="Linux",
            icon="🐧",
            description="OSの基礎",
            category="fundamentals",
            order=1,
        )

        # Programming Language カテゴリ
        python = create_course(
            db,
            title="Python",
            icon="🐍",
            description="自動化スクリプト",
            category="programming_language",
            order=2,
        )
        # go = create_course(db, title="Go", icon="🐹",
        #     description="高速・シンプルな言語", category="programming_language", order=3)
        # ruby = create_course(db, title="Ruby", icon="💎",
        #     description="柔軟なスクリプト言語", category="programming_language", order=4)
        # typescript = create_course(db, title="TypeScript", icon="🔷",
        #     description="型安全なJavaScript", category="programming_language", order=5)

        # Container カテゴリ
        docker = create_course(
            db,
            title="Docker",
            icon="🐳",
            description="コンテナ技術",
            category="container",
            order=6,
        )
        # kubernetes = create_course(db, title="Kubernetes", icon="🚢",
        #     description="コンテナオーケストレーション", category="container", order=7)

        # Cloud カテゴリ
        gcp = create_course(
            db,
            title="GCP",
            icon="☁️",
            description="クラウドインフラ",
            category="cloud",
            order=8,
        )
        # aws = create_course(db, title="AWS", icon="🟠",
        #     description="Amazon クラウド", category="cloud", order=9)
        # azure = create_course(db, title="Azure", icon="🔵",
        #     description="Microsoft クラウド", category="cloud", order=10)

        # IaC カテゴリ
        terraform = create_course(
            db, title="Terraform", icon="🏗️", description="IaC", category="iac", order=11
        )
        ansible = create_course(
            db,
            title="Ansible",
            icon="⚙️",
            description="構成管理",
            category="iac",
            order=12,
        )

        # CI/CD カテゴリ
        # github_actions = create_course(db, title="GitHub Actions", icon="🔄",
        #     description="CI/CDパイプライン", category="cicd", order=13)

        # --- チャプター作成 ---

        # Git
        git_basics = create_chapter(db, course_id=git.id, title="Gitの基礎", order=0)
        git_branch = create_chapter(db, course_id=git.id, title="ブランチ戦略", order=1)
        git_github = create_chapter(db, course_id=git.id, title="GitHub連携", order=2)

        # Linux
        linux_basics = create_chapter(
            db, course_id=linux.id, title="ファイルシステム", order=0
        )
        linux_perm = create_chapter(
            db, course_id=linux.id, title="パーミッション", order=1
        )
        linux_bash = create_chapter(
            db, course_id=linux.id, title="Bashスクリプト", order=2
        )
        linux_net = create_chapter(
            db, course_id=linux.id, title="ネットワークツール", order=3
        )

        # Python
        python_basics = create_chapter(
            db, course_id=python.id, title="Python基礎文法", order=0
        )
        python_script = create_chapter(
            db, course_id=python.id, title="自動化スクリプト", order=1
        )

        # Docker
        docker_basics = create_chapter(
            db, course_id=docker.id, title="コンテナの基礎", order=0
        )
        docker_file = create_chapter(
            db, course_id=docker.id, title="Dockerfile", order=1
        )
        docker_compose = create_chapter(
            db, course_id=docker.id, title="Docker Compose", order=2
        )

        # GCP
        gcp_basics = create_chapter(db, course_id=gcp.id, title="GCPの基礎", order=0)
        gcp_run = create_chapter(db, course_id=gcp.id, title="Cloud Run", order=1)
        gcp_iam = create_chapter(db, course_id=gcp.id, title="IAM・権限管理", order=2)

        # Terraform
        terraform_basics = create_chapter(
            db, course_id=terraform.id, title="IaCの基礎", order=0
        )
        terraform_gcp = create_chapter(
            db, course_id=terraform.id, title="GCPリソース管理", order=1
        )

        # Ansible
        ansible_basics = create_chapter(
            db, course_id=ansible.id, title="Playbookの基礎", order=0
        )
        ansible_roles = create_chapter(
            db, course_id=ansible.id, title="Roles・Inventory", order=1
        )

        # --- 依存関係 ---

        # Linux は Git が前提
        create_dependency(
            db, chapter_id=linux_basics.id, requires_chapter_id=git_basics.id
        )

        # Python は Linux が前提
        create_dependency(
            db, chapter_id=python_basics.id, requires_chapter_id=linux_basics.id
        )

        # Docker は Linux が前提
        create_dependency(
            db, chapter_id=docker_basics.id, requires_chapter_id=linux_basics.id
        )

        # GCP は Docker が前提
        create_dependency(
            db, chapter_id=gcp_basics.id, requires_chapter_id=docker_basics.id
        )

        # Terraform は GCP が前提
        create_dependency(
            db, chapter_id=terraform_basics.id, requires_chapter_id=gcp_basics.id
        )

        # Ansible は Python が前提
        create_dependency(
            db, chapter_id=ansible_basics.id, requires_chapter_id=python_basics.id
        )

        print("✅ シードデータの投入が完了しました！")

    except Exception as e:
        db.rollback()
        print(f"❌ エラー: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
