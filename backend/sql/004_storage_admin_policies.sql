-- NexoraMart Storage security policies
-- Public bucket: anyone may read objects.
-- Only admins may upload, update, or delete objects.

begin;

-- Public read access only for the product-images bucket.
create policy "Public can read product images"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'product-images'
);

-- Admins may read all objects in product-images.
-- This is also required for upload and delete workflows.
create policy "Admin can select product images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
);

-- Only admins may upload files to product-images.
create policy "Admin can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

-- Only admins may update product images.
create policy "Admin can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
)
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

-- Only admins may delete product images.
create policy "Admin can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
);

commit;