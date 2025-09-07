# Deployment Guide for ISG Taxi Client

## 🚀 Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository
- Backend API deployed (e.g., on Vercel or Railway)

### Step 1: Prepare Environment Variables
Create a `.env` file in the client directory:
```env
VITE_API_BASE_URL=https://your-backend-api-url.vercel.app
VITE_APP_NAME=Eg Run Cab
VITE_APP_VERSION=1.0.0
```

### Step 2: Build Locally (Optional)
Test the build process:
```bash
cd client
npm install
npm run build
```

### Step 3: Deploy to Vercel
1. **Connect Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `client` directory as the root directory

2. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** client
   - **Build Command:** npm run build
   - **Output Directory:** dist

3. **Add Environment Variables:**
   ```
   VITE_API_BASE_URL = https://your-api-domain.vercel.app
   VITE_APP_NAME = Eg Run Cab
   VITE_APP_VERSION = 1.0.0
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Step 4: Verify Deployment
- Check the deployment logs for any errors
- Test the application in production
- Verify API calls are working correctly

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure your backend has proper CORS configuration
   - Check that `VITE_API_BASE_URL` points to the correct backend URL

2. **Build Failures:**
   - Check for syntax errors in JSX files
   - Ensure all imports are correct
   - Verify environment variables are set

3. **404 Errors on Refresh:**
   - The `vercel.json` and `_redirects` files handle SPA routing
   - If using Netlify, ensure `_redirects` is in the `public` folder

4. **API Connection Issues:**
   - Verify the backend API is deployed and accessible
   - Check that environment variables are correctly set in Vercel

## 🌐 Alternative Deployment Options

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Railway
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm run preview`
4. Add environment variables

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://isg-taxi-server.vercel.app` |
| `VITE_APP_NAME` | Application name | `Eg Run Cab` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## 🔍 Pre-deployment Checklist

- [ ] All imports are correct
- [ ] No console errors in development
- [ ] Build passes locally (`npm run build`)
- [ ] Environment variables are set
- [ ] Backend API is deployed and accessible
- [ ] CORS is configured on backend
- [ ] All routes are working in development

## 📞 Support

If you encounter issues during deployment:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check browser console for errors
