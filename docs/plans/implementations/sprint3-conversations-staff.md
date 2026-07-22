# Sprint 3 — CRM-007: Conversations (Staff/Manager View)

## Scope

Wire the existing conversations UI to real backend data and enable live bidirectional
messaging via SignalR. The **CRM-008 customer view** is explicitly out of scope — it will
be built in a separate Next.js app.

| Ticket | Feature | Type |
|---|---|---|
| CRM-007 | Conversations — Staff/Manager view | BE gaps + FE rewrite |

Constraints: **mobile-responsive**, **shadcn/ui** for all primitives, **no new npm/icon
packages**, one git commit per completed task, ~200-line hard cap per file.

---

## Decisions Log

| # | Question | Decision |
|---|---|---|
| Q1 | `assignedToId` while auth is bypassed | **No filter in dev** — show all `Claimed`/`Ongoing` tickets. Add `// TODO` comments at every touch-point so auth wiring is trivial later. |
| Q2 | Last-message preview in conversation list | **Ticket `title` as preview** — backlog says "active conversation list sourced from claimed tickets", no mention of a last-message field. No DTO change. |
| Q3 | SignalR auth when auth is re-enabled | **Add `// TODO` comment in `useSignalR.ts`** noting that the JWT access token must be passed in the SignalR connection options. Non-blocking this sprint. |

---

## Current State Audit

### Backend (`apps/api-crm`)

All core models, repositories, and services are already in place. Only three gaps remain:

| Layer | Status | Notes |
|---|---|---|
| `Models/Message.cs` | ✅ | `Id`, `TicketId`, `SenderId`, `Content`, `IsRead`, `SentAt` |
| `Models/Ticket.cs` | ✅ | Includes `Messages` navigation collection |
| `Models/User.cs` | ✅ | `Id`, `DisplayName`, `Email` |
| `Interfaces/Repositories/IMessageRepository.cs` | ✅ | `GetByTicketId`, `AddAsync`, `MarkAsReadAsync` |
| `Repositories/MessageRepository.cs` | ✅ | Full implementation |
| `Interfaces/Services/IMessageService.cs` | ✅ | Covers all three methods |
| `Services/MessageService.cs` | ✅ | Validates ticket is `Claimed` or `Ongoing` before persisting |
| `Controllers/MessagesController.cs` | ✅ | `GET /api/v1/tickets/{id}/messages`, `POST`, `PUT /{msgId}/read` |
| `Hubs/ChatHub.cs` | ✅ | `JoinTicket`, `LeaveTicket`, `SendMessage`, `MarkMessageRead` |
| `Program.cs` | ✅ | SignalR + Redis backplane registered, hub mapped at `/hubs/chat` |
| `Controllers/TicketsController.cs` | ✅ | `GET ?status=`, `PUT /{id}/status`, `PUT /{id}/claim` |
| **`GET /api/v1/tickets?assignedToId=`** | ❌ | `GetAllAsync` has no `assignedToId` filter — gap 1 |
| **`DTOs/Responses/TicketListResponseDto.cs`** | ⚠️ | Missing `UnreadMessageCount` — gap 2 |
| **`PUT /api/v1/tickets/{id}/unclaim`** | ❌ | No unclaim endpoint; `ValidTransitions` blocks regression — gap 3 |

### Frontend (`apps/web-crm`)

| Layer | Status | Notes |
|---|---|---|
| `types/ticket.ts` | ✅ | `Ticket`, `TicketListItem`, `TicketStatus`, paginated types |
| `lib/api/crm-client.ts` — `tickets.*` | ✅ | `list`, `getById`, `claim`, `updateStatus`, `cancel` |
| `hooks/useTickets.ts` | ✅ | Paginated fetch |
| `hooks/useTicket.ts` | ✅ | Single ticket fetch |
| **`types/message.ts`** | ❌ | New type file needed |
| **`lib/api/crm-client.ts` — `messages.*`** | ❌ | No HTTP calls for messages yet |
| **`hooks/useMessages.ts`** | ❌ | New hook needed |
| **`hooks/useSignalR.ts`** | ❌ | New hook needed |
| `components/features/conversations/types.ts` | ⚠️ | Local `Chat`/`Message` mock types — will be deleted |
| `components/features/conversations/Conversations.tsx` | ⚠️ | Hardcoded mock data — full rewrite |
| `components/features/conversations/ConversationList.tsx` | ⚠️ | Renders local `Chat[]` — must switch to real types |
| `components/features/conversations/ConversationWindow.tsx` | ⚠️ | Static message list — must accept real `Message[]` and SignalR send |
| `components/features/conversations/CustomerContextPanel.tsx` | ⚠️ | Hardcoded CLV/risk — keep UI shell, wire to real ticket data |
| `app/conversations/page.tsx` | ✅ | Renders `<Conversations />` — minor update needed for deep-link param |

