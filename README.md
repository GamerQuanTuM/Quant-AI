# Project Workflow Overview

This document outlines the complete user journey and technical flow of the Content Generator Dashboard.

## 1. Authentication & Onboarding
*   **User Action**: User signs up (`/signup`) or logs in (`/login`).
*   **System Action**: 
    *   Creates a `User` record in the database.
    *   Initializes the user with **default credits** (e.g., 100 free credits) and the `FREE` plan.
    *   Redirects to the **Dashboard Home** (`/`).

## 2. Project Creation (The Core Container)
*   **Concept**: Every piece of content belongs to a "Project". A project acts as a folder or campaign (e.g., "Q4 Marketing", "New Product Launch").
*   **User Action**: 
    *   User clicks "Create New Project".
    *   User provides a Name (e.g., "Q4 Marketing").
*   **System Action**:
    *   Generates a URL-friendly `slug` (e.g., `q4-marketing`).
    *   Creates a `Project` record linked to the `User`.
    *   Redirects user to the **Project Dashboard** (`/project/q4-marketing`).

## 3. Content Generation Flow
This is the core value loop of the application.

1.  **Select Template**:
    *   User navigates to the **Templates** page or clicks "Generate New" inside a project.
    *   User selects a specific tool (e.g., "LinkedIn Post", "Blog Article").
    *   This sets the `templateId` context.

2.  **Configure Generation**:
    *   User lands on the **Generator Page** (`/generator`).
    *   **Validation**: The system checks if a `Project` is selected. If not, the user MUST select one from the dropdown (enforced to ensure data organization).
    *   **Input**: User fills in dynamic fields specific to the template (Topic, Tone, Audience).

3.  **AI Processing**:
    *   User clicks "Generate".
    *   **Backend**: 
        *   Deducts credits from `User.credits`.
        *   Calls AI Provider (OpenAI/Anthropic) with the specific prompt.
        *   Receives the generated text.

4.  **Save & Store**:
    *   System creates a `GeneratedContent` record.
    *   Stores `inputData` (JSON) to allow "Remixing" or "Regenerating" later.
    *   Stores `outputText` (the result).
    *   Links record to the selected `Project`.

## 4. Consumption & Management
*   **Project View**: User visits `/project/[slug]` to see all content specific to that campaign.
*   **History**: User visits `/history` to see a chronological timeline of all generations across all projects.
*   **Export**: User can copy, edit, or download the generated text.

## 5. Billing & Credits
*   **Usage**: Every generation costs X credits (logged via `Transaction` table).
*   **Refill**: User visits `/billing` to purchase more credits (`Transaction` type `CREDIT_PURCHASE`), updating their `User.credits` balance.
