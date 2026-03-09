# emptyRepositoryTest10

A modern HTML5, CSS3, and JavaScript web application built with best practices and clean architecture.

## Features

- 🎨 Modern CSS3 with custom properties and flexbox
- 📱 Responsive design
- ⚡ Vanilla JavaScript ES6+ 
- 🔧 ESLint and Prettier configuration
- 📦 NPM scripts for development workflow
- 🌐 Live development server

## Tech Stack

- **HTML5** - Semantic markup with modern standards
- **CSS3** - Modern styling with custom properties, flexbox, and grid
- **JavaScript** - ES6+ vanilla JavaScript with modular architecture
- **Git** - Version control with proper gitignore configuration

## Project Structure

```
├── src/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   ├── components.css    # Component styles
│   │   └── utilities.css     # Utility classes
│   ├── js/
│   │   ├── app.js           # Main application entry point
│   │   ├── modules/         # JavaScript modules
│   │   └── utils/           # Utility functions
│   └── assets/
│       └── images/          # Image assets
├── index.html               # Main HTML file
├── package.json            # NPM configuration
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd emptyRepositoryTest10
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```
   This will start a live server at `http://localhost:8080` with auto-reload.

2. Alternative development server:
   ```bash
   npm start
   ```
   This will start a simple HTTP server without live reload.

### Code Quality

- **Lint JavaScript code:**
  ```bash
  npm run lint
  ```

- **Fix linting issues automatically:**
  ```bash
  npm run lint:fix
  ```

- **Format code with Prettier:**
  ```bash
  npm run format
  ```

- **Check code formatting:**
  ```bash
  npm run format:check
  ```

- **Run build process (lint + format check):**
  ```bash
  npm run build
  ```

## Development Guidelines

### JavaScript
- Use ES6+ features
- Follow modular architecture
- Use async/await for asynchronous operations
- Follow ESLint configuration

### CSS
- Use CSS custom properties for theming
- Follow BEM methodology for class naming
- Use flexbox and grid for layouts
- Mobile-first responsive design

### HTML
- Use semantic HTML5 elements
- Include proper meta tags
- Ensure accessibility standards

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run build` to ensure code quality
5. Commit your changes
6. Push to your branch
7. Create a Pull Request

## License

MIT License - see LICENSE file for details