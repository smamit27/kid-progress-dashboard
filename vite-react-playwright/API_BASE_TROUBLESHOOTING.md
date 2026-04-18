# API_BASE Still Using Localhost - Troubleshooting Guide

## Problem
Even though the code says it should use `https://kid-progress-dashboard.onrender.com`, the app is still calling `http://127.0.0.1:8000/api/dashboard`.

## Root Causes & Solutions

### 1. ❌ **Browser Cache** (MOST COMMON)
The browser cached the old JavaScript bundle that had the localhost URL hardcoded.

**Solution:**
```
Hard refresh your browser:
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

Or clear your browser cache:
1. F12 (DevTools)
2. Settings (gear icon)
3. Storage → Clear site data
4. Close and reopen browser
```

### 2. ❌ **Old Build Still Running**
The production server might have the old build from before the code was updated.

**Solution - REQUIRED:**
```
1. Go to: https://dashboard.render.com
2. Select: kid-progress-dashboard
3. Click: "Manual Deploy" → "Redeploy latest commit"
4. Wait: 5-10 minutes for build to complete
5. Hard refresh browser (Cmd+Shift+R)
```

### 3. ❌ **Service Worker Caching**
Service worker might be serving old cached files.

**Solution:**
```
1. F12 (DevTools)
2. Application tab → Service Workers
3. Click: "Unregister" for all workers
4. Storage → Clear all
5. Close browser completely
6. Reopen and visit: https://kid-progress-dashboard.onrender.com
```

### 4. ❌ **Network Conditions**
Network throttling or offline mode might be interfering.

**Solution:**
```
1. F12 (DevTools)
2. Network tab
3. Check: "Throttling" dropdown (make sure it's "No throttling")
4. Offline checkbox should NOT be checked
```

---

## How to Verify the Fix

### Step 1: Open DevTools
```
Press: F12 or Cmd+Option+I
```

### Step 2: Open Console
```
Click: Console tab
```

### Step 3: Look for Debug Logs
You should see:
```
🔍 DEBUG: hostname = kid-progress-dashboard.onrender.com protocol = https:
✅ PRODUCTION MODE: Using https://kid-progress-dashboard.onrender.com
📡 API_BASE initialized as: https://kid-progress-dashboard.onrender.com
```

If you see something like:
```
🔍 DEBUG: hostname = 127.0.0.1 protocol = http:
✅ LOCAL MODE: Using http://127.0.0.1:8000
```

Then you're running locally (which is correct for local development).

### Step 4: Check Network Requests
```
1. Console shows API_BASE is correct
2. Click: Network tab
3. Perform action (e.g., click "Mark as Paid")
4. Look for API requests
5. Check "Request URL" column - should show:
   ✓ https://kid-progress-dashboard.onrender.com/api/fees
   NOT: http://127.0.0.1:8000/api/fees
```

---

## Common Issues & Fixes

### Issue 1: Seeing `http://127.0.0.1:8000` Calls
**Cause:** Old cached build is running

**Fix:**
1. Go to Render Dashboard
2. Redeploy latest commit
3. Wait 5-10 minutes
4. Hard refresh browser (Cmd+Shift+R)

### Issue 2: Console Shows Correct URL but Network Shows Wrong URL
**Cause:** Browser/Service Worker cache

**Fix:**
1. DevTools → Application → Service Workers
2. Unregister all workers
3. DevTools → Storage → Clear site data
4. Close browser completely
5. Reopen browser
6. Visit app fresh

### Issue 3: Redeploy Doesn't Fix It
**Cause:** Build process might not have picked up code changes

**Fix:**
1. Go to Render Dashboard
2. Click: ... menu (three dots)
3. Select: "Clear build cache"
4. Click: "Manual Deploy" → "Redeploy latest commit"
5. Wait for full rebuild (10-15 minutes)
6. Check Logs for: "Building image..."

### Issue 4: Network Shows Correct URL but Getting 404/500
**Cause:** Backend service not running or misconfigured

**Fix:**
1. Check Render Logs:
   - Look for: "Starting Python backend on port 8000..."
   - Look for: "Starting Nginx..."
