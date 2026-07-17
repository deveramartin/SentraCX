"""Unit tests for CRM client."""

import httpx
import pytest
from unittest.mock import AsyncMock, patch

from app.lib.crm_client import CrmClient


BASE_URL = "http://crm-api:5005"
SERVICE_TOKEN = "test-service-token"


def _make_request(method: str, path: str) -> httpx.Request:
    return httpx.Request(method, f"{BASE_URL}{path}")


@pytest.fixture
def crm_client() -> CrmClient:
    return CrmClient(base_url=BASE_URL, service_token=SERVICE_TOKEN)


@pytest.fixture
def crm_client_no_token() -> CrmClient:
    return CrmClient(base_url=BASE_URL, service_token="")


# --- get_customer tests ---


async def test_get_customer_returns_dict_on_200(crm_client: CrmClient) -> None:
    customer_data = {"id": "cust-1", "name": "Alice", "email": "alice@example.com"}
    mock_response = httpx.Response(
        200,
        json=customer_data,
        request=_make_request("GET", "/api/v1/customers/cust-1"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_customer("cust-1")

    assert result == customer_data


async def test_get_customer_returns_none_on_404(crm_client: CrmClient) -> None:
    mock_response = httpx.Response(
        404,
        request=_make_request("GET", "/api/v1/customers/nonexistent"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_customer("nonexistent")

    assert result is None


async def test_get_customer_returns_none_on_500(crm_client: CrmClient) -> None:
    mock_response = httpx.Response(
        500,
        request=_make_request("GET", "/api/v1/customers/cust-1"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_customer("cust-1")

    assert result is None


async def test_get_customer_returns_none_on_connection_error(crm_client: CrmClient) -> None:
    with patch(
        "httpx.AsyncClient.get",
        new_callable=AsyncMock,
        side_effect=httpx.ConnectError("Connection refused"),
    ):
        result = await crm_client.get_customer("cust-1")

    assert result is None


# --- get_customer_orders tests ---


async def test_get_customer_orders_returns_list_on_200(crm_client: CrmClient) -> None:
    orders = [{"id": "ord-1", "total": 99.99}, {"id": "ord-2", "total": 49.50}]
    mock_response = httpx.Response(
        200,
        json=orders,
        request=_make_request("GET", "/api/v1/customers/cust-1/orders"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_customer_orders("cust-1")

    assert result == orders


async def test_get_customer_orders_returns_list_from_wrapped_items(
    crm_client: CrmClient,
) -> None:
    orders = [{"id": "ord-1", "total": 99.99}]
    wrapped = {"items": orders, "total_count": 1}
    mock_response = httpx.Response(
        200,
        json=wrapped,
        request=_make_request("GET", "/api/v1/customers/cust-1/orders"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_customer_orders("cust-1")

    assert result == orders


async def test_get_customer_orders_returns_empty_on_404(crm_client: CrmClient) -> None:
    mock_response = httpx.Response(
        404,
        request=_make_request("GET", "/api/v1/customers/nonexistent/orders"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_customer_orders("nonexistent")

    assert result == []


async def test_get_customer_orders_returns_empty_on_connection_error(
    crm_client: CrmClient,
) -> None:
    with patch(
        "httpx.AsyncClient.get",
        new_callable=AsyncMock,
        side_effect=httpx.ConnectError("Connection refused"),
    ):
        result = await crm_client.get_customer_orders("cust-1")

    assert result == []


# --- Header tests ---


def test_headers_include_authorization_when_token_set(crm_client: CrmClient) -> None:
    headers = crm_client._headers()

    assert headers["Authorization"] == f"Bearer {SERVICE_TOKEN}"
    assert headers["Content-Type"] == "application/json"


def test_headers_omit_authorization_when_token_empty(
    crm_client_no_token: CrmClient,
) -> None:
    headers = crm_client_no_token._headers()

    assert "Authorization" not in headers
    assert headers["Content-Type"] == "application/json"


# --- get_ticket tests ---


async def test_get_ticket_returns_dict_on_200(crm_client: CrmClient) -> None:
    ticket_data = {"id": "tick-1", "title": "Issue"}
    mock_response = httpx.Response(
        200,
        json=ticket_data,
        request=_make_request("GET", "/api/v1/tickets/tick-1"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_ticket("tick-1")

    assert result == ticket_data


async def test_get_ticket_returns_none_on_404(crm_client: CrmClient) -> None:
    mock_response = httpx.Response(
        404,
        request=_make_request("GET", "/api/v1/tickets/nonexistent"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_ticket("nonexistent")

    assert result is None


async def test_get_ticket_returns_none_on_connection_error(crm_client: CrmClient) -> None:
    with patch(
        "httpx.AsyncClient.get",
        new_callable=AsyncMock,
        side_effect=httpx.ConnectError("Connection refused"),
    ):
        result = await crm_client.get_ticket("tick-1")

    assert result is None


# --- get_ticket_messages tests ---


async def test_get_ticket_messages_returns_list_on_200(crm_client: CrmClient) -> None:
    messages = [{"id": "msg-1", "content": "Hello"}]
    mock_response = httpx.Response(
        200,
        json=messages,
        request=_make_request("GET", "/api/v1/tickets/tick-1/messages"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_ticket_messages("tick-1")

    assert result == messages


async def test_get_ticket_messages_returns_empty_on_404(crm_client: CrmClient) -> None:
    mock_response = httpx.Response(
        404,
        request=_make_request("GET", "/api/v1/tickets/nonexistent/messages"),
    )

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock, return_value=mock_response):
        result = await crm_client.get_ticket_messages("nonexistent")

    assert result == []


async def test_get_ticket_messages_returns_empty_on_connection_error(
    crm_client: CrmClient,
) -> None:
    with patch(
        "httpx.AsyncClient.get",
        new_callable=AsyncMock,
        side_effect=httpx.ConnectError("Connection refused"),
    ):
        result = await crm_client.get_ticket_messages("tick-1")

    assert result == []
