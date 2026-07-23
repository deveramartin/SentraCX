"""Unit tests for the PII anonymizer helper."""

from app.helpers.anonymizer import redact_pii


def test_redact_emails():
    text = "Please contact me at john.doe@example.com or support@company.org."
    expected = "Please contact me at [EMAIL] or [EMAIL]."
    assert redact_pii(text) == expected


def test_redact_phone_numbers():
    assert redact_pii("Call me at 123-456-7890.") == "Call me at [PHONE]."
    assert redact_pii("Reach out at +1 (555) 123-4567!") == "Reach out at [PHONE]!"
    assert redact_pii("My number is 555 123 4567.") == "My number is [PHONE]."


def test_redact_ssn():
    assert redact_pii("My SSN is 123-45-6789.") == "My SSN is [SSN]."


def test_redact_credit_cards():
    assert redact_pii("Card number: 1234-5678-9012-3456.") == "Card number: [CREDIT_CARD]."
    assert redact_pii("Visa card 1234 5678 9012 3456") == "Visa card [CREDIT_CARD]"
    # Ensure standard numbers that aren't CC length aren't redact as CC
    assert redact_pii("Version number 1234567") == "Version number 1234567"


def test_redact_mixed_text():
    text = (
        "Customer john@doe.com called from 555-123-4567 regarding transaction "
        "on card 1111-2222-3333-4444 (SSN 000-12-3456)."
    )
    expected = (
        "Customer [EMAIL] called from [PHONE] regarding transaction "
        "on card [CREDIT_CARD] (SSN [SSN])."
    )
    assert redact_pii(text) == expected
