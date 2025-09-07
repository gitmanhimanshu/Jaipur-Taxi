# ISG Taxi Client

A modern React application for taxi and tour booking services.

## Features

- 🚗 Taxi service booking
- 🏛️ Tour package booking
- 👤 User authentication and profiles
- 📱 Responsive design
- ⚡ Fast loading with Vite
- 🎨 Modern UI with Tailwind CSS

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Base URL
VITE_API_BASE_URL=https://isg-taxi-server.vercel.app

# App Configuration
VITE_APP_NAME=Eg Run Cab
VITE_APP_VERSION=1.0.0
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Build

```bash
npm run preview
```

## Deployment

### Vercel Deployment

1. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Connect your GitHub repository

2. **Configure Environment Variables:**
   - In Vercel dashboard, go to your project settings
   - Add the following environment variables:
     ```
     VITE_API_BASE_URL=https://your-api-url.vercel.app
     VITE_APP_NAME=Eg Run Cab
     VITE_APP_VERSION=1.0.0
     ```

3. **Deploy:**
   - Vercel will automatically detect the `vercel.json` configuration
   - Click "Deploy"

### Manual Build

```bash
# Build the project
npm run build

# The build artifacts will be stored in the `dist/` directory
```

## Project Structure

```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ...
│   ├── services/
│   │   └── api.js
│   ├── config/
│   │   └── config.js
│   ├── App.jsx
│   └── main.jsx
├── vercel.json
├── vite.config.js
├── package.json
└── README.md
```

## API Integration

The application uses Axios for API calls with the following structure:

- **Base URL:** Configured via `VITE_API_BASE_URL`
- **Authentication:** JWT token stored in localStorage
- **Error Handling:** Automatic logout on 401 errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.