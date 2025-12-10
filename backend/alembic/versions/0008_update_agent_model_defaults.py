from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0008_update_agent_model_defaults"
down_revision = "0008_add_agent_type_to_agents"
branch_labels = None
depends_on = None


def upgrade():
    # Allow model_name to be NULL and remove any DB-level default.
    op.alter_column(
        "agents",
        "model_name",
        existing_type=sa.String(length=100),
        nullable=True,
        server_default=None,
    )


def downgrade():
    # If ever downgraded, restore NOT NULL + a default.
    op.alter_column(
        "agents",
        "model_name",
        existing_type=sa.String(length=100),
        nullable=False,
        server_default="llama-3.1-70b",
    )
