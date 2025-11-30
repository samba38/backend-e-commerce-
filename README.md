A complete backend for an e-commerce clothing store built using Node.js, Express, MongoDB, and JWT Authentication.
Supports user auth, product management, cart, and order processing.

🚀 Features
User Registration & Login (JWT + HTTP-Only Cookies)

Products API (List, Filter, Single Product)

Shopping Cart (Add, Update, Remove, Fetch)

Orders (Place Order, Order History)

Secure Authentication Middleware

Hosted on Render

Fully configured CORS + Cookie Authentication



📂 Project Structure
backend/
│── config/
│   └── db.js
│── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
│── middleware/
│   └── authMiddleware.js
│── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
│── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
│── .env
│── server.js
└── package.json



🔧 Tech Stack
Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Nodemailer (Email confirmations)

Render Hosting


📥 Installation
Clone the repository:
git clone https://github.com/samba38/backend-e-commerce-.git
cd backend

Install dependencies:
npm install



🔐 Environment Variables (.env)
Create a .env file in the backend root:
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
EMAIL_USER=example@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173


⚠️ Never commit .env to GitHub
Your .gitignore must contain:
.env
node_modules/

▶️ Run Backend
npm install
node server.js

🌐 API Base URL
When hosted on Render:
https://backend-e-commerce-3-u60q.onrender.com



📌 Available APIs
🔹 Authentication
POST /api/auth/register
POST /api/auth/login

🔹 Products
GET /api/products
GET /api/products/:id

🔹 Cart
GET /api/cart
POST /api/cart/add
PUT /api/cart/update
DELETE /api/cart/remove

🔹 Orders
POST /api/orders/place
GET /api/orders
GET /api/orders/:id


🔒 Authentication (JWT + Cookies)
After login, backend stores token in:
httpOnly cookie → secure, sameSite=None
Frontend automatically sends cookie using:
axios.create({ withCredentials: true })


🚀 Deployment (Render)
Push to GitHub → Create Web Service on Render
Set environment variables in Render Dashboard.