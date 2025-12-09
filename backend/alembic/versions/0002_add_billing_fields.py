from alembic import op
import sqlalchemy as sa

revision = '0002_add_billing_fields'
down_revision = '0001_init'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tenants', sa.Column('stripe_customer_id', sa.String(), nullable=True))
    op.add_column('tenants', sa.Column('stripe_subscription_id', sa.String(), nullable=True))
    op.add_column('tenants', sa.Column('billing_status', sa.String(), nullable=False, server_default='trial'))
    op.add_column('tenants', sa.Column('trial_mode', sa.String(), nullable=True))
    op.add_column('tenants', sa.Column('trial_ends_at', sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column('tenants', 'trial_ends_at')
    op.drop_column('tenants', 'trial_mode')
    op.drop_column('tenants', 'billing_status')
    op.drop_column('tenants', 'stripe_subscription_id')
    op.drop_column('tenants', 'stripe_customer_id')
