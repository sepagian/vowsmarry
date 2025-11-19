-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR VOWSMARRY WEDDING PLANNER
-- ============================================================================

-- Drop existing policies first (ignore errors if they don't exist)

-- USERS POLICIES
DROP POLICY IF EXISTS "Users can select their own weddings" ON weddings;
DROP POLICY IF EXISTS "Users can insert their own weddings" ON weddings;
DROP POLICY IF EXISTS "Users can update their own weddings" ON weddings;
DROP POLICY IF EXISTS "Users can delete their own weddings" ON weddings;

DROP POLICY IF EXISTS "Users can select tasks for their weddings" ON tasks;
DROP POLICY IF EXISTS "Users can insert tasks for their weddings" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks for their weddings" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks for their weddings" ON tasks;

DROP POLICY IF EXISTS "Users can select documents for their weddings" ON documents;
DROP POLICY IF EXISTS "Users can insert documents for their weddings" ON documents;
DROP POLICY IF EXISTS "Users can update documents for their weddings" ON documents;
DROP POLICY IF EXISTS "Users can delete documents for their weddings" ON documents;

DROP POLICY IF EXISTS "Users can select expense categories for their weddings" ON expense_categories;
DROP POLICY IF EXISTS "Users can insert expense categories for their weddings" ON expense_categories;
DROP POLICY IF EXISTS "Users can update expense categories for their weddings" ON expense_categories;
DROP POLICY IF EXISTS "Users can delete expense categories for their weddings" ON expense_categories;

DROP POLICY IF EXISTS "Users can select expense items for their weddings" ON expense_items;
DROP POLICY IF EXISTS "Users can insert expense items for their weddings" ON expense_items;
DROP POLICY IF EXISTS "Users can update expense items for their weddings" ON expense_items;
DROP POLICY IF EXISTS "Users can delete expense items for their weddings" ON expense_items;

DROP POLICY IF EXISTS "Users can select savings items for their weddings" ON savings_items;
DROP POLICY IF EXISTS "Users can insert savings items for their weddings" ON savings_items;
DROP POLICY IF EXISTS "Users can update savings items for their weddings" ON savings_items;
DROP POLICY IF EXISTS "Users can delete savings items for their weddings" ON savings_items;

DROP POLICY IF EXISTS "Users can select vendors for their weddings" ON vendors;
DROP POLICY IF EXISTS "Users can insert vendors for their weddings" ON vendors;
DROP POLICY IF EXISTS "Users can update vendors for their weddings" ON vendors;
DROP POLICY IF EXISTS "Users can delete vendors for their weddings" ON vendors;

DROP POLICY IF EXISTS "Users can select schedules for their weddings" ON schedules;
DROP POLICY IF EXISTS "Users can insert schedules for their weddings" ON schedules;
DROP POLICY IF EXISTS "Users can update schedules for their weddings" ON schedules;
DROP POLICY IF EXISTS "Users can delete schedules for their weddings" ON schedules;

DROP POLICY IF EXISTS "Users can select dowry for their weddings" ON dowry;
DROP POLICY IF EXISTS "Users can insert dowry for their weddings" ON dowry;
DROP POLICY IF EXISTS "Users can update dowry for their weddings" ON dowry;
DROP POLICY IF EXISTS "Users can delete dowry for their weddings" ON dowry;

DROP POLICY IF EXISTS "Users can select souvenirs for their weddings" ON souvenirs;
DROP POLICY IF EXISTS "Users can insert souvenirs for their weddings" ON souvenirs;
DROP POLICY IF EXISTS "Users can update souvenirs for their weddings" ON souvenirs;
DROP POLICY IF EXISTS "Users can delete souvenirs for their weddings" ON souvenirs;

DROP POLICY IF EXISTS "Users can select dresscodes for their weddings" ON dresscodes;
DROP POLICY IF EXISTS "Users can insert dresscodes for their weddings" ON dresscodes;
DROP POLICY IF EXISTS "Users can update dresscodes for their weddings" ON dresscodes;
DROP POLICY IF EXISTS "Users can delete dresscodes for their weddings" ON dresscodes;

DROP POLICY IF EXISTS "Users can select users for their weddings" ON users;
DROP POLICY IF EXISTS "Users can insert users for their weddings" ON users;
DROP POLICY IF EXISTS "Users can update users for their weddings" ON users;
DROP POLICY IF EXISTS "Users can delete users for their weddings" ON users;

DROP POLICY IF EXISTS "Users can select their own invitations" ON invitations;
DROP POLICY IF EXISTS "Users can insert their own invitations" ON invitations;
DROP POLICY IF EXISTS "Users can update their own invitations" ON invitations;
DROP POLICY IF EXISTS "Users can delete their own invitations" ON invitations;

DROP POLICY IF EXISTS "Users can select guests for their invitations" ON guests;
DROP POLICY IF EXISTS "Users can insert guests for their invitations" ON guests;
DROP POLICY IF EXISTS "Users can update guests for their invitations" ON guests;
DROP POLICY IF EXISTS "Users can delete guests for their invitations" ON guests;

DROP POLICY IF EXISTS "Users can select RSVPs for their invitations" ON rsvps;

DROP POLICY IF EXISTS "Users can select gallery items for their invitations" ON gallery;
DROP POLICY IF EXISTS "Users can insert gallery items for their invitations" ON gallery;
DROP POLICY IF EXISTS "Users can update gallery items for their invitations" ON gallery;
DROP POLICY IF EXISTS "Users can delete gallery items for their invitations" ON gallery;

DROP POLICY IF EXISTS "Users can select love story items for their invitations" ON love_story;
DROP POLICY IF EXISTS "Users can insert love story items for their invitations" ON love_story;
DROP POLICY IF EXISTS "Users can update love story items for their invitations" ON love_story;
DROP POLICY IF EXISTS "Users can delete love story items for their invitations" ON love_story;

DROP POLICY IF EXISTS "Users can select gift options for their invitations" ON gifts;
DROP POLICY IF EXISTS "Users can insert gift options for their invitations" ON gifts;
DROP POLICY IF EXISTS "Users can update gift options for their invitations" ON gifts;
DROP POLICY IF EXISTS "Users can delete gift options for their invitations" ON gifts;

-- PUBLIC POLICIES
DROP POLICY IF EXISTS "Public can read published invitations" ON invitations;
DROP POLICY IF EXISTS "Guests can read their own data via token" ON guests;

DROP POLICY IF EXISTS "Guests can select their own RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Guests can insert their own RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Guests can update their own RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Guests can delete their own RSVPs" ON rsvps;

DROP POLICY IF EXISTS "Public can read gallery items for published invitations" ON gallery;
DROP POLICY IF EXISTS "Public can read love story items for published invitations" ON love_story;
DROP POLICY IF EXISTS "Public can read active gift options for published invitations" ON gifts;

-- Enable RLS on all tables
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE dowry ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dresscodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Users can select their own weddings" ON weddings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weddings" ON weddings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weddings" ON weddings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weddings" ON weddings
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- WEDDING-SPECIFIC TABLE POLICIES (Owner access through wedding relationship)
-- ============================================================================

-- Tasks: Accessible by wedding owner
CREATE POLICY "Users can select tasks for their weddings" ON tasks
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert tasks for their weddings" ON tasks
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update tasks for their weddings" ON tasks
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tasks for their weddings" ON tasks
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Documents: Accessible by wedding owner
CREATE POLICY "Users can select documents for their weddings" ON documents
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert documents for their weddings" ON documents
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update documents for their weddings" ON documents
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete documents for their weddings" ON documents
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Expense Categories: Accessible by wedding owner
CREATE POLICY "Users can select expense categories for their weddings" ON expense_categories
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert expense categories for their weddings" ON expense_categories
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update expense categories for their weddings" ON expense_categories
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete expense categories for their weddings" ON expense_categories
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Expense Items: Accessible by wedding owner
CREATE POLICY "Users can select expense items for their weddings" ON expense_items
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert expense items for their weddings" ON expense_items
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update expense items for their weddings" ON expense_items
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete expense items for their weddings" ON expense_items
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Savings Items: Accessible by wedding owner
CREATE POLICY "Users can select savings items for their weddings" ON savings_items
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert savings items for their weddings" ON savings_items
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update savings items for their weddings" ON savings_items
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete savings items for their weddings" ON savings_items
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Vendors: Accessible by wedding owner
CREATE POLICY "Users can select vendors for their weddings" ON vendors
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert vendors for their weddings" ON vendors
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update vendors for their weddings" ON vendors
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete vendors for their weddings" ON vendors
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Schedules: Accessible by wedding owner
CREATE POLICY "Users can select schedules for their weddings" ON schedules
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert schedules for their weddings" ON schedules
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update schedules for their weddings" ON schedules
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete schedules for their weddings" ON schedules
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Dowry Items: Accessible by wedding owner
CREATE POLICY "Users can select dowry for their weddings" ON dowry
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert dowry for their weddings" ON dowry
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update dowry for their weddings" ON dowry
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete dowry for their weddings" ON dowry
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Souvenirs: Accessible by wedding owner
CREATE POLICY "Users can select souvenirs for their weddings" ON souvenirs
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert souvenirs for their weddings" ON souvenirs
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update souvenirs for their weddings" ON souvenirs
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete souvenirs for their weddings" ON souvenirs
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Dresscodes: Accessible by wedding owner
CREATE POLICY "Users can select dresscodes for their weddings" ON dresscodes
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert dresscodes for their weddings" ON dresscodes
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update dresscodes for their weddings" ON dresscodes
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete dresscodes for their weddings" ON dresscodes
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

-- Users: Accessible by wedding members
CREATE POLICY "Users can select users for their weddings" ON users
    FOR SELECT USING (
        wedding_id IN (
            SELECT wedding_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert users for their weddings" ON users
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT wedding_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update users for their weddings" ON users
    FOR UPDATE USING (
        wedding_id IN (
            SELECT wedding_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete users for their weddings" ON users
    FOR DELETE USING (
        wedding_id IN (
            SELECT wedding_id FROM users WHERE id = auth.uid()
        )
    );

-- ============================================================================
-- INVITATION SYSTEM POLICIES (Mixed public/private access)
-- ============================================================================

-- Invitations: Owner can do everything, public can read published invitations
CREATE POLICY "Users can select their own invitations" ON invitations
    FOR SELECT USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own invitations" ON invitations
    FOR INSERT WITH CHECK (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own invitations" ON invitations
    FOR UPDATE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own invitations" ON invitations
    FOR DELETE USING (
        wedding_id IN (
            SELECT id FROM weddings WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Public can read published invitations" ON invitations
    FOR SELECT USING (
        status = 'published' AND is_public = true AND (expired_at IS NULL OR expired_at > NOW())
    );

-- Guests: Owner can manage, guests can read their own data via token
CREATE POLICY "Users can select guests for their invitations" ON guests
    FOR SELECT USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert guests for their invitations" ON guests
    FOR INSERT WITH CHECK (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update guests for their invitations" ON guests
    FOR UPDATE USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete guests for their invitations" ON guests
    FOR DELETE USING (
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
CREATE POLICY "Users can select RSVPs for their invitations" ON rsvps
    FOR SELECT USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN invitations i ON g.invitation_id = i.id
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Guests can select their own RSVPs" ON rsvps
    FOR SELECT USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN invitations i ON g.invitation_id = i.id
            WHERE i.status = 'published' AND i.is_public = true AND (i.expired_at IS NULL OR i.expired_at > NOW())
        )
    );

CREATE POLICY "Guests can insert their own RSVPs" ON rsvps
    FOR INSERT WITH CHECK (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN invitations i ON g.invitation_id = i.id
            WHERE i.status = 'published' AND i.is_public = true AND (i.expired_at IS NULL OR i.expired_at > NOW())
        )
    );

CREATE POLICY "Guests can update their own RSVPs" ON rsvps
    FOR UPDATE USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN invitations i ON g.invitation_id = i.id
            WHERE i.status = 'published' AND i.is_public = true AND (i.expired_at IS NULL OR i.expired_at > NOW())
        )
    );

CREATE POLICY "Guests can delete their own RSVPs" ON rsvps
    FOR DELETE USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN invitations i ON g.invitation_id = i.id
            WHERE i.status = 'published' AND i.is_public = true AND (i.expired_at IS NULL OR i.expired_at > NOW())
        )
    );

-- Gallery Items: Owner can manage, public can read for published invitations
CREATE POLICY "Users can select gallery items for their invitations" ON gallery
    FOR SELECT USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert gallery items for their invitations" ON gallery
    FOR INSERT WITH CHECK (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update gallery items for their invitations" ON gallery
    FOR UPDATE USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete gallery items for their invitations" ON gallery
    FOR DELETE USING (
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
CREATE POLICY "Users can select love story items for their invitations" ON love_story
    FOR SELECT USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert love story items for their invitations" ON love_story
    FOR INSERT WITH CHECK (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update love story items for their invitations" ON love_story
    FOR UPDATE USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete love story items for their invitations" ON love_story
    FOR DELETE USING (
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
CREATE POLICY "Users can select gift options for their invitations" ON gifts
    FOR SELECT USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert gift options for their invitations" ON gifts
    FOR INSERT WITH CHECK (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update gift options for their invitations" ON gifts
    FOR UPDATE USING (
        invitation_id IN (
            SELECT i.id FROM invitations i
            JOIN weddings w ON i.wedding_id = w.id
            WHERE w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete gift options for their invitations" ON gifts
    FOR DELETE USING (
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
