-- ══════════════════════════════════════════════════════════════════════════════
--  Rural Entrepreneurship Platform — Supabase SQL Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ─────────────────────────────────────────────────────────────────────────────
--  1. PROFILES  (extends Supabase auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username        TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    email           TEXT UNIQUE,
    phone           TEXT,
    role            TEXT NOT NULL CHECK (role IN ('admin', 'farmer', 'buyer')),
    avatar_url      TEXT,
    bio             TEXT,
    language        TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi', 'te', 'ta')),
    address         JSONB,                    -- { street, city, state, pincode, country }
    -- Farmer fields
    farm_name       TEXT,
    farm_size       TEXT,
    crops           TEXT[],
    certifications  TEXT[],
    is_verified     BOOLEAN DEFAULT FALSE,
    -- Buyer fields
    buyer_type      TEXT CHECK (buyer_type IN ('individual', 'retailer', 'wholesaler', 'exporter')),
    subscription    JSONB,                    -- { active, plan, startDate, endDate }
    -- Status
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─────────────────────────────────────────────────────────────────────────────
--  2. PRODUCTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title               TEXT NOT NULL,
    description         TEXT NOT NULL,
    category            TEXT NOT NULL CHECK (category IN (
                            'Grains & Cereals','Vegetables','Fruits','Dairy & Eggs',
                            'Spices & Herbs','Processed Foods','Organic Products',
                            'Handmade Products','Other')),
    product_type        TEXT DEFAULT 'raw' CHECK (product_type IN ('raw', 'value-added')),
    price               NUMERIC(10,2) NOT NULL CHECK (price > 0),
    unit                TEXT NOT NULL CHECK (unit IN ('kg','g','litre','ml','piece','dozen','packet','box')),
    stock               INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_order_quantity  INTEGER DEFAULT 1,
    images              JSONB DEFAULT '[]',   -- [{ url, path }]
    tags                TEXT[] DEFAULT '{}',
    is_organic          BOOLEAN DEFAULT FALSE,
    is_fair_trade       BOOLEAN DEFAULT FALSE,
    is_available        BOOLEAN DEFAULT TRUE,
    location_state      TEXT,
    location_district   TEXT,
    average_rating      NUMERIC(3,1) DEFAULT 0,
    review_count        INTEGER DEFAULT 0,
    status              TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    rejection_reason    TEXT,
    -- Full-text search vector
    search_vector       TSVECTOR,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search: auto-update search_vector
CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector =
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_update
    BEFORE INSERT OR UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

CREATE TRIGGER products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_products_farmer    ON public.products(farmer_id);
CREATE INDEX idx_products_status    ON public.products(status);
CREATE INDEX idx_products_category  ON public.products(category);
CREATE INDEX idx_products_search    ON public.products USING GIN(search_vector);


-- ─────────────────────────────────────────────────────────────────────────────
--  3. ORDERS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id         UUID NOT NULL REFERENCES public.profiles(id),
    farmer_id        UUID NOT NULL REFERENCES public.profiles(id),
    items            JSONB NOT NULL,     -- [{ product_id, title, price, unit, quantity, subtotal }]
    shipping_address JSONB NOT NULL,     -- { name, street, city, state, pincode, phone }
    shipping_method  TEXT DEFAULT 'standard' CHECK (shipping_method IN ('standard','express','priority')),
    shipping_cost    NUMERIC(8,2) DEFAULT 0,
    shipping_eta     TEXT,
    subtotal         NUMERIC(10,2) NOT NULL,
    total_amount     NUMERIC(10,2) NOT NULL,
    payment_method   TEXT NOT NULL CHECK (payment_method IN ('upi','card','netbanking','cod')),
    payment_status   TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
    payment_id       TEXT,
    order_status     TEXT DEFAULT 'placed' CHECK (order_status IN (
                         'placed','confirmed','processing','ready_to_ship',
                         'shipped','out_for_delivery','delivered','cancelled','disputed')),
    status_history   JSONB DEFAULT '[]',  -- [{ status, note, timestamp }]
    tracking_number  TEXT,
    tracking_url     TEXT,
    dispute          JSONB DEFAULT '{"raised": false}',
    invoice_url      TEXT,
    notes            TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_orders_buyer    ON public.orders(buyer_id, created_at DESC);
CREATE INDEX idx_orders_farmer   ON public.orders(farmer_id, created_at DESC);
CREATE INDEX idx_orders_status   ON public.orders(order_status);


-- ─────────────────────────────────────────────────────────────────────────────
--  4. MESSAGES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    attachment  JSONB,    -- { url, type }
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_pair ON public.messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_messages_unread ON public.messages(receiver_id, is_read) WHERE is_read = FALSE;


-- ─────────────────────────────────────────────────────────────────────────────
--  5. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title      TEXT NOT NULL,
    message    TEXT NOT NULL,
    type       TEXT DEFAULT 'system' CHECK (type IN ('order','message','product','payment','system','review')),
    is_read    BOOLEAN DEFAULT FALSE,
    link       TEXT,
    meta       JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);


