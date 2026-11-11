# NexoraMart

**NexoraMart** is a modern full-stack e-commerce platform designed to provide a complete online shopping experience for customers and a powerful management system for store administrators.

The platform includes a responsive customer storefront, secure checkout, order tracking, product reviews, customer questions and answers, support messages, and an admin dashboard for managing products, categories, orders, invoices, analytics, reviews, and customer support.

---

## Live Project Overview

NexoraMart helps businesses launch and manage an online store without relying on multiple disconnected tools.

Customers can browse products, view product details, add items to the cart, place orders, track deliveries, submit reviews, ask product questions, and contact support.

Administrators can manage the complete store operation from one dashboard, including products, categories, orders, invoices, customer questions, support messages, analytics, and order status updates.

---

## The Problem

Many small businesses and new e-commerce projects face common problems when building an online store:

- They need separate tools for products, orders, customer support, reviews, and analytics.
- Existing e-commerce platforms can be expensive, difficult to customize, or too complex for small teams.
- Store owners often lack a simple admin panel to manage products and orders.
- Customers cannot easily track their orders or ask questions before purchasing.
- Product reviews and customer questions are often managed outside the store.
- Order status updates are manual and unclear for customers.
- Business owners do not receive clear insights into sales, products, and customer activity.
- Many platforms do not provide a modern, fast, and mobile-friendly shopping experience.

NexoraMart solves these problems by combining the storefront, customer features, and admin management tools into one connected platform.

---

## Our Solution

NexoraMart provides a complete e-commerce solution with:

- A modern customer storefront
- A powerful admin dashboard
- Product and category management
- Shopping cart and checkout system
- Order creation and tracking
- Invoice generation and printing
- Product reviews and ratings
- Customer questions and admin answers
- Support message management
- Sales and business analytics
- Order status management
- Email notifications for order status updates
- CSV order export
- REST API backend
- Supabase PostgreSQL database support

---

## Key Features

### Customer Features

- Browse products from the storefront
- View product details, images, videos, and 3D product previews
- Search and filter products
- Add products to the shopping cart
- Manage wishlist items
- Place orders using Cash on Delivery
- Track orders using Order ID
- View order history using phone number
- Download or print invoices
- Submit product reviews and ratings
- Ask product-related questions
- View answered questions on product pages
- Contact support through the Contact Us page
- Track order progress from pending to delivered

### Admin Features

- Secure admin login
- Admin dashboard with business overview
- Product management
- Category management
- Product image and video uploads
- Product status management
- Order management
- Order status updates
- Invoice viewing and printing
- Customer review management
- Customer question management
- Support message management
- Sales analytics
- Order CSV export
- Product recommendations
- Frequently bought together suggestions

### Order Management

NexoraMart supports a complete order lifecycle:

```text
Pending → Confirmed → Processing → Shipped → Delivered
```

Orders can also be cancelled when allowed.

Admins can update the order status from the Orders page or Order Details page. When an order status is updated, the system saves a status history record and sends an email notification to the customer if an email address is available.

---

## Product Questions and Answers

Customers can ask questions about a product before purchasing.

Questions are first submitted with a `pending` status. Admins can review the question, write an answer, and publish it to the product page.

Only answered questions are publicly visible to customers.

Admins can:

- View all customer questions
- Answer questions
- Hide questions
- Delete questions
- View question answers

---

## Support Messages

Customers can contact the NexoraMart support team through the Contact Us page.

Each support message includes:

- Customer name
- Customer email
- Subject
- Message
- Submission date
- Message status

Admins can:

- View all support messages
- Mark messages as read
- Delete messages
- Contact customers using the provided email address

---

## Analytics and Insights

The admin dashboard provides business insights, including:

- Total orders
- Pending orders
- Processing orders
- Total revenue
- Product performance
- Customer activity
- Order trends
- Frequently bought together products
- Related product recommendations

These insights help store owners understand what is selling, which products need attention, and how the business is performing.

---

## Technologies Used

### Frontend

- React
- React Router
- Vite
- Tailwind CSS
- Axios
- Context API
- JavaScript ES6+

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- Python Dotenv

### Database

- PostgreSQL
- Supabase
- SQLAlchemy ORM

### Tools and Services

- Git
- GitHub
- VS Code
- Postman
- Swagger UI
- Supabase SQL Editor
- Vercel / Render / Railway for deployment options
- Gmail SMTP for email notifications

---

## Project Structure

