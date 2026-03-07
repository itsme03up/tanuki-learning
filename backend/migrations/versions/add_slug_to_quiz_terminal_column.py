"""
Add slug column to quizzes, terminals, columns (idempotent, SQLite-safe)
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = 'add_slug_to_quiz_terminal_column'
down_revision = 'f141a6c900da'
branch_labels = None
depends_on = None

def column_exists(table_name, column_name, bind):
    inspector = inspect(bind)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns

def upgrade():
    bind = op.get_bind()
    # Add slug columns if not present
    for table in ['quizzes', 'terminals', 'columns']:
        if not column_exists(table, 'slug', bind):
            with op.batch_alter_table(table) as batch_op:
                batch_op.add_column(sa.Column('slug', sa.String(length=64), nullable=True))
    # Add unique indexes (SQLite-safe)
    for table in ['quizzes', 'terminals', 'columns']:
        idx_name = f'{table}_slug_unique_idx'
        op.create_index(idx_name, table, ['slug'], unique=True)

def downgrade():
    for table in ['quizzes', 'terminals', 'columns']:
        idx_name = f'{table}_slug_unique_idx'
        op.drop_index(idx_name, table_name=table)
        with op.batch_alter_table(table) as batch_op:
            batch_op.drop_column('slug')
