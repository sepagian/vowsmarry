-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR VOWSMARRY WEDDING PLANNER
-- ============================================================================

-- Drop existing policies first (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Users can only access their own weddings" ON weddings;
DROP POLICY IF EXISTS "Users can only access their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can access documents for their weddings" ON documents;
DROP POLICY IF EXISTS "Users can access document reminders for their weddings" ON document_reminders;
DROP POLICY IF EXISTS "Users can access budget categories for their weddings" ON budget_categories;
DROP POLICY IF EXISTS "Users can access budget items for their weddings" ON budget_items;
DROP POLICY IF EXISTS "Users can access budget alerts for their weddings" ON budget_alerts;
DROP POLICY IF EXISTS "Users can access todos for their weddings" ON todos;
DROP POLICY IF EXISTS "Users can access vendors for their weddings" ON vendors;
DROP POLICY IF EXISTS "Users can access savings goals for their weddings" ON savings_goals;
DROP POLICY IF EXISTS "Users can access savings summaries for their weddings" ON savings_summaries;
DROP POLICY IF EXISTS "Users can access savings entries for their weddings" ON savings_entries;
DROP POLICY IF EXISTS "Users can access dowry items for their weddings" ON dowry_items;
DROP POLICY IF EXISTS "Users can access souvenirs for their weddings" ON souvenirs;
DROP POLICY IF EXISTS "Users can access souvenir distribution for their weddings" ON souvenir_distribution;
DROP POLICY IF EXISTS "Users can access dresscodes for their weddings" ON dresscodes;
DROP POLICY IF EXISTS "Users can access rundown events for their weddings" ON rundown_events;
DROP POLICY IF EXISTS "Users can manage their own invitations" ON invitations;
DROP POLICY IF EXISTS "Public can read published invitations" ON invitations;
DROP POLICY IF EXISTS "Users can manage guests for their invitations" ON guests;
DROP POLICY IF EXISTS "Guests can read their own data via token" ON guests;
DROP POLICY IF EXISTS "Users can read RSVPs for their invitations" ON rsvps;
DROP POLICY IF EXISTS "Guests can manage their own RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Users can manage gallery items for their invitations" ON gallery_items;
DROP POLICY IF EXISTS "Public can read gallery items for published invitations" ON gallery_items;
DROP POLICY IF EXISTS "Guests can upload gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Users can manage love story items for their invitations" ON love_story_items;
DROP POLICY IF EXISTS "Public can read love story items for published invitations" ON love_story_items;
DROP POLICY IF EXISTS "Users can manage gift options for their invitations" ON gift_options;
DROP POLICY IF EXISTS "Public can read active gift options for published invitations" ON gift_options;
DROP POLICY IF EXISTS "Users can read gift contributions for their invitations" ON gift_contributions;
DROP POLICY IF EXISTS "Users can update gift contributions for their invitations" ON gift_contributions;
DROP POLICY IF EXISTS "Public can create gift contributions" ON gift_contributions;

-- Enable RLS on all tables
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dowry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE dresscodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rundown_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_story_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_contributions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER-SPECIFIC TABLE POLICIES
-- ============================================================================

-- Weddings: Only accessible by the owner
CREATE POLICY "Users can only access their own weddings" ON weddings
    FOR ALL USING (auth.uid() = user_id);

-- Notifications: Only accessible by the owner
CREATE POLICY "Users can only access their own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- WEDDING-SPECIFIC TABLE POLICIES (Owner access through wedding relationship)
-- ============================================================================

-- Documents: Accessible by wedding owner
CREATE POLICY "Users can access documents for their weddings" ON documents
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Document Reminders: Accessible by wedding owner
CREATE POLICY "Users can access document reminders for their weddings" ON document_reminders
    FOR ALL USING (
        document_id IN (
            SELECT d.id FROM documents d
            JOIN weddings w ON d.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

-- Budget Categories: Accessible by wedding owner
CREATE POLICY "Users can access budget categories for their weddings" ON budget_categories
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Budget Items: Accessible by wedding owner
CREATE POLICY "Users can access budget items for their weddings" ON budget_items
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Budget Alerts: Accessible by wedding owner
CREATE POLICY "Users can access budget alerts for their weddings" ON budget_alerts
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Todos: Accessible by wedding owner
CREATE POLICY "Users can access todos for their weddings" ON todos
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

-- Savings Goals: Accessible by wedding owner
CREATE POLICY "Users can access savings goals for their weddings" ON savings_goals
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Savings Summaries: Accessible by wedding owner
CREATE POLICY "Users can access savings summaries for their weddings" ON savings_summaries
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Savings Entries: Accessible by wedding owner
CREATE POLICY "Users can access savings entries for their weddings" ON savings_entries
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Dowry Items: Accessible by wedding owner
CREATE POLICY "Users can access dowry items for their weddings" ON dowry_items
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

-- Souvenir Distribution: Accessible by wedding owner
CREATE POLICY "Users can access souvenir distribution for their weddings" ON souvenir_distribution
    FOR ALL USING (
        souvenir_id IN (
            SELECT s.id FROM souvenirs s
            JOIN weddings w ON s.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

-- Dresscodes: Accessible by wedding owner
CREATE POLICY "Users can access dresscodes for their weddings" ON dresscodes
    FOR ALL USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Rundown Events: Accessible by wedding owner
CREATE POLICY "Users can access rundown events for their weddings" ON rundown_events
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
        status = 'published' AND is_public = true AND (expires_at IS NULL OR expires_at > NOW())
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
            WHERE status = 'published' AND is_public = true AND (expires_at IS NULL OR expires_at > NOW())
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
            WHERE i.status = 'published' AND i.is_public = true AND (i.expires_at IS NULL OR i.expires_at > NOW())
        )
    );

-- Gallery Items: Owner can manage, public can read for published invitations
CREATE POLICY "Users can manage gallery items for their invitations" ON gallery_items
    FOR ALL USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can read gallery items for published invitations" ON gallery_items
    FOR SELECT USING (
        is_public = true AND moderation_status = 'approved' AND
        invitation_id IN (
            SELECT id FROM invitations 
            WHERE status = 'published' AND is_public = true AND (expires_at IS NULL OR expires_at > NOW())
        )
    );

CREATE POLICY "Guests can upload gallery items" ON gallery_items
    FOR INSERT WITH CHECK (
        invitation_id IN (
            SELECT id FROM invitations 
            WHERE status = 'published' AND is_public = true AND (expires_at IS NULL OR expires_at > NOW())
        ) AND
        uploaded_by_guest_id IN (
            SELECT g.id FROM guests g
            WHERE g.invitation_id = gallery_items.invitation_id
        )
    );

-- Love Story Items: Owner can manage, public can read for published invitations
CREATE POLICY "Users can manage love story items for their invitations" ON love_story_items
    FOR ALL USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can read love story items for published invitations" ON love_story_items
    FOR SELECT USING (
        is_public = true AND
        invitation_id IN (
            SELECT id FROM invitations 
            WHERE status = 'published' AND is_public = true AND (expires_at IS NULL OR expires_at > NOW())
        )
    );

-- Gift Options: Owner can manage, public can read for published invitations
CREATE POLICY "Users can manage gift options for their invitations" ON gift_options
    FOR ALL USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can read active gift options for published invitations" ON gift_options
    FOR SELECT USING (
        is_active = true AND
        invitation_id IN (
            SELECT id FROM invitations 
            WHERE status = 'published' AND is_public = true AND (expires_at IS NULL OR expires_at > NOW())
        )
    );

-- Gift Contributions: Owner can read, public can create contributions
CREATE POLICY "Users can read gift contributions for their invitations" ON gift_contributions
    FOR SELECT USING (
        gift_option_id IN (
            SELECT go.id FROM gift_options go
            JOIN invitations i ON go.invitation_id = i.id
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update gift contributions for their invitations" ON gift_contributions
    FOR UPDATE USING (
        gift_option_id IN (
            SELECT go.id FROM gift_options go
            JOIN invitations i ON go.invitation_id = i.id
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can create gift contributions" ON gift_contributions
    FOR INSERT WITH CHECK (
        gift_option_id IN (
            SELECT go.id FROM gift_options go
            JOIN invitations i ON go.invitation_id = i.id
            WHERE i.status = 'published' AND i.is_public = true AND (i.expires_at IS NULL OR i.expires_at > NOW())
            AND go.is_active = true
        )
    );

-- ============================================================================
-- SECURITY FUNCTIONS FOR GUEST TOKEN VALIDATION
-- ============================================================================

-- Note: Security functions will be created separately to avoid parsing issues
-- with dollar-quoted strings in batch execution