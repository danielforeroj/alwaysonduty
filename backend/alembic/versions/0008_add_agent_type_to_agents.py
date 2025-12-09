from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0008_add_agent_type_to_agents"
down_revision = "0007_create_agents_and_agent_documents"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "agents",
        sa.Column(
            "agent_type",
            sa.String(length=20),
            nullable=False,
            server_default="customer_service",
        ),
    )


def downgrade():
    op.drop_column("agents", "agent_type")
