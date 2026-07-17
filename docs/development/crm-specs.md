# Development Plan & Backlogs

This document outlines the phased approach for building the CRM system.

## Phase 1: Core Customer Management (Sprint 1)
*Focuses on establishing the foundational CRM functionalities including contact management, viewing history, and basic customer operations.*

### CRM-001: Customer Contacts & Details
**As an employee/manager**, I want to see the list of customer’s contact and lead’s contact in different tabs. I also want to add new customer contact/lead, delete customer contact/lead, update the status of a customer contact when I view their details, and view the details of each customer’s contact/lead.

| Acceptance Criteria | Done |
| :--- | :---: |
| The system shall show the list of customer’s contact in one tab. | [ ] |
| The system shall display the customer’s name, email, phone number (optional), customer type. | [ ] |
| The system shall display a new page showing customer details when I click the customer’s name. | [ ] |
| The system shall show three tabs in the page (overview, marketing history, and order history). | [ ] |
| The system shall display the customer's details in the overview tab when I click the customer’s name. It should include the customer’s name, email, address (optional), created at, status, customer type, and profile (optional). | [ ] |
| The system shall also allow the manager/staff to delete the customer’s contacts, update the customer's status (active, inactive, suspended) and update the customer type (regular, institutional buyer). | [ ] |
| The system shall also allow the manager/staff to add optional notes to a customer contact. | [ ] |
| The system shall display the list of customer’s marketing interactions/history when i go to the marketing history tab. It should also display the marketing details (title, description, channel, interaction type, sent at) when I click one of the items. | [ ] |
| The system shall display the list of customer’s order history when i go to the order history tab. It should also display the order details when I click one of the items. | [ ] |
| The order history tab is only visible to the customer's contact (ecommerce user). | [ ] |
| The system shall allow the manager/staff to add new customer contact with these fields (first name, last name, email, phone number (optional), customer type). | [ ] |
| The system shall automatically add customer contact when signed up in the ecommerce website. | [ ] |


## Phase 2: Marketing & Ticketing Support (Sprint 2)
*Introduces campaign management for promotions and a ticketing system for customer inquiries and concerns.*

### CRM-002: Campaign Management
**As an employee/staff/manager**, I want to be able to create a campaign to promote, or message my customers, leads, and other interested entities.

| Acceptance Criteria | Done |
| :--- | :---: |
| The system shall allow the user to view three tabs (campaign list, campaign drafts, campaign history) inside the campaigns module and a button to create a campaign. | [ ] |
| The system shall display the list of active campaigns inside the campaign list tab. It shall also allow the user to view the campaign’s details. | [ ] |
| The system shall display the list of drafted campaigns inside the campaign drafts tab. It shall also allow the user to view the drafted campaign’s details. | [ ] |
| The system shall display the list of all campaigns that ended inside the campaign history tab. It shall also allow the user to view the campaign history item details. | [ ] |
| The system shall allow the user to create new campaigns. It can be via email, in-app. It can be sent now, scheduled, or recurring (monday, tuesday, wednesday). It can have images (optional). Title, subject, descriptions are required. | [ ] |
| The system shall also allow the user to pick a template for the campaign. | [ ] |
| The system shall allow the user to draft a campaign. | [ ] |

### CRM-005: Ticket Management (Staff)
**As an employee/manager/staff**, I want to be able to view all the available tickets, and claim or unclaim it. I also want to view all accomplished tickets, and claimed tickets, and view the ticket details.

| Acceptance Criteria | Done |
| :--- | :---: |
| The system shall display all available tickets in tickets tab (status=unclaimed or available). | [x] |
| The system shall display all claimed tickets assigned to the user under the claimed tickets tab. | [x] |
| The system shall display all completed tickets assigned to the user under the completed tickets tab. | [x] |
| The system shall allow the user to view the ticket details when the user clicks it. | [x] |
| The system shall allow the user to claim or unclaim the ticket. | [x] |
| The system shall redirect the user to conversation when a message button is clicked inside the ticket's component. | [x] |

### CRM-006: Ticket Creation (Customer)
**As a customer**, I want to be able to create a ticket to raise concern, inquire, or request to the system.

| Acceptance Criteria | Done |
| :--- | :---: |
| The system shall display four tabs on this page (pending, ongoing, completed, cancel). | [x] |
| The system shall display all pending tickets raised by the customer under the pending tab. | [x] |
| The system shall display all ongoing tickets raised by the customer under the ongoing tab. | [x] |
| The system shall display all completed tickets raised by the customer under the completed tab. | [x] |
| The system shall allow the user to create a ticket to raise concern, inquire, or request to the system (title, description, image (optional)). | [x] |
| The system shall allow the user to view the details of the ticket. | [x] |
| The system shall allow the user to cancel a ticket. | [x] |
| The system shall show a message button inside the ticket’s component. | [x] |


## Phase 3: Real-time Support Chat (Sprint 3)
*Enables direct, real-time messaging between customers and support staff for active tickets.*

### CRM-007: Support Chat (Staff)
**As an employee/manager/staff**, I want to be able to talk to my customer regarding their concerns, inquiry, or request. I want to send messages, read their messages, and view all active conversations on my page. I also want to see the message details.

| Acceptance Criteria | Done |
| :--- | :---: |
| The system shall have unread, read, and all tabs inside the messaging module. | [ ] |
| The system shall display all active conversation on the user’s page (these messages came from the claimed tickets). | [ ] |
| The system shall display all unread messages under unread tab. | [ ] |
| The system shall display all read message under read tab. | [ ] |
| The system shall allow the user to mark a message as read or unread. | [ ] |
| The system shall allow the user to be able to send a message real-time to another user. | [ ] |
| The system shall allow the user to be able to read and receive another user’s message. | [ ] |
| The system shall allow the user to view the message's details. | [ ] |

### CRM-008: Support Chat (Customer)
**As a customer**, I want to talk to a staff regarding my concern, inquiry, or request.

| Acceptance Criteria | Done |
| :--- | :---: |
| The system shall redirect the user to this page when the user clicks the message button from the ticket component. | [ ] |
| The system shall allow the user to send a message real-time to a staff. | [ ] |
| The system shall allow the user to read and receive messages from a staff. | [ ] |
| The system shall allow the user to cancel a ticket inside the conversation. | [ ] |
| The system shall allow the user to view the message's details. | [ ] |