2. If missing, backend didn't start
3. Restart service: Click "..." menu → "Restart"

---

## Code Changes Made

### Updated API_BASE Logic
```jsx
const API_BASE = (() => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  console.log("🔍 DEBUG: hostname =", hostname, "protocol =", protocol);
  
  // Local development only
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const localUrl = "http://127.0.0.1:8000";
    console.log("✅ LOCAL MODE: Using", localUrl);
    return localUrl;
  }
  
  // Production: ALWAYS use full HTTPS URL for Render
  const productionUrl = "https://kid-progress-dashboard.onrender.com";
  console.log("✅ PRODUCTION MODE: Using", productionUrl);
  return productionUrl;
})()
```

**Changes:**
- ✅ Added debug logging to console
- ✅ Explicitly checks for HTTPS protocol
- ✅ Forces production URL for all non-localhost domains
- ✅ Logs which mode is being used

---

## Complete Fix Procedure

If nothing else works, follow this **NUCLEAR OPTION** procedure:

### Step 1: Clear Everything Locally
```bash
# In your browser
1. Press F12
2. Application tab → Clear site data
3. Service Workers → Unregister all
4. Application → Cache Storage → Delete all
```

### Step 2: Clear Render Cache
```
1. Go to: https://dashboard.render.com
2. Select: kid-progress-dashboard
3. Click: ... menu (three dots)
4. Select: "Clear build cache"
```

### Step 3: Redeploy
```
1. Click: "Manual Deploy" → "Redeploy latest commit"
2. Wait: 10-15 minutes for full rebuild
3. Watch Logs for:
   ✓ "Fetching layers..."
   ✓ "Building image..."
   ✓ "Uploading image..."
   ✓ "Deploying..."
   ✓ "Starting services..."
```

### Step 4: Test Fresh
```
1. Close browser completely
2. Open new browser window
3. Visit: https://kid-progress-dashboard.onrender.com
4. Press F12 → Console
5. Should see:
   ✓ "🔍 DEBUG: hostname = kid-progress-dashboard.onrender.com"
   ✓ "✅ PRODUCTION MODE: Using https://..."
   ✓ "📡 API_BASE initialized as: https://..."
```

### Step 5: Verify
```
1. Click: Fees tab
2. Click: "Mark as Paid"
3. Network tab should show:
   ✓ OPTIONS /api/fees → 204
   ✓ POST /api/fees → 200
4. Response URL: https://kid-progress-dashboard.onrender.com/api/fees
5. Data updates in UI ✓
```

---

## Why This Happens

### Browser Caching
```
First Visit:
1. Browser downloads index.html
2. Downloads App.jsx with API_BASE = localhost
3. Caches everything

Code Updated:
4. New code has API_BASE = production URL
5. But browser still serves cached version
6. App still uses old localhost URL

Solution:
Hard refresh (Cmd+Shift+R) forces browser to download fresh copy
```

### Service Worker
```
Service workers are "offline-first" - they serve cached files
Even if code is updated, service worker keeps serving old cache
You must unregister the service worker to clear it
```

### Render Cache
```
Render caches Docker image layers
Old code might be built into cached image
"Clear build cache" forces fresh rebuild from latest code
```

---

## Git Commit

**Latest:** `c7349cf`
**Message:** "Fix: Add debug logging to API_BASE and ensure production URL is always used"

**Changes:**
- Added console logging for debugging
- Explicit protocol checking
- Clearer comments

---

## Next Steps

1. ✅ Code updated with debug logging (Commit c7349cf)
2. ⏳ **MUST redeploy on Render** - go to dashboard and click "Redeploy latest commit"
3. ⏳ Hard refresh browser (Cmd+Shift+R)
4. ⏳ Check Console for debug logs
5. ⏳ Verify Network shows production URL

**Status:** Code ready ✅ | Awaiting redeploy ⏳

---

## Questions?

If still seeing localhost after redeploy:
1. Check Console logs - what does it say?
2. Check Network - what's the actual request URL?
3. Check Render Logs - did backend start?
4. Try nuclear option (clear everything)
