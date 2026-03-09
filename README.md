# Pharmacy (MEDCORE)

MEDCORE is a single-page pharmacy web application built with AngularJS 1.x and Supabase REST/Auth APIs.
It includes a customer storefront (browse medicines, cart, checkout) and an admin area (dashboard, alerts, inventory, users, invoices, and purchase history).

## Features

- Customer-facing pages:
  - Home, About, Contact
  - Shop with search and price filtering
  - Cart, Checkout, Confirmation
  - User profile
- Authentication:
  - Sign up and login via Supabase Auth
  - Session and role stored in `localStorage`
- Role-based access:
  - Admin-only routes are protected in `app.js`
  - Non-admin users are redirected to `/login` for admin pages
- Admin area:
  - Dashboard with low-stock and expired medicine indicators
  - Alerts
  - Inventory
  - Sales invoices
  - Users management view
  - Purchase history view

## Tech Stack

- AngularJS `1.6.9` + `ngRoute`
- Supabase REST + Auth APIs
- Bootstrap 5
- Tailwind CSS (with `preflight` disabled)
- Plain JavaScript, HTML, CSS

## Project Structure

- `index.html`: app shell, shared navigation, script/style includes
- `app.js`: Angular module, route definitions, route guarding, global auth/cart state
- `medcore-config.js`: Supabase URL/key and shared constants
- `controllers/`: page-level controllers (login, register, dashboard, inventory, etc.)
- `services/`: API interaction layers
- `views/`: route templates
- `js/`: cart, checkout, confirmation, profile logic
- `css/`: global and page styling

## Routes

### Public/User routes
- `#!/home`
- `#!/login`
- `#!/register`
- `#!/shop`
- `#!/profile`
- `#!/cart`
- `#!/checkout`
- `#!/confirmation`
- `#!/aboutus`
- `#!/contactus`

### Admin routes
- `#!/dashboard`
- `#!/alerts`
- `#!/inventory`
- `#!/sales-invoices`
- `#!/users`
- `#!/purchase-history`


