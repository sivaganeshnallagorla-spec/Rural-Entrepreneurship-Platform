# Contributing to Rural Entrepreneurship Platform 🌾

Thank you for your interest in contributing to our platform! We are building technology to empower rural farmers and promote sustainable entrepreneurship.

## 🛠️ Development Environment Setup

1. **System Requirements**: Node.js (v20+), npm (v9+).
2. **Clone the Repo**:
   ```bash
   git clone <repository-url>
   cd FEDFW
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Environment Variables**:
   Copy `.env.example` to `.env` (or create one) and fill in the required variables.
   ```bash
   cp .env.example .env
   ```
5. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🧪 Test Coverage Requirements

We aim for high reliability. Please ensure:
- **Unit Tests**: New logic in `utils/` or `hooks/` must include unit tests.
- **Component Tests**: Major UI components should be tested for accessibility and basic rendering.
- **Minimum Coverage**: 80% coverage on new feature code is recommended.

## 🌿 Branch Naming Convention

Please follow these prefixes for your branches:
- `feature/` - New features (e.g., `feature/profile-image-upload`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `hotfix/` - Critical production fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring without feature changes

## ✅ Pull Request Checklist

Before submitting a PR, please ensure:
- [ ] Branch follows the naming convention.
- [ ] Code is formatted and linted (`npm run lint`).
- [ ] New features are documented in `README.md` or `src/api/README.md`.
- [ ] Tests pass locally (`npm test`).
- [ ] No hardcoded secrets or API keys.
- [ ] "Demo Mode" compatibility is maintained.

## 📝 Commit Messages

We prefer [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add drone booking service`
- `fix: resolve cart total calculation error`
- `docs: update deployment instructions`

---

Built with ❤️ for rural empowerment.
