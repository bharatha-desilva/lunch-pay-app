# Deployment Guide for LunchPay

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps
1. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import the repository

2. **Environment Variables**
   Set these in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-api-domain.com/api
   VITE_APP_NAME=LunchPay
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=production
   ```

3. **Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

4. **Deploy**
   - Push to main branch for automatic deployment
   - Or use Vercel CLI: `vercel --prod`

#### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Option 2: Netlify

#### Steps
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop `dist` folder to Netlify
   - Or connect GitHub repository

3. **Configure Environment Variables**
   Set in Site Settings → Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-api-domain.com/api
   VITE_APP_NAME=LunchPay
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=production
   ```

4. **Configure Redirects**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Option 3: GitHub Pages

#### Steps
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Build and deploy**
   ```bash
   npm run build
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Select gh-pages branch
   - Your app will be available at `https://<username>.github.io/<repository>`

### Option 4: Static Hosting (Apache/Nginx)

#### Build
```bash
npm run build
```

#### Apache Configuration
Add to `.htaccess` in `dist` folder:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

#### Nginx Configuration
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🔧 Environment Configuration

### Development
```env
VITE_API_BASE_URL=https://lunch-pay-generic-api.onrender.com
VITE_APP_NAME=LunchPay
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

### Staging
```env
VITE_API_BASE_URL=https://staging-api.yourapp.com/api
VITE_APP_NAME=LunchPay (Staging)
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=staging
```

### Production
```env
VITE_API_BASE_URL=https://api.yourapp.com/api
VITE_APP_NAME=LunchPay
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Application loads without errors
- [ ] All routes are accessible
- [ ] Authentication flow works
- [ ] API integration functions
- [ ] Responsive design on mobile/tablet
- [ ] Console shows no errors
- [ ] Environment variables are correct
- [ ] HTTPS is enabled
- [ ] Custom domain works (if configured)

## 🐛 Common Deployment Issues

### Build Fails
**Error**: TypeScript compilation errors
**Solution**: 
```bash
npm run type-check
# Fix any type errors
npm run build
```

### Routing Issues (404 on refresh)
**Error**: Page not found on direct URL access
**Solution**: Configure SPA fallback routing
- Vercel: Use `vercel.json` (already included)
- Netlify: Add `_redirects` file
- Apache: Use `.htaccess`

### Environment Variables Not Working
**Error**: API calls failing, undefined variables
**Solution**: 
1. Ensure variables start with `VITE_`
2. Restart development server after changes
3. Check deployment platform variable configuration

### CORS Issues
**Error**: API requests blocked by CORS
**Solution**: Configure backend to allow your domain
```javascript
// Backend CORS configuration example
app.use(cors({
  origin: ['https://your-app.vercel.app', 'https://your-domain.com']
}));
```

### Performance Issues
**Error**: Slow loading times
**Solution**:
1. Enable gzip compression
2. Configure CDN
3. Optimize images
4. Check bundle size: `npm run build` and review dist folder

## 📊 Monitoring

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Set up error tracking (Sentry)

### Analytics
- Google Analytics 4
- Vercel Analytics
- Custom usage tracking

## 🔄 CI/CD Pipeline

The included GitHub Actions workflow (`ci.yml`) provides:

1. **Automated Testing**
   - Linting with ESLint
   - Type checking with TypeScript
   - Code formatting verification
   - Build verification

2. **Automated Deployment**
   - Deploys to Vercel on main branch push
   - Requires secrets configuration:
     - `VERCEL_TOKEN`
     - `ORG_ID`
     - `PROJECT_ID`

### Setting up Vercel Secrets
1. Get Vercel token from dashboard
2. Add secrets to GitHub repository:
   - Settings → Secrets → Actions
   - Add required secrets

## 🚦 Deployment Strategies

### Blue-Green Deployment
1. Deploy to staging environment
2. Run smoke tests
3. Switch traffic to new version
4. Monitor for issues

### Rolling Deployment
1. Deploy to subset of servers
2. Monitor metrics
3. Gradually increase traffic
4. Complete rollout

### Feature Flags
Use environment variables for feature toggles:
```env
VITE_FEATURE_SETTLEMENTS=true
VITE_FEATURE_ANALYTICS=false
```

## 📝 Post-Deployment

### Health Checks
Create monitoring endpoints:
- `/health` - Application health
- `/version` - Build information
- `/api/status` - API connectivity

### Backup Strategy
- Regular database backups
- Configuration backups
- Disaster recovery plan

### Security
- Enable HTTPS
- Configure security headers
- Regular dependency updates
- Security scanning

---

For additional help, check the main README.md or create an issue in the repository.
