"""Fix user email uniqueness with normalization and deduplication

Revision ID: 0006_fix_user_email_uniqueness
Revises: 0005_add_unique_user_email
Create Date: 2025-12-09
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision = "0006_fix_user_email_uniqueness"
down_revision = "0005_add_unique_user_email"
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()

    # Drop existing unique constraint if present to allow cleanup.
    try:
        op.drop_constraint("uq_users_email", "users", type_="unique")
    except Exception:
        conn.execute(text("""
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'uq_users_email'
                        AND table_name = 'users'
                ) THEN
                    ALTER TABLE users DROP CONSTRAINT uq_users_email;
                END IF;
            END$$;
        """))

    # Normalize emails: trim whitespace and lowercase
    conn.execute(text("UPDATE users SET email = LOWER(BTRIM(email))"))

    # Deduplicate within normalized values by appending suffixes
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
            WHERE u.id = duplicates.id AND duplicates.rn > 1;
            """
        )
    )

    op.create_unique_constraint("uq_users_email", "users", ["email"])


def downgrade():
    op.drop_constraint("uq_users_email", "users", type_="unique")
