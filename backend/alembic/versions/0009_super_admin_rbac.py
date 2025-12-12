"""Add super admin RBAC fields and tenant overrides

Revision ID: 0009_super_admin_rbac
Revises: 0008_update_agent_model_defaults
Create Date: 2024-06-01
"""

from alembic import op
import sqlalchemy as sa


revision = "0009_super_admin_rbac"
down_revision = "0008_update_agent_model_defaults"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "tenants",
        sa.Column(
            "is_special_permissioned",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    op.add_column(
        "tenants",
        sa.Column("trial_days_override", sa.Integer(), nullable=True),
    )
    op.add_column("tenants", sa.Column("card_required", sa.Boolean(), nullable=True))
    op.alter_column(
        "tenants",
        "is_special_permissioned",
        server_default=None,
    )

    op.add_column(
        "users",
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    op.add_column(
        "users", sa.Column("last_login", sa.DateTime(), nullable=True)
    )
    op.alter_column(
        "users",
        "role",
        existing_type=sa.String(),
        server_default="TENANT_ADMIN",
        existing_server_default=None,
    )
    op.execute("UPDATE users SET role = 'TENANT_ADMIN' WHERE role = 'admin'")
    op.alter_column("users", "is_active", server_default=None)


def downgrade():
    op.execute("UPDATE users SET role = 'admin' WHERE role = 'TENANT_ADMIN'")
    op.alter_column(
        "users",
        "role",
        existing_type=sa.String(),
        server_default=None,
        existing_server_default="TENANT_ADMIN",
    )
    op.drop_column("users", "last_login")
    op.drop_column("users", "is_active")

    op.drop_column("tenants", "card_required")
    op.drop_column("tenants", "trial_days_override")
    op.drop_column("tenants", "is_special_permissioned")