-- ─────────────────────────────────────────────────────────────────────────────
--  6. KNOWLEDGE MODULES + RESOURCES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.knowledge_modules (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title        TEXT NOT NULL,
    description  TEXT,
    icon         TEXT DEFAULT 'MenuBook',
    color        TEXT DEFAULT '#4caf50',
    target_role  TEXT DEFAULT 'farmer' CHECK (target_role IN ('farmer','buyer','all')),
    is_published BOOLEAN DEFAULT TRUE,
    "order"      INTEGER DEFAULT 0,
    created_by   UUID REFERENCES public.profiles(id),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.knowledge_resources (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id     UUID NOT NULL REFERENCES public.knowledge_modules(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT,
    url           TEXT,
    resource_type TEXT DEFAULT 'article' CHECK (resource_type IN ('article','video','pdf','link')),
    tags          TEXT[] DEFAULT '{}',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resources_module ON public.knowledge_resources(module_id);


-- ─────────────────────────────────────────────────────────────────────────────
--  7. REVIEWS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    farmer_id   UUID NOT NULL REFERENCES public.profiles(id),
    buyer_id    UUID NOT NULL REFERENCES public.profiles(id),
    order_id    UUID REFERENCES public.orders(id),
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    images      JSONB DEFAULT '[]',
    reply_text  TEXT,
    replied_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, buyer_id)   -- one review per buyer per product
);

CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_reviews_farmer  ON public.reviews(farmer_id);

-- Auto-update product average_rating after review insert/delete
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    p_id UUID;
    avg_r NUMERIC;
    cnt  INTEGER;
BEGIN
    p_id = COALESCE(NEW.product_id, OLD.product_id);
    SELECT ROUND(AVG(rating)::NUMERIC, 1), COUNT(*)
    INTO avg_r, cnt
    FROM public.reviews WHERE product_id = p_id;

    UPDATE public.products
    SET average_rating = COALESCE(avg_r, 0),
        review_count   = COALESCE(cnt, 0)
    WHERE id = p_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();


-- ─────────────────────────────────────────────────────────────────────────────
--  8. HELPER FUNCTIONS (called from FastAPI via supabase.rpc())
-- ─────────────────────────────────────────────────────────────────────────────
-- Safely decrement product stock (no negative stock)
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_qty INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.products
    SET stock = GREATEST(stock - p_qty, 0)
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Restore stock on cancellation
CREATE OR REPLACE FUNCTION increment_stock(p_product_id UUID, p_qty INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.products
    SET stock = stock + p_qty
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;


-- ─────────────────────────────────────────────────────────────────────────────
--  9. AUTO-CREATE PROFILE AFTER SIGNUP (Supabase Auth hook)
--  Trigger fires when a new user signs up via Supabase Auth
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Profile is created by the FastAPI /register endpoint with full data.
    -- This trigger is a safety fallback in case someone signs up via other means.
    INSERT INTO public.profiles (id, email, name, username, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────────────────────────────────────
--  10. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_modules  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews            ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ─────────────────────────────────────────────────────────────────
-- Anyone can read public profile info (for farmer browsing)
CREATE POLICY "profiles_public_read" ON public.profiles
    FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_own_update" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ── PRODUCTS ──────────────────────────────────────────────────────────────────
-- Anyone can browse approved products
CREATE POLICY "products_public_read" ON public.products
    FOR SELECT USING (status = 'approved' OR farmer_id = auth.uid());

-- Farmers can insert their own products
CREATE POLICY "products_farmer_insert" ON public.products
    FOR INSERT WITH CHECK (farmer_id = auth.uid());

-- Farmers can update/delete their own; admins can update any
CREATE POLICY "products_farmer_update" ON public.products
    FOR UPDATE USING (farmer_id = auth.uid());

CREATE POLICY "products_farmer_delete" ON public.products
    FOR DELETE USING (farmer_id = auth.uid());

-- ── ORDERS ────────────────────────────────────────────────────────────────────
CREATE POLICY "orders_buyer_read" ON public.orders
    FOR SELECT USING (buyer_id = auth.uid() OR farmer_id = auth.uid());

CREATE POLICY "orders_buyer_insert" ON public.orders
    FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "orders_update" ON public.orders
    FOR UPDATE USING (buyer_id = auth.uid() OR farmer_id = auth.uid());

-- ── MESSAGES ─────────────────────────────────────────────────────────────────
CREATE POLICY "messages_own" ON public.messages
    FOR ALL USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
CREATE POLICY "notifications_own" ON public.notifications
    FOR ALL USING (user_id = auth.uid());

-- ── KNOWLEDGE MODULES ─────────────────────────────────────────────────────────
CREATE POLICY "knowledge_public_read" ON public.knowledge_modules
    FOR SELECT USING (is_published = true);

CREATE POLICY "knowledge_resources_public_read" ON public.knowledge_resources
    FOR SELECT USING (true);

-- ── REVIEWS ───────────────────────────────────────────────────────────────────
CREATE POLICY "reviews_public_read" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "reviews_buyer_insert" ON public.reviews
    FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "reviews_buyer_delete" ON public.reviews
    FOR DELETE USING (buyer_id = auth.uid());

CREATE POLICY "reviews_farmer_reply" ON public.reviews
    FOR UPDATE USING (farmer_id = auth.uid());


-- ─────────────────────────────────────────────────────────────────────────────
--  11. STORAGE BUCKETS  (run separately or via Supabase dashboard)
-- ─────────────────────────────────────────────────────────────────────────────
-- Run in Supabase Dashboard → Storage → New bucket, OR via SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES
    ('product-images', 'product-images', true),
    ('avatars',        'avatars',        true),
    ('stories',        'stories',        true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload to their own folder
CREATE POLICY "product_images_upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "product_images_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "avatars_upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "avatars_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );


-- ─────────────────────────────────────────────────────────────────────────────
--  12. REALTIME  — enable for live messaging & notifications
-- ─────────────────────────────────────────────────────────────────────────────
-- Run in Supabase Dashboard → Database → Replication → Tables
-- OR via SQL:

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;


-- ─────────────────────────────────────────────────────────────────────────────
--  13. SEED DATA — demo users & knowledge modules
-- ─────────────────────────────────────────────────────────────────────────────
-- NOTE: Create auth users via Supabase Dashboard → Authentication → Users
-- then run this to add their profiles. Replace UUIDs with actual auth user IDs.

-- Knowledge modules seed
INSERT INTO public.knowledge_modules (title, description, icon, color, target_role, "order") VALUES
('Crop Processing',       'Learn to transform raw crops into value-added products',   'Agriculture',   '#4caf50', 'farmer', 1),
('Packaging & Branding',  'Professional packaging techniques to increase product value','Inventory',    '#ff9800', 'farmer', 2),
('Digital Marketing',     'Use social media and online platforms to reach more buyers','Campaign',      '#2196f3', 'farmer', 3),
('Business & Finance',    'Pricing, profit, bookkeeping, and micro-finance basics',    'AccountBalance','#9c27b0', 'farmer', 4),
('Export Guide',          'How to sell to global buyers and export your products',     'Public',        '#f44336', 'farmer', 5),
('Government Schemes',    'Subsidies, loans, and schemes for rural entrepreneurs',     'AccountTree',   '#009688', 'all',    6)
ON CONFLICT DO NOTHING;
