"""Add customer metadata and end user verification"""

from alembic import op
import sqlalchemy as sa

revision = "0011_end_user_gating"
down_revision = "0010_add_user_name"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("customers", sa.Column("first_name", sa.String(), nullable=True))
    op.add_column("customers", sa.Column("last_name", sa.String(), nullable=True))
    op.add_column("customers", sa.Column("last_seen_at", sa.DateTime(), nullable=True))
    op.add_column("customers", sa.Column("source", sa.String(), nullable=True))

    op.create_table(
        "end_user_verifications",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("customer_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("customers.id"), nullable=False),
        sa.Column("code_hash", sa.String(), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("consumed_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )


def downgrade():
    op.drop_table("end_user_verifications")
    op.drop_column("customers", "source")
    op.drop_column("customers", "last_seen_at")
    op.drop_column("customers", "last_name")
    op.drop_column("customers", "first_name")
