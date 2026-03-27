-- Create a demo tenant
INSERT INTO tenants (name, slug, theme) 
VALUES ('Demo Academy', 'demo', '{"primary_color": "#6366f1", "secondary_color": "#8b5cf6", "platform_name": "Demo Academy"}');

-- Set variable for demo tenant id
DO $$
DECLARE 
    demo_id UUID;
BEGIN
    SELECT id INTO demo_id FROM tenants WHERE slug = 'demo';

    -- Insert Categories
    INSERT INTO categories (name, slug, tenant_id) VALUES 
    ('Programming', 'programming', demo_id),
    ('Design', 'design', demo_id),
    ('Business', 'business', demo_id);

END $$;
