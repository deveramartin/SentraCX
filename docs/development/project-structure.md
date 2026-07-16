```
SentraCX/
├── apps/
│   ├── web-crm/                          # Next.js + shadcn/ui + Tailwind
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── ui/                   # shadcn generated components
│   │   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   └── styles/
│   │   ├── public/
│   │   ├── components.json
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── api-crm/                          # .NET 10 Web API — MVC style
│   │   ├── Controllers/
│   │   │   ├── ContactsController.cs
│   │   │   ├── DealsController.cs
│   │   │   ├── AccountsController.cs
│   │   │   └── AuthController.cs
│   │   ├── Models/                       # EF entities / domain models
│   │   │   ├── Contact.cs
│   │   │   ├── Deal.cs
│   │   │   └── Account.cs
│   │   ├── DTOs/                         # request/response shapes
│   │   │   ├── Requests/
│   │   │   └── Responses/
│   │   ├── Mappers/                      # entity <-> DTO mapping
│   │   │   ├── ContactMapper.cs
│   │   │   └── DealMapper.cs
│   │   ├── Data/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── Migrations/
│   │   │   └── Seed/
│   │   ├── Services/                     # business logic
│   │   │   ├── IContactService.cs
│   │   │   ├── ContactService.cs
│   │   │   └── ...
│   │   ├── Repositories/                 # data access abstraction (optional but common in MVC-style)
│   │   │   ├── IContactRepository.cs
│   │   │   └── ContactRepository.cs
│   │   ├── Helpers/
│   │   │   ├── PaginationHelper.cs
│   │   │   ├── SlugHelper.cs
│   │   │   └── DateTimeHelper.cs
│   │   ├── Validators/                   # FluentValidation or custom
│   │   │   └── ContactValidator.cs
│   │   ├── Middleware/
│   │   │   ├── ExceptionHandlingMiddleware.cs
│   │   │   └── RequestLoggingMiddleware.cs
│   │   ├── Filters/                      # action filters, exception filters
│   │   │   └── ValidateModelFilter.cs
│   │   ├── Extensions/                   # service collection / app builder extensions
│   │   │   ├── ServiceCollectionExtensions.cs
│   │   │   └── ApplicationBuilderExtensions.cs
│   │   ├── Configurations/                # options classes (bound from appsettings)
│   │   │   └── JwtSettings.cs
│   │   ├── Constants/
│   │   │   └── AppConstants.cs
│   │   ├── Exceptions/                    # custom exception types
│   │   │   ├── NotFoundException.cs
│   │   │   └── ValidationException.cs
│   │   ├── tests/
│   │   │   ├── Crm.Api.Tests/
│   │   │   │   ├── Controllers/
│   │   │   │   ├── Services/
│   │   │   │   └── Helpers/
│   │   ├── Properties/
│   │   │   └── launchSettings.json
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── Program.cs
│   │   ├── Crm.Api.csproj
│   │   └── Dockerfile
│   │
│   └── api-ai-analytics/                 # FastAPI + Pydantic + MongoDB
│       ├── app/
│       │   ├── main.py
│       │   ├── api/
│       │   │   └── v1/
│       │   │       ├── routes/
│       │   │       └── deps.py
│       │   ├── core/                     # config, settings
│       │   ├── models/                   # pydantic models / mongo document schemas
│       │   ├── schemas/                  # request/response schemas
│       │   ├── services/                 # business logic
│       │   ├── mappers/                  # doc <-> schema mapping
│       │   ├── helpers/
│       │   ├── db/                       # mongo client/session
│       │   └── exceptions/
│       ├── tests/
│       ├── pyproject.toml
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── ui/
│   ├── config/
│   └── types/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── adr/
│
├── .kiro/
│   └── steering/
│
├── agents/
│   └── skills/
│
├── docker/
│   └── docker-compose.ci.yml
│
├── .github/
│   └── workflows/
│
├── .gitignore
├── AGENTS.md
├── README.md
├── LICENSE
├── pnpm-workspace.yaml
├── package.json
└── turbo.json
```
