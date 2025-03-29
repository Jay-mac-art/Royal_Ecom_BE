# E-commerce Store with Discount System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack e-commerce application with cart functionality and automated discount code generation system.

## Features

### Core Functionality
- 🛒 Add items to cart
- 💳 Checkout system with order validation
- 🎟️ Automated discount code generation (every nth order)
- ✅ Discount code validation during checkout
- 📊 Admin dashboard with sales statistics

### Admin Features
- 📈 View sales statistics (total items, revenue, discounts)
- 🔢 Configure nth order threshold for discounts
- 🏷️ Generate new discount codes manually
- 📋 List all active/redeemed discount codes

## Technologies Used

### Backend
- **Nest.js** with **Typeorm.js**
- **TypeScript** for type safety
- **Jest** for unit testing
- Postgres 

### Frontend
- **ReactVite** with **TypeScript**
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Router** for navigation

## Project Structure FE 
```
└── 📁src
    └── 📁components
        └── Navbar.tsx
        └── ProductCard.tsx
    └── 📁pages
        └── Admin.tsx
        └── Cart.tsx
        └── Checkout.tsx
        └── Home.tsx
        └── Login.tsx
        └── Register.tsx
    └── 📁store
        └── useStore.ts
    └── 📁types
        └── index.ts
    └── App.tsx
    └── index.css
    └── main.tsx
    └── vite-env.d.ts
```
## Project Structure BE
```
└── 📁src
    └── 📁decorator
        └── auth.decorator.ts
        └── user.decorator.ts
    └── 📁entities
        └── configuration.entity.ts
        └── discountCode.entity.ts
        └── order.entity.ts
        └── orderItem.entity.ts
        └── user.entity.ts
    └── 📁guard
        └── jwt.guard.ts
        └── role.guard.ts
    └── 📁module
        └── 📁admin
            └── admin.controller.ts
            └── admin.module.ts
            └── admin.service.ts
            └── 📁dto
                └── admin.dto.ts
        └── 📁auth
            └── auth.controller.ts
            └── auth.module.ts
            └── auth.service.ts
            └── 📁dto
                └── auth.dto.ts
        └── 📁checkout
            └── checkout.controller.ts
            └── checkout.module.ts
            └── checkout.service.ts
            └── 📁dto
                └── checkout.dto.ts
    └── app.controller.spec.ts
    └── app.controller.ts
    └── app.module.ts
    └── app.service.ts
    └── main.controller.spec.ts
    └── main.ts
```

Set Up Env File Run BE Server and Install npm dependecy

## Getting Started

### Prerequisites
- Node.js v16+
- npm v8+
- Git

### Frontend Setup

1. **Navigate to backend directory**
   ```bash


    Install dependencies
     npm install

    Start development server
    npm run dev


  ```bash

## Getting Started

### Prerequisites
- Node.js v16+
- npm v8+
- Git

### Backend Setup Add Pgsql connection profile and env varaibles

    npm install

    Start development server
    npm run dev

    Run tests
    npm test
