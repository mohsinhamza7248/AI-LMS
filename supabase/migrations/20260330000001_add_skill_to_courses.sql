-- Add skill column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS skill TEXT;

-- Seed default categories if none exist for any tenant
INSERT INTO categories (name, slug, icon, tenant_id)
SELECT 'Fashion & Design', 'fashion-design', '🎨', id FROM tenants
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE tenant_id = tenants.id)
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, slug, icon, tenant_id)
SELECT 'Handicraft & Art', 'handicraft-art', '🧵', id FROM tenants
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE tenant_id = tenants.id AND name = 'Handicraft & Art')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, slug, icon, tenant_id)
SELECT 'Textile & Weaving', 'textile-weaving', '🪡', id FROM tenants
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE tenant_id = tenants.id AND name = 'Textile & Weaving')
ON CONFLICT DO NOTHING;