---

## Proposed Changes

### Component 1: `apps/api-crm` — Backend Gaps

---

#### [MODIFY] [TicketListResponseDto.cs](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-crm/DTOs/Responses/TicketListResponseDto.cs)

Add `public int UnreadMessageCount { get; set; }` property.

---

#### [MODIFY] [ITicketRepository.cs](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-crm/Interfaces/Repositories/ITicketRepository.cs)

Add `string? assignedToId = null` optional parameter to `GetAllAsync`.

Add the following comment above the parameter:

```csharp
// TODO: In dev, assignedToId is passed as null (no filter applied — shows all Claimed/Ongoing).
//       When auth is re-enabled, this will be populated from JWT claims in the controller.
```

---

#### [MODIFY] [TicketRepository.cs](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-crm/Repositories/TicketRepository.cs)

- Accept `string? assignedToId` in `GetAllAsync`
- Apply `.Where(t => t.AssignedToId == assignedToId)` only when `assignedToId` is not null
- Include `.Include(t => t.Messages)` in the list query for unread count

Add the following comments:

```csharp
// TODO (auth): When assignedToId is null, all Claimed/Ongoing tickets are returned (dev mode).
//              Once auth is re-enabled, assignedToId will always be set from JWT claims.

// TODO (perf): At large ticket volumes, replace the Messages include with a subquery or
//              a denormalized UnreadMessageCount column to avoid N+1 load.
```

---

#### [MODIFY] [ITicketService.cs](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-crm/Interfaces/Services/ITicketService.cs)

- Add `string? assignedToId = null` to `GetAllAsync` signature
- Add `Task<bool> UnclaimAsync(Guid id)` method declaration

---

#### [MODIFY] [TicketService.cs](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-crm/Services/TicketService.cs)

- Pass `assignedToId` through to repository in `GetAllAsync`
- Add `UnclaimAsync`: fetch ticket → validate `Status == "Claimed"` → set `Status = "Unclaimed"`,
  `AssignedToId = null`, `UpdatedAt = UtcNow` → `ticketRepo.UpdateAsync` → return `true`

---

#### [MODIFY] [TicketsController.cs](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-crm/Controllers/TicketsController.cs)

- Add `[FromQuery] string? assignedToId` to `GetAll`, passing it to the service.

  Add comment alongside the parameter:
  ```csharp
  // TODO (auth): Extract assignedToId from JWT claims (e.g. User.FindFirstValue("sub"))
  //              when [Authorize] is re-enabled. Null = no filter (dev bypass mode).
  ```

- Add new action:
  ```csharp
  [HttpPut("{id:guid}/unclaim")]
  public async Task<IActionResult> Unclaim(Guid id)
  ```

---

#### [MODIFY] [TicketMapper.cs](file:///home/friedrich/workspace/monorepo/SentraCX/apps/api-crm/Mappers/TicketMapper.cs)

In `ToListResponse`, populate `UnreadMessageCount` from:
```csharp
UnreadMessageCount = ticket.Messages.Count(m => !m.IsRead)
```

---

#### [NEW] `tests/Crm.Api.Tests/Services/TicketServiceUnclaimTests.cs`

Unit tests for `UnclaimAsync` (mirror existing service test patterns):
- Returns `false` when ticket is not found
- Returns `false` when ticket status is not `Claimed` (e.g. `Ongoing`, `Completed`)
- Returns `true`, clears `AssignedToId`, sets `Status = "Unclaimed"` on success

---

### Component 2: `apps/web-crm` — Types & API Layer

---

#### [NEW] [types/message.ts](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/types/message.ts)

```ts
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  isRead: boolean;
  sentAt: string; // ISO 8601
}
```

---

#### [MODIFY] [types/ticket.ts](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/types/ticket.ts)

Add `unreadMessageCount: number` to `TicketListItem`.

---

#### [MODIFY] [lib/api/crm-client.ts](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/lib/api/crm-client.ts)

