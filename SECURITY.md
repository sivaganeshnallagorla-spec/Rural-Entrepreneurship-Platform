# Security Policy 🛡️

## Responsible Disclosure

If you find a security vulnerability in this project, please report it privately to our team. We aim to acknowledge reports within 48 hours and provide a fix as soon as possible.

**Contact**: security@ruralplatform.in

Please do not report security issues via public GitHub issues.

## ⚠️ Known Security Limitations (Demo Mode)

The Rural Entrepreneurship Platform is currently in **Demo Mode**. While we take best-effort measures, please be aware of these known limitations in the current version:

1.  **Local Storage Security**: Data (products, orders, user profile) is saved to `localStorage` using `secureStorage` which encodes it to Base64. This is NOT encryption. Do not store sensitive personal information or real financial data in demo mode.
2.  **Authentication**: In demo mode, predefined users' passwords are compared as plain text in the context for convenience. In production mode, we use hashed password comparison and JWT authentication via Supabase/FastAPI.
3.  **Cross-Site Scripting (XSS)**: While we use React's built-in escaping, some dynamic components (like the Skill Center's resource descriptions) might render user-provided text. We recommend sanitizing all dynamic content before deploying to production.
4.  **No CSRF Protection**: Demo mode lacks CSRF tokens since it's entirely client-side. Our integrated FastAPI backend implements standard security middleware, but this is only active in `VITE_APP_DEMO_MODE=false`.
5.  **Session Expiry**: Sessions are tracked in `localStorage`. If someone gains access to the browser, they could potentially copy the `auth_session` string. Always log out after use.

## 🔐 Future Security Roadmap

- **Aadhaar/UPI Integration**: For verified farmer identity.
- **Advanced Encryption**: Implementing `AES-256` for local data persistence.
- **Audit Logs**: For all farmer transactions and admin operations.
- **External Security Audit**: Before going live with real financial transactions.

---

We value your privacy and security. Report responsibly!
