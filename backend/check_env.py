from app.core.config import settings

url = settings.supabase_url
key = settings.supabase_publishable_key

print("SUPABASE_URL loaded:", bool(url))
print("SUPABASE_URL starts correctly:", url.startswith("https://"))
print("Publishable key loaded:", bool(key))
print("Publishable key starts correctly:", key.startswith("sb_publishable_"))
print("Publishable key length:", len(key))