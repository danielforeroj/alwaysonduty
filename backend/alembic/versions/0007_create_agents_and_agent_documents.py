from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0007_create_agents_and_agent_documents"
down_revision = "0006_fix_user_email_uniqueness"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "agents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tenants.id"), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="draft"),
        sa.Column("model_provider", sa.String(length=50), nullable=False, server_default="groq"),
        sa.Column("model_name", sa.String(length=100), nullable=False, server_default="llama-3.1-70b"),
        sa.Column("training_mode", sa.String(length=30), nullable=False, server_default="prompt_only"),
        sa.Column("job_and_company_profile", sa.JSON(), nullable=False),
        sa.Column("customer_profile", sa.JSON(), nullable=False),
        sa.Column("data_profile", sa.JSON(), nullable=True),
        sa.Column("allowed_websites", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("slug", name="uq_agents_slug"),
    )

    op.create_table(
        "agent_documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("agent_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=100), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("data", sa.LargeBinary(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )


def downgrade():
    op.drop_table("agent_documents")
    op.drop_table("agents")