**New `messages` namespace:**
```ts
messages: {
  listByTicket: (ticketId: string) =>
    request<Message[]>(`/api/v1/tickets/${ticketId}/messages`),
  markRead: (ticketId: string, messageId: string) =>
    request<void>(`/api/v1/tickets/${ticketId}/messages/${messageId}/read`, {
      method: "PUT",
    }),
},
```

**Updates to `tickets` namespace:**
- `list` gains an optional `assignedToId?: string` parameter. Append
  `&assignedToId=...` only when provided.

  Add comment:
  ```ts
  // TODO (auth): Pass the current user's ID as assignedToId once the session is
  //              wired. Until then, omit it — all Claimed/Ongoing tickets are returned.
  ```

- New `unclaim` method:
  ```ts
  unclaim: (id: string) =>
    request<void>(`/api/v1/tickets/${id}/unclaim`, { method: "PUT" }),
  ```

---

### Component 3: `apps/web-crm` — Custom Hooks

---

#### [NEW] [hooks/useMessages.ts](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/hooks/useMessages.ts)

- Accepts `ticketId: string | null`
- Skips fetch when `ticketId` is null
- Returns `{ messages, isLoading, error, refetch, appendMessage }`
- `appendMessage(msg: Message)` appends to local state without a network call
  (used by `useSignalR` when a new message arrives over the socket)

---

#### [NEW] [hooks/useSignalR.ts](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/hooks/useSignalR.ts)

Manages the `HubConnection` lifecycle:

- Connects to `${CRM_BASE}/hubs/chat` using `HubConnectionBuilder`
  with `.withAutomaticReconnect()`

  Add comment at connection creation:
  ```ts
  // TODO (auth): Pass JWT access token via .withUrl(url, { accessTokenFactory: () => token })
  //              when NextAuth auth is re-enabled and the SignalR hub has [Authorize].
  ```

- On mount: starts connection, calls `JoinTicket(ticketId)` if `ticketId` is set
- On `ticketId` change: calls `LeaveTicket(prevTicketId)`, then `JoinTicket(newTicketId)`
- Exposes `sendMessage(ticketId: string, senderId: string, content: string)` invoker
- Accepts `onReceiveMessage: (msg: Message) => void` callback — registered as the
  `ReceiveMessage` handler
- Cleans up connection and leaves the group on unmount

---

### Component 4: `apps/web-crm` — Feature Components Rewrite

All four `components/features/conversations/` components are updated.
The local `types.ts` mock file is deleted.

---

#### [DELETE] [types.ts](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/components/features/conversations/types.ts)

Local `Chat` and `Message` mock types removed. All imports switch to `@/types/ticket`
and `@/types/message`.

---

#### [MODIFY] [Conversations.tsx](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/components/features/conversations/Conversations.tsx)

Full rewrite — orchestration component. Key responsibilities:

- Accept `initialTicketId?: string` prop (passed from page for deep-link support)
- Fetch tickets via `useTickets` with `status="Claimed"` and no `assignedToId`
  (dev bypass — add `// TODO (auth)` comment)
- Manage `activeTicketId` state; initialize from `initialTicketId` or first ticket
- Instantiate `useMessages(activeTicketId)` and `useSignalR` with an
  `onReceiveMessage` that calls `appendMessage`
- Tab bar — **All** / **Unread** / **Read** — client-side filter on `unreadMessageCount`
- Wire `onComplete(id)` → `crmClient.tickets.updateStatus(id, "Completed")` → `refetch`
- Wire `onUnclaim(id)` → `crmClient.tickets.unclaim(id)` → `refetch`
- Pass `onSendMessage` down to `ConversationWindow`; it invokes
  `signalR.sendMessage(ticketId, senderId, content)` and `appendMessage` optimistically

---

#### [MODIFY] [ConversationList.tsx](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/components/features/conversations/ConversationList.tsx)

Props change:

```ts
interface ConversationListProps {
  tickets: TicketListItem[];
  activeTicketId: string | null;
  onSelect: (ticketId: string) => void;
  isLoading: boolean;
  error: Error | null;
}
```

- Show `ticket.title` as the preview text in each row
  (backlog: "active conversation list sourced from claimed tickets" — no last-message
  field defined)
- Show `ticket.unreadMessageCount` badge per row
- Add `shadcn Skeleton` loading state and an empty-state message when no tickets
- Keep the same visual design (avatar, name, preview, time from `ticket.updatedAt`)

