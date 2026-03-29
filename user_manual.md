# 📘 NexusAI: Complete User Manual & Test Guide

Welcome to **NexusAI**, your autonomous Sales & Revenue Operations platform. This guide will teach you how to use and test the platform's real-world AI capabilities.

---

## 🚀 Quick Start: Demo Login
If you are a new user or just testing, use our **Demo Mode** to skip setup:
1.  Go to the **Sign In** page.
2.  Click the button: **🚀 Continue in Demo Mode (For Judges/Users)**.
3.  You will be logged in as **Rahul Sharma**, a Pro User with active deals and prospects already loaded.

---

## 🏗️ Step 1: Populate Your Data
If your dashboard looks empty on the first login:
1.  Look for the **Blue Banner** at the top of the Home Dashboard.
2.  Click **Populate Demo Data**.
3.  The system will instantly inject real-world records (Deals at risk, AI-scored prospects, and Battlecards) into your account.

---

## 🤖 Step 2: Testing the 4 Autonomous Agents
NexusAI runs four specialized agents. Follow these test cases to see them in action:

### **Test Case 1: The Prospecting Agent (Find New Leads)**
*   **Goal:** Find real companies and prepare an email sequence.
*   **How to test:**
    1.  Go to `App > Prospecting`.
    2.  Click **"Run Prospecting Agent"**.
    3.  **Wait 30-60 seconds.** The agent is now using **Serper.dev** to search the live web for companies matching your ICP.
    4.  New cards will appear in the **"Discovered"** column.
    5.  Click a card, then click **"Approve Step"**. 
*   **Success Signal:** Check the **Outbox** tab. The email will move to "Sent". If you used a real email address, check that inbox!

### **Test Case 2: Deal Intelligence (Live CRM Monitoring)**
*   **Goal:** Detect hidden risks in your sales pipeline.
*   **How to test:**
    1.  Go to `App > Pipeline`.
    2.  Notice the **Risk Score** (0-100%).
    3.  **The Real Test:** Go to your **HubSpot account** and add a note to a deal saying: *"Customer mentioned they are looking at Salesforce pricing."*
    4.  Come back to NexusAI and click **"Run Deal Intel Agent"** (or wait for the auto-scan).
*   **Success Signal:** The deal's Risk Score will increase, and a **"Recovery Play"** will be generated specifically mentioning the competitor you added in HubSpot.

### **Test Case 3: Retention AI (Happy Customers)**
*   **Goal:** Predict who might cancel their subscription.
*   **How to test:**
    1.  Go to `App > Retention`.
    2.  Look at the **"Risk Heatmap"**. 
    3.  Find an account in the **"High Risk"** column.
    4.  Click **"View Intervention"**. 
*   **Success Signal:** The agent will have generated a **Discount Offer** or a **CSM Briefing**. If it's a high-value account, check your **Slack channel** (if configured) for a real-time alert!

### **Test Case 4: Competitive Radar (Market Vision)**
*   **Goal:** Stay ahead of competitor changes.
*   **How to test:**
    1.  Go to `App > Battlecards`.
    2.  Open the **Salesforce** or **HubSpot** battlecard.
    3.  Check the **"Recent Signals"** section.
*   **Success Signal:** These signals are pulled live using **Firecrawl**. If a competitor changes their pricing page, the agent will detect a **"Positioning Shift"** and automatically push a note to all active deals in your CRM.

---

## 📧 Testing Real Email Tracking
NexusAI doesn't just send emails; it watches them.
1.  Send an email to an address you have access to.
2.  **Open the email** in your inbox.
3.  Go back to NexusAI and check the **Prospect Intelligence** drawer for that person.
4.  **Success Signal:** You will see the "Open Count" increased to 1. This is powered by our real-time tracking pixel.

---

## 🛡️ Admin Oversight
If you want to see the "Brain" of the company:
1.  **Logout** and log back in as:
    *   **Email**: `admin@salesai.com`
    *   **Password**: `Admin@123`
2.  Go to **Admin > Dashboard**.
3.  Watch the **Agent Logs**. This is a real-time stream of what every agent is doing (Scraping, Emailing, Scoring) across the whole company.

---

## 🛠️ Troubleshooting
*   **Email not sending?** Ensure `GMAIL_APP_PASSWORD` in your `.env` is a valid 16-character Google App Password.
*   **HubSpot not syncing?** Make sure your `HUBSPOT_API_KEY` (Private App Token) has `crm.objects.deals.read` and `crm.objects.notes.write` permissions.
*   **Search results empty?** Verify your `SERPER_API_KEY` has remaining credits.

---
**NexusAI is built to work while you sleep. Enjoy your new autonomous revenue team!**
