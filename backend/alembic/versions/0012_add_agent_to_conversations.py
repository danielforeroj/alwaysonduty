"""Add agent relation to conversations"""

from alembic import op
import sqlalchemy as sa

revision = "0012_add_agent_to_conversations"
down_revision = "0011_end_user_gating"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "conversations",
        sa.Column(
            "agent_id",
            sa.dialects.postgresql.UUID(as_uuid=True),
            sa.ForeignKey("agents.id"),
            nullable=True,
        ),
    )


def downgrade():
    op.drop_column("conversations", "agent_id")
