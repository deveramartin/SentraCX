using Crm.Api.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/v1/customers/{customerId:guid}/orders")]
// [Authorize] // TODO: Re-enable authentication before production/merge to main
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetByCustomer(Guid customerId)
    {
        var orders = await orderService.GetByCustomerIdAsync(customerId);
        return Ok(orders);
    }
}
