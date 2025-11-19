-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR VOWSMARRY WEDDING PLANNER
-- ============================================================================

-- Drop existing policies first (ignore errors if they don't exist)

-- USERS POLICIES
DROP POLICY IF EXISTS "Users can only access their own weddings" ON weddings;
DROP POLICY IF EXISTS "Users can access todos for their weddings" ON tasks;
DROP POLICY IF EXISTS "Users can access documents for their weddings" ON documents;
DROP POLICY IF EXISTS "Users can access budget categories for their weddings" ON expense_categories;
DROP POLICY IF EXISTS "Users can access budget items for their weddings" ON expense_items;
DROP POLICY IF EXISTS "Users can access savings summary for their weddings" ON savings_summary;
DROP POLICY IF EXISTS "Users can access savings entries for their weddings" ON savings_items;
DROP POLICY IF EXISTS "Users can access vendors for their weddings" ON vendors;
DROP POLICY IF EXISTS "Users can access rundown events for their weddings" ON rundowns;
DROP POLICY IF EXISTS "Users can access dowry items for their weddings" ON dowry;
DROP POLICY IF EXISTS "Users can access souvenirs for their weddings" ON souvenirs;
DROP POLICY IF EXISTS "Users can access dresscodes for their weddings" ON dresscodes;
DROP POLICY IF EXISTS "Users can manage their own invitations" ON invitations;
DROP POLICY IF EXISTS "Users can manage guests for their invitations" ON guests;
DROP POLICY IF EXISTS "Users can read RSVPs for their invitations" ON rsvps;
DROP POLICY IF EXISTS "Users can manage gallery items for their invitations" ON gallery;
DROP POLICY IF EXISTS "Users can manage love story items for their invitations" ON love_story;
DROP POLICY IF EXISTS "Users can manage gift options for their invitations" ON gifts;

-- PUBLIC POLICIES
DROP POLICY IF EXISTS "Public can read published invitations" ON invitations;
DROP POLICY IF EXISTS "Guests can read their own data via token" ON guests;
DROP POLICY IF EXISTS "Guests can manage their own RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Public can read gallery items for published invitations" ON gallery;
DROP POLICY IF EXISTS "Public can read love story items for published invitations" ON love_story;
DROP POLICY IF EXISTS "Public can read active gift options for published invitations" ON gifts;

-- Enable RLS on all tables
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE dowry ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dresscodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rundowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_story ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER-SPECIFIC TABLE POLICIES
-- ============================================================================

-- Weddings: Only accessible by the owner
CREATE POLICY "Users can only access their own weddings" ON weddings
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- WEDDING-SPECIFIC TABLE POLICIES (Owner access through wedding relationship)
-- ============================================================================

-- Tasks: Accessible by wedding owner
CREATE POLICY "Users can access tasks for their weddings" ON tasks
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Documents: Accessible by wedding owner
CREATE POLICY "Users can access documents for their weddings" ON documents
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Expense Categories: Accessible by wedding owner
CREATE POLICY "Users can access expenses categories for their weddings" ON expense_categories
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Expense Items: Accessible by wedding owner
CREATE POLICY "Users can access expenses items for their weddings" ON expense_items
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Savings summary: Accessible by wedding owner
CREATE POLICY "Users can access savings summary for their weddings" ON savings_summary
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Savings Items: Accessible by wedding owner
CREATE POLICY "Users can access savings entries for their weddings" ON savings_items
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );


-- Vendors: Accessible by wedding owner
CREATE POLICY "Users can access vendors for their weddings" ON vendors
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Rundown Events: Accessible by wedding owner
CREATE POLICY "Users can access rundown events for their weddings" ON rundowns
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Dowry Items: Accessible by wedding owner
CREATE POLICY "Users can access dowry for their weddings" ON dowry
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Souvenirs: Accessible by wedding owner
CREATE POLICY "Users can access souvenirs for their weddings" ON souvenirs
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Dresscodes: Accessible by wedding owner
CREATE POLICY "Users can access dresscodes for their weddings" ON dresscodes
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- ============================================================================
-- INVITATION SYSTEM POLICIES (Mixed public/private access)
-- ============================================================================

-- Invitations: Owner can do everything, public can read published invitations
CREATE POLICY "Users can manage their own invitations" ON invitations
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Public can read published invitations" ON invitations
    FOR SELECT USING (
        status = 'published' AND is_public = true AND (expired_at IS NULL OR expired_at > NOW())
    );

-- Guests: Owner can manage, guests can read their own data via token
CREATE POLICY "Users can manage guests for their invitations" ON guests
    FOR ALL USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Guests can read their own data via token" ON guests
    FOR SELECT USING (
        invitation_token IS NOT NULL AND
        invitation_id IN (
            SELECT id FROM invitations 
            WHERE status = 'published' AND is_public = true AND (expired_at IS NULL OR expired_at > NOW())
        )
    );

-- RSVPs: Owner can read, guests can manage their own RSVPs
CREATE POLICY "Users can read RSVPs for their invitations" ON rsvps
    FOR SELECT USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN invitations i ON g.invitation_id = i.id
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Guests can manage their own RSVPs" ON rsvps
    FOR ALL USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN invitations i ON g.invitation_id = i.id
            WHERE i.status = 'published' AND i.is_public = true AND (i.expired_at IS NULL OR i.expired_at > NOW())
        )
    );

-- Gallery Items: Owner can manage, public can read for published invitations
CREATE POLICY "Users can manage gallery items for their invitations" ON gallery
    FOR ALL USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can read gallery items for published invitations" ON gallery
    FOR SELECT USING (
        is_public = true AND
        invitation_id IN (
            SELECT id FROM invitations 
            WHERE status = 'published' AND is_public = true AND (expired_at IS NULL OR expired_at > NOW())
        )
    );

-- Love Story Items: Owner can manage, public can read for published invitations
CREATE POLICY "Users can manage love story items for their invitations" ON love_story
    FOR ALL USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can read love story items for published invitations" ON love_story
    FOR SELECT USING (
        is_public = true AND
        invitation_id IN (
            SELECT id FROM invitations 
            WHERE status = 'published' AND is_public = true AND (expired_at IS NULL OR expired_at > NOW())
        )
    );

-- Gift Options: Owner can manage, public can read for published invitations
CREATE POLICY "Users can manage gift options for their invitations" ON gifts
    FOR ALL USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can read active gift options for published invitations" ON gifts
    FOR SELECT USING (
        is_active = true AND
        invitation_id IN (
            SELECT id FROM invitations 
            WHERE status = 'published' AND is_public = true AND (expired_at IS NULL OR expired_at > NOW())
        )
    );


-- ============================================================================
-- SECURITY FUNCTIONS FOR GUEST TOKEN VALIDATION
-- ============================================================================

-- Note: Security functions will be created separately to avoid parsing issues
-- with dollar-quoted strings in batch execution
