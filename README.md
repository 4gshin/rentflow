# 🏎️ RENTFLOW — Premium Car Rental Ecosystem

RentFlow is a full-stack premium car rental application designed with a high-end, minimalist corporate aesthetic inspired by modern digital studio workflows. The ecosystem isolates active driving operations into a clear dashboard workspace, while abstracting user profiles and historical transactions into a real-time identity layout.

---

## 💎 Design Philosophy & Core Features

*   **The Fleet Interface:** A high-end luxury vehicle inventory segmented dynamically by performance tiers (`Economic`, `Comfort`, `Prestige`, `Premium`, `Luxury`).
*   **Dual Garage Architecture:** Complete functional separation of user entities:
    *   **Live Operations (My Garage):** Dedicated tracking workspace rendering only active or upcoming verified rental sessions.
    *   **Identity Dropdown (Face Card):** A persistent header component handling authentication states, user metadata, and a compiled history stream of past transactions.
*   **Smart Rental Validations:** Backend algorithms preventing chronological overlaps for individual vehicles, bundled with client-side status mapping (e.g., automated *Visit Office to Approve* workflows for pending logs).

---

## 🛠️ Technical Architecture

### Frontend
*   **Core:** React (Vite)
*   **Routing:** React Router DOM (Declarative view matching)
*   **Styling:** Tailwind CSS (Custom ultra-clean layout variables, explicit typography constraints)
*   **State & Sync:** LocalStorage persistent sync hooks, Window storage event listeners for real-time authentication tracking.

### Backend & Database
*   **Runtime & Framework:** Node.js + Express
*   **Database Engine:** Relational MySQL
*   **Authentication & Security:** JSON Web Tokens (JWT) secured via custom Bearer route middlewares.
*   **Infrastructure:** Formatted response handling configured for deployment.

---

## 🗄️ Database Schema Blueprint

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) DEFAULT NULL,
    bio VARCHAR(150) DEFAULT 'Premium Driver'
);

CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    category ENUM('Economic', 'Comfort', 'Prestige', 'Premium', 'Luxury') DEFAULT 'Economic'
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    car_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);