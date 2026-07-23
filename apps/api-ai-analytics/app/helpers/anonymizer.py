"""PII anonymization helper module."""

import re

# Precompiled regex patterns for performance
_EMAIL_RE = re.compile(
    r"\b[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\b"
)
_PHONE_RE = re.compile(
    r"\+?\b(?:\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
)
_SSN_RE = re.compile(
    r"\b\d{3}-\d{2}-\d{4}\b"
)
_CREDIT_CARD_RE = re.compile(
    r"\b(?:\d[ -]*?){13,19}\b"
)


def redact_pii(text: str) -> str:
    """Redacts PII from the input text.

    Replaces emails, phone numbers, SSNs, and credit cards with placeholders
    to avoid leaks to external APIs.
    """
    if not text:
        return text

    # Redact Emails
    text = _EMAIL_RE.sub("[EMAIL]", text)

    # Redact SSNs
    text = _SSN_RE.sub("[SSN]", text)

    # Redact Credit Cards (make sure it's not a generic number series, but a CC)
    # Simple regex matches digits with spaces/hyphens totaling 13-19 digits
    # Let's filter digits only to confirm length
    def cc_replacer(match):
        val = match.group(0)
        digits = "".join(c for c in val if c.isdigit())
        if 13 <= len(digits) <= 19:
            return "[CREDIT_CARD]"
        return val

    text = _CREDIT_CARD_RE.sub(cc_replacer, text)

    # Redact Phone Numbers
    text = _PHONE_RE.sub("[PHONE]", text)

    return text
