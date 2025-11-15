# Phantom Wallet Setup Guide

## Issue: window.solana is undefined

If `window.solana` is showing as `undefined` in the browser console, it means the Phantom extension is not injecting into the page.

## Step-by-Step Fix

### 1. Verify Phantom is Installed

**Chrome/Edge:**
- Go to `chrome://extensions/` (or `edge://extensions/`)
- Look for "Phantom" in the list
- Make sure it's **ENABLED** (toggle should be blue/on)

**Firefox:**
- Go to `about:addons`
- Look for "Phantom" in Extensions
- Make sure it's **Enabled**

### 2. Check Extension Status

- The Phantom icon should appear in your browser toolbar
- Click it - it should open the Phantom wallet interface
- If it doesn't open, the extension may be disabled or not installed

### 3. Install Phantom (if not installed)

1. Go to https://phantom.app/
2. Click "Download" for your browser
3. Follow the installation instructions
4. **IMPORTANT:** After installing, **restart your browser completely**

### 4. Verify Installation

1. Open browser console (F12)
2. Type: `window.solana`
3. Press Enter
4. You should see an object (not `undefined`)

### 5. If Still Undefined

**Try these solutions:**

1. **Hard Refresh the Page:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Restart Browser:**
   - Completely close and reopen your browser
   - Don't just refresh the tab

3. **Check Browser Permissions:**
   - Make sure Phantom has permission to run on the page
   - Check if any ad blockers are interfering

4. **Try Incognito/Private Mode:**
   - Sometimes extensions work differently in private mode
   - Test if Phantom works there

5. **Disable Other Extensions:**
   - Some extensions can block wallet injection
   - Try disabling ad blockers or privacy extensions temporarily

6. **Check Browser Compatibility:**
   - Phantom works on: Chrome, Edge, Firefox, Brave
   - Make sure you're using a supported browser

### 6. Manual Test

In browser console, run:
```javascript
// Check if Phantom exists
console.log('window.solana:', window.solana);
console.log('window.phantom:', window.phantom);

// Try to detect
if (window.solana && window.solana.isPhantom) {
    console.log('✅ Phantom detected!');
} else if (window.solana) {
    console.log('⚠️ window.solana exists but isPhantom is false');
} else {
    console.log('❌ window.solana is undefined');
}
```

## Common Issues

### Extension Installed but Not Working
- **Solution:** Disable and re-enable the extension
- Go to extensions page → Toggle off → Toggle on

### Browser Security Settings
- Some browsers block extension injection on local files
- Try accessing via `http://localhost` or a web server instead of `file://`

### Multiple Wallet Extensions
- Having multiple Solana wallets installed can cause conflicts
- Try disabling other Solana wallet extensions temporarily

## Still Not Working?

If `window.solana` is still undefined after trying all steps:

1. Check Phantom's official documentation: https://docs.phantom.app/
2. Make sure you're using the latest version of Phantom
3. Check if there are any browser console errors
4. Try a different browser to isolate the issue

## Alternative: Use Solflare

If Phantom continues to have issues, the code also supports Solflare wallet:
- Install from: https://solflare.com/
- The code will automatically detect it

