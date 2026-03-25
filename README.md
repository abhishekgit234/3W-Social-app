# Social Media Platform

A full-stack social media application inspired by modern platforms, designed with a clean and responsive UI.

## Features

- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens).
- **Global Feed**: A global space to view posts from all users.
- **Post Creation**: Create posts with rich text and image uploads (integrated with ImageKit & Multer).
- **User Interactions**: 
  - Like and unlike posts.
  - View a detailed list of users who liked a specific post.
  - Add and view comments on posts.
- **Responsive Design**: Modern and functional UI built with Material UI to guarantee a great experience on desktop and mobile.

## Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling & UI**: Material UI (MUI), Emotion
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt for password hashing
- **File Uploads**: Multer, ImageKit

## Project Structure

The repository is structured into two main directories:
- `/frontend`: Contains the Vite + React client application.
- `/backend`: Contains the Node.js + Express server application.

## Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)
- ImageKit account (for cloud image storage)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd social-app
```

### 2. Setup Backend

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Start the backend server:
```bash
npm run dev
# The server should start on http://localhost:5000 (or your configured port)
```

### 3. Setup Frontend

Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory (if needed for API URLs):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
# The app should start on http://localhost:5173
```

## Contributing

Contributions are welcome! If you have any improvements or bug fixes, feel free to submit a pull request.

## License

This project is licensed under the ISC License.
