# AI-Powered IT Helpdesk
### Intelligent Incident Management System

An enterprise-style IT support platform that combines role-based incident
management with Gemini-powered ticket classification, priority detection,
and resolution recommendations.

## System Architecture

![AI-Powered IT Helpdesk System Architecture](docs/architecture.png)

## Features

### Employee
- Create and track support tickets
- View ticket status and resolution
- Receive ticket notifications
- Access knowledge base

### Agent
- View incoming incidents
- Review and update tickets
- Assign and resolve incidents
- Monitor incident dashboard

### Admin
- Manage tickets and users
- Monitor support operations
- View analytics
- Receive operational notifications

### AI Assistance
- Automatic incident category classification
- Priority detection
- Suggested resolutions
- Fallback handling when AI is unavailable

## Workflow

Employee creates ticket  
↓  
Backend processes incident  
↓  
Gemini analyzes category, priority and resolution  
↓  
Ticket stored in MongoDB  
↓  
Agent reviews and resolves ticket  
↓  
Employee receives status updates

## Tech Stack

**Frontend:** React, Vite, React Router  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas, Mongoose  
**AI:** Google Gemini API  
**Authentication:** JWT, bcrypt

## Project Structure

```text
frontend/
  src/
    components/
    context/
    layouts/
    pages/
    services/

backend/
  models/
  routes/
  services/
  server.js