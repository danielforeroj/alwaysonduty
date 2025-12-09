"""
Rename reserved metadata columns
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0004_rename_metadata_columns"
down_revision = "0003_email_pw_tokens"
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column("channel_identities", "metadata", new_column_name="meta")
    op.alter_column("messages", "metadata", new_column_name="meta")


def downgrade():
    op.alter_column("channel_identities", "meta", new_column_name="metadata")
    op.alter_column("messages", "meta", new_column_name="metadata")
