# 📍 Where to Add Your Credentials

This is a quick reference guide showing exactly where to add your Supabase credentials.

---

## 🎯 Quick Answer

**You need to add credentials in ONE place:**

### File: `.env`

**Location:** Root directory of the project

**⚠️ This file doesn't exist yet - you need to create it!**

---

## 📝 How to Create and Configure

### Step 1: Create the File
```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Open the File
Open `.env` in any text editor:
```bash
# Using nano
nano .env

# Using vim
vim .env

# Or open in your code editor (VS Code, etc.)
```

### Step 3: Replace Placeholder Values

**What you'll see (placeholders):**
```bash
VITE_SUPABASE_PROJECT_ID="your_project_id_here"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key_here"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
```

**What you need to change it to (your actual values):**
```bash
VITE_SUPABASE_PROJECT_ID="xyzabc123456"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://xyzabc123456.supabase.co"
```

### Step 4: Save the File
- Save and close the editor
- That's it! Your credentials are configured.

---

## 🔑 Where to Get These Values

### Go to Supabase Dashboard
1. Visit: https://supabase.com/
2. Sign in to your account
3. Select your project (or create a new one)
4. Go to **Settings** ⚙️ → **API**
5. Copy these three values:

| Value | Where to Find | What to Copy |
|-------|---------------|--------------|
| **Project ID** | Project Settings → API | The part before `.supabase.co` in your URL |
| **Publishable Key** | Project Settings → API → "anon public" | The long JWT token starting with "eyJ..." |
| **Project URL** | Project Settings → API → "URL" | The full URL: `https://xxxxx.supabase.co` |

---

## ✅ Verification

### After adding credentials, verify they work:

**Option 1: Use the setup script**
```bash
./check-setup.sh
```
Should show: ✓ .env file configured

**Option 2: Start the application**
```bash
npm run dev
```
If credentials are correct, the app will start without errors.

**Option 3: Try to create an account**
- Open http://localhost:5173
- Click "Sign up"
- If you can create an account, credentials are working!

---

## ⚠️ Common Mistakes

### Mistake 1: Not copying the entire key
**Wrong:** `VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOi..."`
**Right:** `VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M..."`
→ Make sure to copy the ENTIRE key, it's very long!

### Mistake 2: Extra spaces
**Wrong:** `VITE_SUPABASE_PROJECT_ID= "xyzabc123456"`
**Right:** `VITE_SUPABASE_PROJECT_ID="xyzabc123456"`
→ No space before or after the `=` sign

### Mistake 3: Wrong quotes
**Wrong:** `VITE_SUPABASE_PROJECT_ID='xyzabc123456'`
**Right:** `VITE_SUPABASE_PROJECT_ID="xyzabc123456"`
→ Use double quotes `"`, not single quotes `'`

### Mistake 4: Missing .env file
**Wrong:** Editing `.env.example`
**Right:** Create `.env` file and edit that
→ `.env.example` is just a template!

---

## 🔒 Security Notes

### ✅ Safe:
- The `.env` file is excluded from git (already in `.gitignore`)
- Your credentials won't be committed to the repository
- Keep this file on your local machine only

### ⚠️ Important:
- **NEVER** commit `.env` to git
- **NEVER** share your `.env` file publicly
- **NEVER** post your credentials in issues or forums
- If credentials are exposed, regenerate them in Supabase

---

## 📚 Need More Help?

| Question | Resource |
|----------|----------|
| How to get Supabase credentials? | [CREDENTIALS.md](./CREDENTIALS.md) - Detailed guide |
| Complete setup instructions | [SETUP.md](./SETUP.md) - Full setup guide |
| Quick start guide | [START_HERE.md](./START_HERE.md) - 5-step quick start |
| General information | [README.md](./README.md) - Project overview |

---

## 🎯 Summary

**In simple terms:**

1. **Create** `.env` file by copying `.env.example`
2. **Get** your credentials from Supabase dashboard
3. **Replace** the placeholder values in `.env`
4. **Save** the file
5. **Done!** Start using the app with `npm run dev`

**That's all you need to do!** 🎉

---

## 🆘 Still Having Issues?

If you're stuck:

1. **Run the verification script:** `./check-setup.sh`
2. **Read the detailed guide:** [CREDENTIALS.md](./CREDENTIALS.md)
3. **Check for typos** in your `.env` file
4. **Make sure** you copied the entire API key
5. **Try** creating a new Supabase project and start fresh

---

**Remember:** You only need to configure ONE file (`.env`) with THREE values!