---

#### [MODIFY] [ConversationWindow.tsx](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/components/features/conversations/ConversationWindow.tsx)

Props change:

```ts
interface ConversationWindowProps {
  ticket: Ticket;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onComplete: (ticketId: string) => void;
  onUnclaim: (ticketId: string) => void;
}
```

- Render `message.senderName` and formatted `message.sentAt`
- Identify "staff" messages: `message.senderId === ticket.assignedToId`; all others
  are "customer" (right-aligns staff, left-aligns customer — same as current design)
- **Complete** and **Unclaim** buttons in the chat header
  - Complete: show a shadcn `AlertDialog` for confirmation before calling `onComplete`
  - Unclaim: call `onUnclaim` directly (lower-stakes action)
- Mark each rendered message as read via `MarkMessageRead` SignalR invoke on mount
  (mark batch on first load; new messages are marked individually as they arrive)

---

#### [MODIFY] [CustomerContextPanel.tsx](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/components/features/conversations/CustomerContextPanel.tsx)

Props change:

```ts
interface CustomerContextPanelProps {
  ticket: Ticket;
  onUseTemplate: (text: string) => void;
}
```

- Show `ticket.customerName` in the client identity section
- Show `ticket.customerId` below the name (email is on a separate customer fetch —
  deferred to avoid scope creep)
- CLV and churn risk fields show `—` as placeholder values

  Add comment:
  ```tsx
  {/* TODO: Wire CLV and churn risk from the AI Analytics service once
      the ai-analytics → web-crm integration sprint is planned. */}
  ```

- Smart reply placeholder text remains unchanged for this sprint

---

### Component 5: `apps/web-crm` — Page & Navigation

---

#### [MODIFY] [app/conversations/page.tsx](file:///home/friedrich/workspace/monorepo/SentraCX/apps/web-crm/src/app/conversations/page.tsx)

Read `searchParams.ticketId` and pass as `initialTicketId` to `<Conversations>`:

```tsx
export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: { ticketId?: string };
}) {
  return <Conversations initialTicketId={searchParams.ticketId} />;
}
```

---

#### [MODIFY] Tickets feature — "Message" button deep link

In the tickets feature components, ensure the "Message" button routes to
`/conversations?ticketId={ticket.id}` using Next.js `<Link>` or `router.push`.
The exact file(s) to edit will be confirmed at execution time.

---

### Component 6: `apps/web-crm` — Tests

---

#### [NEW] `src/__tests__/hooks/useMessages.test.ts`

- Mock `crmClient.messages.listByTicket`
- Assert loading → data → idle state transitions
- Assert `error` state on API failure
- Assert `refetch` triggers a new network call
- Assert `appendMessage` adds to state without a network call

#### [NEW] `src/__tests__/hooks/useSignalR.test.ts`

- Mock `@microsoft/signalr` `HubConnectionBuilder`
- Assert `JoinTicket` is invoked on mount with the correct `ticketId`
- Assert `LeaveTicket` is invoked on unmount
- Assert `LeaveTicket(prev)` then `JoinTicket(next)` when `ticketId` changes
- Assert `ReceiveMessage` handler calls the provided `onReceiveMessage` callback

---

## Verification Plan

### Automated Tests

```bash
# Backend
cd apps/api-crm
dotnet test tests/Crm.Api.Tests/ --filter "FullyQualifiedName~TicketServiceUnclaimTests"

# Frontend
cd apps/web-crm
pnpm test -- --testPathPattern="useMessages|useSignalR"
```

### Manual Verification

1. **Conversation list loads** — navigate to `/conversations`; list shows all `Claimed`/`Ongoing` tickets
2. **Select conversation** — messages load from `GET /api/v1/tickets/{id}/messages`
3. **Real-time send** — send a message; it appears instantly via SignalR in a second browser tab on the same ticket
4. **Unread badge** — POST a message directly via REST as the customer; reload the list; `unreadMessageCount` badge increments
5. **Tab filtering** — All / Unread / Read tabs filter correctly client-side
6. **Mark as read** — opening a conversation marks its messages read; badge clears
7. **Deep link** — click "Message" on a ticket; lands on `/conversations?ticketId=…` with that conversation pre-selected
8. **Complete** — confirmation dialog → ticket moves to `Completed`, disappears from list
9. **Unclaim** — ticket reverts to `Unclaimed`, disappears from list; reappears in the Tickets "Available" tab
