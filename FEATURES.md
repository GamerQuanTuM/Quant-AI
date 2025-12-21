# 🌟 Application Features & User Guide

This document provides a detailed walkthrough of the **Content Generator Dashboard**, explaining every feature available to the user from the moment they land on the application.

---

## 🔐 1. Authentication & Onboarding

### **Sign Up & Login**
*   **Secure Access**: Users can sign up using email and password.
*   **Encrypted Security**: Passwords are securely hashed using `bcrypt` before storage.
*   **Session Management**: The application uses **JWT (JSON Web Tokens)** for stateless, secure session handling. You stay logged in until your token expires.

### **New User Experience**
*   **Welcome Gift**: Every new user is automatically assigned the **FREE Plan**.
*   **Initial Credits**: You start with **100 Free Credits** to explore the AI generation capabilities immediately without entering credit card details.

---

## 🗂️ 2. Project Management
Organize your work effectively by grouping content into "Projects" (Campaigns).

### **Create a Project**
*   **Action**: Click the "Create Project" button on the dashboard.
*   **Details**: Give your project a name (e.g., "Summer Marketing 2024").
*   **Smart Slugs**: The system automatically generates a URL-friendly "slug" (e.g., `/project/summer-marketing-2024`) for easy sharing and navigation.
*   **Real-time Feedback**: You receive an instant notification confirming the project creation.

### **Project View**
*   **Central Hub**: Navigate to any project to see all content generated specifically for that campaign.
*   **Filtering**: Quickly find blog posts, tweets, or emails belonging to that specific project.

---

## ⚡ 3. AI Content Generator
The core engine of the application. Generate high-quality content using advanced AI models.

### **Step 1: Choose a Template**
Select from a variety of pre-built templates tailored for specific use cases:
*   📝 **Blog Posts**: SEO-optimized articles.
*   👔 **LinkedIn Posts**: Professional updates and thought leadership.
*   🐦 **Tweets/X Posts**: Short, engaging content.
*   📧 **Emails**: Marketing blasts or cold outreach.

### **Step 2: Customize Input**
Fill in the dynamic form fields based on your chosen template:
*   **Topic**: What should the AI write about?
*   **Tone**: Professional, Funny, Casual, Authoritative, etc.
*   **Target Audience**: Who is reading this?
*   **Keywords**: Specific SEO terms to include.

### **Step 3: Generate**
*   **One-Click Magic**: Click "Generate" to send your request to the AI Engine.
*   **Streaming**: Watch the content appear in real-time as it is being written.
*   **Cost**: Each generation consumes a specific number of credits from your balance.

---

## 📜 4. Content History & Management

### **Global History**
*   **Timeline View**: Visit the `/history` page to see a chronological list of *everything* you have ever generated across all projects.
*   **Search & Sort**: Easily find that one tagline you generated three weeks ago.

### **Content Actions**
*   **👀 View**: Click to read the full generated text in a clean formatted window.
*   **📋 Copy**: One-click "Copy to Clipboard" for instant pasting into your CMS or Social Media.
*   **🗑️ Delete**: Remove unwanted content to keep your workspace clean.

---

## 🔔 5. Real-Time Interactions

### **Notification System**
*   **Instant Updates**: You don't need to refresh the page. The bell icon updates instantly when:
    *   A project is created.
    *   Credits are added.
    *   A generation task completes.
*   **Manage Alerts**:
    *   **Mark as Read**: Keep track of what you've seen.
    *   **Delete**: Remove old notifications.
    *   **Unread Count**: A red badge shows you exactly how many new updates you have.

---

## 💳 6. Billing & Credits System

### **Credit Economy**
*   **Usage Tracking**: The system tracks every single credit used. You can see exactly where your credits went.
*   **Top-Up**: Running low? Purchase more credits seamlessly.
*   **Integration**: Secure payment processing (Razorpay integration prepared) handling the transactions.

### **Plans**
*   **Free**: Starter access.
*   **Pro**: For power users needing more volume.
*   **Enterprise**: For teams and high-volume needs.

---

## ⚙️ 7. Technical User Features
*   **Dark Mode**: Fully supported dark/light mode for comfortable viewing day or night.
*   **Responsive Design**: Works perfectly on Desktop, Tablet, and Mobile.
*   **Performance**: Optimized for speed, so you spend less time waiting and more time creating.


## 📝 8. Public API

### **Get Projects**
*   **URL**: `/api/public/get-projects`
*   **Method**: `GET`
*   **Response**: Array of Project objects.

```bash
curl -X GET "/api/public/get-projects" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### **Get Project**
*   **URL**: `/api/public/get-project/[slug]`
*   **Method**: `GET`
*   **URL Params**: `slug` (required)
*   **Query Params**:
    *   `content` (optional): Set to `true` to include the generated content in the response.

```bash
curl -X GET "/api/public/get-project/my-blog-post?content=true" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```
    