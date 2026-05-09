# Carside.in Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📌 Overview

Carside.in Backend API is a robust, scalable RESTful API built with Node.js, Express.js, and MongoDB. It powers the Carside.in automotive platform with features like user authentication, car listings, brand management, test drive bookings, and more.

## 🚀 Features

### Authentication
- User registration with validation
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access (User, Moderator, Admin)
- Profile management

### Car Management
- CRUD operations for cars
- Advanced filtering (price, year, brand, fuel type, transmission)
- Search functionality
- Pagination support
- New releases and featured cars endpoints
- Car images and gallery management

### Brand Management
- CRUD operations for brands
- Brand logos and cover images
- Brand social links
- Featured brands
- Cars count per brand

### Booking System
- Test drive booking
- Booking status management (pending, confirmed, cancelled, completed)
- User booking history
- Admin booking management
- Booking reminders (coming soon)

### Admin Dashboard
- User management
- System statistics
- Booking overview
- Content management

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime environment |
| Express.js | 4.x | Web framework |
| MongoDB | 7.x | Database |
| Mongoose | 8.x | ODM |
| JSON Web Token | 9.x | Authentication |
| bcryptjs | 2.x | Password hashing |
| express-validator | 7.x | Input validation |
| helmet | 7.x | Security headers |
| express-rate-limit | 7.x | Rate limiting |
| multer | 1.x | File upload |

## 📁 Project Structure
