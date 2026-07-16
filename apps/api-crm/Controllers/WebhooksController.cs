using Crm.Api.DTOs.Requests;
using Crm.Api.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/v1/webhooks")]
public class WebhooksController(IOrderService orderService) : ControllerBase
{
    [HttpPost("orders")]
    public async Task<IActionResult> ProcessOrderEvent(
        [FromBody] OrderWebhookRequestDto dto)
    {
        await orderService.ProcessWebhookAsync(dto);
        return Ok();
    }
}
