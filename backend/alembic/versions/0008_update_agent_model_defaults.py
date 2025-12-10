from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0008_update_agent_model_defaults"
down_revision = "0008_add_agent_type_to_agents"
branch_labels = None
depends_on = None


def upgrade():
    # 1) Clear out any known bad model IDs so runtime will fall back to env config
    op.execute(
        """
        UPDATE agents
        SET model_name = NULL
        WHERE model_name IN ('llama-3.1-70b', 'llama3-70b-8192');
        """
    )

    # 2) Drop the server default and allow NULLs for model_name
    op.alter_column(
        "agents",
        "model_name",
        existing_type=sa.String(length=100),
        nullable=True,
        server_default=None,
    )


def downgrade():
    # Revert to previous non-nullable column with a default, if needed
    op.alter_column(
        "agents",
        "model_name",
        existing_type=sa.String(length=100),
        nullable=False,
        server_default="llama-3.1-70b",
    )
