# Password Manager

A secure and user-friendly Password Manager built with Next.js and Supabase. This application allows users to store, manage, and retrieve their passwords securely, with a modern and minimal user interface.

## Overview
The Password Manager provides a simple solution for managing your passwords. It features a sleek dark-themed UI, secure authentication, and a dashboard to view and manage your saved passwords. The app is designed to be responsive and easy to use on both desktop and mobile devices.

## Features
- **User Authentication**: Sign up, log in, and log out securely using Supabase Auth.
- **Password Management**:
  - Add new passwords with website, username, and password details.
  - View a list of saved passwords in a table format.
  - Edit or delete existing passwords.
- **Modern UI**:
  - Dark theme with a minimal design.
  - Centered login and registration forms.
  - Dashboard with a table for saved passwords and a "Security Tips" section.
- **Secure Storage**: Passwords are stored in a Supabase PostgreSQL database, tied to the authenticated user.

## Installation
Follow these steps to set up the Password Manager locally.

### Prerequisites
- **Node.js**: Version 14.x or higher.
- **npm**: Comes with Node.js, or you can use Yarn.
- **Supabase Account**: Required for authentication and database storage.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/arnav-sai/password-manager.git
