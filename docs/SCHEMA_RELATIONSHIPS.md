# Database Schema Relationships

This document explains how the data models in `prisma/schema.prisma` relate to each other to support the application features.

## Entity Relationship Implementation

### 1. User & Identity
**`User`** is the central entity.
*   **Ownership**: A User *owns* multiple **Projects**. (`User 1 -- * Projects`)
*   **Balance**: A User holds a `credits` balance (Integer).
*   **History**: A User has a history of **Transactions** (for auditing credit usage and purchases).

### 2. Projects (The Organizational Unit)
**`Project`** is the container for content.
*   **Relation to User**: 
    *   `userId`: References the User who owns it.
    *   `@@unique([userId, slug])`: Ensures that a user cannot have two projects with the same URL slug (e.g., two projects named "Marketing" -> `/project/marketing`).
*   **Relation to Content**: A Project contains many **GeneratedContent** items. (`Project 1 -- * GeneratedContent`)
*   **Cascade Delete**: If a User deletes a Project, all *Content* inside it is automatically deleted (Self-cleaning).

### 3. Generated Content (The Core Asset)
**`GeneratedContent`** represents a single successful AI generation.
*   **Relation to Project**: 
    *   `projectId`: It MUST belong to a project. It cannot exist as an "orphan". This enforces the "Select Project" rule in the UI.
*   **Template Metadata**:
    *   `templateId`: A string identifier (e.g., "twitter-thread"). We don't need a separate "Template" table because templates are code-defined configurations (Project files), while the *usage* of them is data.
*   **Data Flexibility**:
    *   `inputData` (JSON): Stores the form inputs (Topic, Tone, etc.). Using `JSON` is powerful here because different templates have completely different input fields. We don't need 50 different columns for every possible valid input.

### 4. Transactions (The Ledger)
**`Transaction`** acts as an immutable log.
*   **Audit Trail**: Instead of just changing `User.credits` directly and losing the history, we record every change here.
*   **Types**: 
    *   `USAGE`: Negative value (User generated content).
    *   `CREDIT_PURCHASE`: Positive value (User paid for credits).

## Visual Representation

```mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    USER ||--o{ TRANSACTION : has
    PROJECT ||--o{ GENERATED_CONTENT : contains

    USER {
        string id PK
        string email
        int credits
    }

    PROJECT {
        string id PK
        string userId FK
        string slug
    }

    GENERATED_CONTENT {
        string id PK
        string projectId FK
        string templateId
        json inputData
        string outputText
    }

    TRANSACTION {
        string id PK
        string userId FK
        int amount
        enum type
    }
```
