"""Add unique constraint to users.email

Revision ID: 0005_add_unique_user_email
Revises: 0004_rename_metadata_columns
Create Date: 2025-12-09
"""

from alembic import op
import sqlalchemy as sa

revision = "0005_add_unique_user_email"
down_revision = "0004_rename_metadata_columns"
branch_labels = None
depends_on = None


def upgrade():
    # Using a try/except could hide issues; rely on Postgres to enforce uniqueness.
    op.create_unique_constraint("uq_users_email", "users", ["email"])


def downgrade():
    op.drop_constraint("uq_users_email", "users", type_="unique")
