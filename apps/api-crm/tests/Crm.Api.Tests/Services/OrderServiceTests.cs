using Crm.Api.DTOs.Requests;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Models;
using Crm.Api.Services;
using Moq;

namespace Crm.Api.Tests.Services;

public class OrderServiceTests
{
    private readonly Mock<IOrderHistoryRepository> _orderRepoMock = new();
    private readonly OrderService _sut;

    public OrderServiceTests()
    {
        _sut = new OrderService(_orderRepoMock.Object);
    }

    [Fact]
    public async Task GetByCustomerIdAsync_ReturnsOrderDtos()
    {
        var customerId = Guid.NewGuid();
        var orders = new List<OrderHistory>
        {
            new()
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                OrderNumber = "ORD-001",
                TotalAmount = 99.99m,
                Status = "Delivered",
                OrderedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                OrderNumber = "ORD-002",
                TotalAmount = 49.50m,
                Status = "Shipped",
                OrderedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        _orderRepoMock
            .Setup(r => r.GetByCustomerIdAsync(customerId))
            .ReturnsAsync(orders);

        var result = await _sut.GetByCustomerIdAsync(customerId);

        Assert.Equal(2, result.Count);
        Assert.Equal("ORD-001", result[0].OrderNumber);
        Assert.Equal(99.99m, result[0].TotalAmount);
        Assert.Equal("ORD-002", result[1].OrderNumber);
    }

    [Fact]
    public async Task GetByCustomerIdAsync_WhenNoOrders_ReturnsEmptyList()
    {
        var customerId = Guid.NewGuid();
        _orderRepoMock
            .Setup(r => r.GetByCustomerIdAsync(customerId))
            .ReturnsAsync(new List<OrderHistory>());

        var result = await _sut.GetByCustomerIdAsync(customerId);

        Assert.Empty(result);
    }

    [Fact]
    public async Task ProcessWebhookAsync_NewOrder_CreatesRecord()
    {
        var dto = new OrderWebhookRequestDto
        {
            EventType = "OrderCreated",
            OrderNumber = "ORD-100",
            CustomerId = Guid.NewGuid(),
            TotalAmount = 150.00m,
            Status = "Pending",
            OrderedAt = DateTime.UtcNow
        };

        _orderRepoMock
            .Setup(r => r.GetByOrderNumberAsync("ORD-100"))
            .ReturnsAsync((OrderHistory?)null);

        await _sut.ProcessWebhookAsync(dto);

        _orderRepoMock.Verify(r => r.AddAsync(It.Is<OrderHistory>(o =>
            o.OrderNumber == "ORD-100" &&
            o.TotalAmount == 150.00m &&
            o.Status == "Pending" &&
            o.CustomerId == dto.CustomerId
        )), Times.Once);

        _orderRepoMock.Verify(r => r.UpdateAsync(It.IsAny<OrderHistory>()), Times.Never);
    }

    [Fact]
    public async Task ProcessWebhookAsync_ExistingOrder_UpdatesRecord()
    {
        var existingOrder = new OrderHistory
        {
            Id = Guid.NewGuid(),
            CustomerId = Guid.NewGuid(),
            OrderNumber = "ORD-100",
            TotalAmount = 150.00m,
            Status = "Pending",
            OrderedAt = DateTime.UtcNow.AddDays(-2)
        };

        var dto = new OrderWebhookRequestDto
        {
            EventType = "OrderUpdated",
            OrderNumber = "ORD-100",
            CustomerId = existingOrder.CustomerId,
            TotalAmount = 160.00m,
            Status = "Shipped",
            OrderedAt = existingOrder.OrderedAt
        };

        _orderRepoMock
            .Setup(r => r.GetByOrderNumberAsync("ORD-100"))
            .ReturnsAsync(existingOrder);

        await _sut.ProcessWebhookAsync(dto);

        Assert.Equal("Shipped", existingOrder.Status);
        Assert.Equal(160.00m, existingOrder.TotalAmount);
        _orderRepoMock.Verify(r => r.UpdateAsync(existingOrder), Times.Once);
        _orderRepoMock.Verify(r => r.AddAsync(It.IsAny<OrderHistory>()), Times.Never);
    }
}
