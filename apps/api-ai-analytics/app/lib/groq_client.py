"""Async client wrapper for Groq's OpenAI-compatible API."""

import asyncio
import json
import logging

from groq import AsyncGroq, APIStatusError, APITimeoutError

logger = logging.getLogger(__name__)


class GroqClientError(Exception):
    """Raised when Groq API communication fails."""


class GroqClient:
    """Async wrapper for Groq LLM inference."""

    def __init__(self, api_key: str, model_id: str = "llama-3.1-8b-instant") -> None:
        self._api_key = api_key
        self._model_id = model_id
        self._max_retries = 3
        self._timeout = 10.0

    async def analyze(self, system_prompt: str, user_prompt: str) -> dict:
        """Send a prompt to Groq and return parsed JSON response.

        Handles rate limiting (429) with exponential backoff.
        Returns parsed dict from JSON response.
        Raises GroqClientError if all retries fail.
        """
        client = AsyncGroq(api_key=self._api_key, timeout=self._timeout)

        for attempt in range(self._max_retries):
            try:
                response = await client.chat.completions.create(
                    model=self._model_id,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1,
                    max_tokens=512,
                )

                content = response.choices[0].message.content
                if not content:
                    raise GroqClientError("Empty response from Groq API")

                return json.loads(content)

            except APIStatusError as e:
                if e.status_code == 429:
                    wait_time = 2 ** attempt
                    logger.warning(
                        "Groq rate limited (429), retrying in %ds (attempt %d/%d)",
                        wait_time, attempt + 1, self._max_retries,
                    )
                    await asyncio.sleep(wait_time)
                    continue
                logger.error("Groq API error: %s", e.message)
                raise GroqClientError(f"Groq API error: {e.message}") from e

            except APITimeoutError as e:
                logger.warning(
                    "Groq timeout (attempt %d/%d)", attempt + 1, self._max_retries
                )
                if attempt == self._max_retries - 1:
                    raise GroqClientError("Groq API timeout after retries") from e
                await asyncio.sleep(1)

            except json.JSONDecodeError as e:
                logger.error("Failed to parse Groq JSON response: %s", e)
                raise GroqClientError("Invalid JSON from Groq API") from e

        raise GroqClientError("Groq API failed after all retries")
