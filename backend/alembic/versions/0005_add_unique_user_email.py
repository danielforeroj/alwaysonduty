"""Add unique constraint to users.email

Revision ID: 0005_add_unique_user_email
Revises: 0004_rename_metadata_columns
Create Date: 2025-12-09
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision = "0005_add_unique_user_email"
down_revision = "0004_rename_metadata_columns"
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()

    # Normalize existing emails to lowercase for consistent uniqueness checks.
    conn.execute(text("UPDATE users SET email = LOWER(email)"))

    # De-duplicate any leftover records sharing the same email by appending a suffix.
    conn.execute(
        text(
            """
            WITH duplicates AS (
                SELECT id, email, ROW_NUMBER() OVER (
                    PARTITION BY email ORDER BY created_at NULLS FIRST, id
                ) AS rn
                FROM users
            )
            UPDATE users u
            SET email = CONCAT(u.email, '+dup', duplicates.rn - 1)
            FROM duplicates
            WHERE u.id = duplicates.id AND duplicates.rn > 1
            """
        )
    )

    op.create_unique_constraint("uq_users_email", "users", ["email"])


def downgrade():
    op.drop_constraint("uq_users_email", "users", type_="unique")