```text
NexoraMart/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── api.py
│   │   │       ├── routes/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── utils/
│   ├── requirements.txt
│   └── .env
│
├── admin-panel/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── components/
│   │   ├── pages/
│   │   └── contexts/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## API Overview

The backend exposes a REST API under:

```text
/api/v1
```

### Main API Sections

| Section | Description |
|---|---|
| `/auth` | Authentication and admin access |
| `/categories` | Product category management |
| `/products` | Product management |
| `/catalog` | Public product browsing |
| `/orders` | Order creation, tracking, and management |
| `/reviews` | Product reviews |
| `/questions` | Product questions and answers |
| `/support` | Customer support messages |
| `/uploads` | File and media uploads |
| `/payments` | Payment handling |
| `/recommendations` | Product recommendations |
| `/analytics` | Business analytics |

### Important Endpoints

```text
POST /api/v1/orders
GET  /api/v1/orders
GET  /api/v1/orders/{order_id}
PATCH /api/v1/orders/{order_id}/status
GET  /api/v1/orders/track/{order_id}
GET  /api/v1/orders/export/csv

POST /api/v1/questions/products/{product_id}
GET  /api/v1/questions/products/{product_id}
GET  /api/v1/questions/admin/all
POST /api/v1/questions/admin/{question_id}/answers

POST /api/v1/support/messages
GET  /api/v1/support/admin/messages
PATCH /api/v1/support/admin/messages/{message_id}/read
DELETE /api/v1/support/admin/messages/{message_id}
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nexoramart.git
cd nexoramart
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
DATABASE_URL=your_supabase_database_url
SECRET_KEY=your_secret_key
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_email_password
```

Run the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend URL:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

### 3. Admin Panel Setup

```bash
cd admin-panel
npm install
```

Create a `.env` file inside the `admin-panel` folder:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Run the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Supabase Database

NexoraMart uses Supabase PostgreSQL as its database.

Main database tables include:

- `products`
- `categories`
- `orders`
- `order_items`
- `product_reviews`
- `product_questions`
- `product_answers`
- `support_messages`
- `order_status_history`
- `profiles`

You can create the required tables manually using the Supabase SQL Editor.

---

## Security

NexoraMart includes:

- Admin authentication
- Protected admin routes
- Password hashing
- JWT-based authentication
- Role-based access control
- Secure API endpoints
- CORS configuration
- Environment variable protection

---

## Future Features

NexoraMart is designed to grow into a complete AI-powered commerce platform.

### Upcoming Features

- Multi-Agent AI system to manage the entire website
- AI product recommendation agent
- AI customer support agent
- AI order management agent
- AI inventory forecasting agent
- AI marketing and sales assistant
- AI review analysis
- Automated customer reply suggestions
- Advanced payment gateway integration
- Coupon and discount system
- Loyalty points and rewards
- Delivery rider management
- Real-time order notifications
- Multi-vendor marketplace support
- Mobile application
- Multi-language support
- Advanced SEO tools
- Automated invoice generation
- Admin role permissions
- Vendor dashboard
- Warehouse and inventory management
- Advanced reporting and business intelligence

---

## Multi-Agent AI Vision

In future versions, NexoraMart will include an intelligent multi-agent system that can help manage the entire e-commerce platform.

The AI agents will work together to automate and improve store operations.

### Planned AI Agents

| Agent | Purpose |
|---|---|
| Customer Support Agent | Answers customer questions and support messages |
| Product Recommendation Agent | Suggests relevant products to customers |
| Order Management Agent | Helps process, track, and update orders |
| Inventory Agent | Monitors stock and predicts low-stock products |
| Marketing Agent | Creates product descriptions, promotions, and campaigns |
| Analytics Agent | Analyzes sales, customer behavior, and business performance |
| Review Analysis Agent | Analyzes customer reviews and identifies issues |
| Fraud Detection Agent | Detects suspicious orders and activities |

### Example Future Workflow

```text
Customer asks a question
        ↓
Support Agent understands the question
        ↓
Product Agent provides product information
        ↓
Order Agent checks order status if needed
        ↓
Support Agent sends a helpful response
        ↓
Admin reviews and approves if required
```

This will allow NexoraMart to become not only an e-commerce platform, but also an intelligent business assistant.

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test the project
5. Submit a pull request

---

## License

This project is created for educational and commercial development purposes.

---

## Author

**NexoraMart**

A modern full-stack e-commerce platform built to help businesses sell online, manage operations, and grow with intelligent tools.

---

## Support

For support, contact:

```text
furmangtv@gmail.com
```

WhatsApp:

```text
https://wa.me/923470095932
```
