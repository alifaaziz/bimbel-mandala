# Bimbingan Belajar Mandala

This repository contains both the backend (Express.js) and frontend (Vue.js) code for the Bimbingan Belajar Mandala application.

## Backend - Express.js

A Node.js/Express.js backend service providing REST APIs for Bimbingan Belajar Mandala.

### Prerequisites

- Node.js
- npm
- MySQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/alifaaziz/bimbel-mandala.git
```
2. Change directory
```bash
cd backend
```

3. Install dependencies
```bash
npm install
```

4. Set up environment variables
```bash
cp .env.example .env
```

5. Set up Prisma
```bash
npx prisma generate
```

### Usage

To seed database:
```bash
npm run db:seed
```

To seed for development:
```bash
npm run db:seed:dev
```

To start the development server:
```bash
npm run dev
```

### API Documentation

API Documentation on 
[Postman](https://documenter.getpostman.com/view/33519949/2sB2cXA2MZ)

API Documentation on Web (Swagger)
```bash
{{bash url}}/docs
```


## Frontend - ...

Placeholder for future development.

## License

MIT License