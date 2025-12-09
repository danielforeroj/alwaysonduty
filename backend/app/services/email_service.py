from datetime import datetime
from typing import Any, Dict, Optional

import resend
from fastapi import BackgroundTasks

from app.config import get_settings
from app.models.tenant import Tenant
from app.models.user import User

settings = get_settings()


def _configure_resend_client() -> bool:
    """Configure the Resend client. Returns False if configuration is missing."""
    if not settings.resend_api_key or not settings.resend_from_email:
        return False

    resend.api_key = settings.resend_api_key
    return True


def _send_email(to_email: str, subject: str, html: str, tags: Optional[Dict[str, str]] = None) -> None:
    if not _configure_resend_client():
        return

    params: Dict[str, Any] = {
        "from": settings.resend_from_email,
        "to": [to_email],
        "subject": subject,
        "html": html,
    }

    if tags:
        params["tags"] = [{"name": key, "value": value} for key, value in tags.items()]

    try:
        resend.Emails.send(params)  # type: ignore[attr-defined]
    except Exception:
        return


def queue_email(background_tasks: BackgroundTasks, fn, *args, **kwargs) -> None:
    background_tasks.add_task(fn, *args, **kwargs)


def send_account_creation_email(user: User, tenant: Tenant) -> None:
    subject = "Welcome to OnDuty"
    html = f"""
    <p>Hi {user.email},</p>
    <p>Welcome to <strong>OnDuty</strong>! Your account for <strong>{tenant.name}</strong> has been created.</p>
    <p>You can now log in, configure your agents, and start handling sales & support 24/7.</p>
    <p>— The OnDuty Team</p>
    """
    _send_email(user.email, subject, html, tags={"category": "account_creation"})


def send_email_verification_email(user: User, verification_token: str, frontend_base_url: str) -> None:
    verify_url = f"{frontend_base_url}/verify-email?token={verification_token}"
    subject = "Verify your email for OnDuty"
    html = f"""
    <p>Hi {user.email},</p>
    <p>Thanks for creating an account with <strong>OnDuty</strong>.</p>
    <p>Please confirm your email by clicking the link below:</p>
    <p><a href="{verify_url}">Verify my email</a></p>
    <p>If you did not create this account, you can safely ignore this email.</p>
    """
    _send_email(user.email, subject, html, tags={"category": "email_verification"})


def send_password_reset_email(user: User, reset_token: str, frontend_base_url: str) -> None:
    reset_url = f"{frontend_base_url}/reset-password?token={reset_token}"
    subject = "Reset your password for OnDuty"
    html = f"""
    <p>Hi {user.email},</p>
    <p>We received a request to reset your OnDuty password.</p>
    <p>You can reset it by clicking the link below:</p>
    <p><a href="{reset_url}">Reset my password</a></p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
    """
    _send_email(user.email, subject, html, tags={"category": "password_reset"})


def send_trial_ending_email(user: User, tenant: Tenant, days_left: int) -> None:
    subject = "Your OnDuty trial is ending soon"
    html = f"""
    <p>Hi {user.email},</p>
    <p>Your OnDuty trial for <strong>{tenant.name}</strong> will end in <strong>{days_left} day(s)</strong>.</p>
    <p>To avoid interruptions, make sure your billing is set up and your plan is active.</p>
    <p>— The OnDuty Team</p>
    """
    _send_email(user.email, subject, html, tags={"category": "trial_ending"})


def send_trial_ended_email(user: User, tenant: Tenant) -> None:
    subject = "Your OnDuty trial has ended"
    html = f"""
    <p>Hi {user.email},</p>
    <p>Your trial for <strong>{tenant.name}</strong> has ended.</p>
    <p>Your agents may be paused. To reactivate them, choose a plan and add your billing details.</p>
    <p>— The OnDuty Team</p>
    """
    _send_email(user.email, subject, html, tags={"category": "trial_ended"})


def send_plan_subscription_email(user: User, tenant: Tenant, plan_type: str) -> None:
    subject = "Your OnDuty subscription is active"
    html = f"""
    <p>Hi {user.email},</p>
    <p>Your subscription for <strong>{tenant.name}</strong> is now active on the <strong>{plan_type.title()}</strong> plan.</p>
    <p>You can manage your plan from your OnDuty dashboard.</p>
    <p>— The OnDuty Team</p>
    """
    _send_email(user.email, subject, html, tags={"category": "plan_subscription"})


def send_renewal_notification_email(
    user: User, tenant: Tenant, plan_type: str, renewal_date: Optional[datetime] = None
) -> None:
    date_str = renewal_date.strftime("%Y-%m-%d") if renewal_date else "today"
    subject = "Your OnDuty subscription has renewed"
    html = f"""
    <p>Hi {user.email},</p>
    <p>Your <strong>{plan_type.title()}</strong> subscription for <strong>{tenant.name}</strong> has renewed on {date_str}.</p>
    <p>If this was unexpected, please review your billing settings in your dashboard.</p>
    <p>— The OnDuty Team</p>
    """
    _send_email(user.email, subject, html, tags={"category": "renewal"})


def send_usage_report_email(user: User, tenant: Tenant, period: str, summary_text: str) -> None:
    subject = f"Your {period.capitalize()} OnDuty report"
    html = f"""
    <p>Hi {user.email},</p>
    <p>Here is your <strong>{period}</strong> usage report for <strong>{tenant.name}</strong>:</p>
    <pre style="white-space: pre-wrap; font-family: system-ui, sans-serif;">{summary_text}</pre>
    <p>— The OnDuty Team</p>
    """
    _send_email(user.email, subject, html, tags={"category": f"{period}_report"})


def send_suspicious_activity_email(user: User, tenant: Tenant, details: str) -> None:
    subject = "Suspicious activity detected in your OnDuty agents"
    html = f"""
    <p>Hi {user.email},</p>
    <p>We detected suspicious or potentially abusive activity in your agents for <strong>{tenant.name}</strong>.</p>
    <p>Details:</p>
    <pre style="white-space: pre-wrap; font-family: system-ui, sans-serif;">{details}</pre>
    <p>If this looks unfamiliar, consider reviewing your configurations and access settings.</p>
    <p>— The OnDuty Team</p>
    """
    _send_email(user.email, subject, html, tags={"category": "suspicious_activity"})
