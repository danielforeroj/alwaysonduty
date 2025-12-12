"""add user name column

Revision ID: 0010_add_user_name
Revises: 0009_super_admin_rbac
Create Date: 2025-01-01 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0010_add_user_name"
down_revision = "0009_super_admin_rbac"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("name", sa.String(), nullable=True))


def downgrade():
    op.drop_column("users", "name")
