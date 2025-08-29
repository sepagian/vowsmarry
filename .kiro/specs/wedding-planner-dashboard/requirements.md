# Requirements Document

## Introduction

The VowsMarry Wedding Planner Dashboard is the central hub for couples to manage their wedding planning process. This comprehensive platform provides tools for managing paperwork, budgeting, tasks, vendors, and other essential wedding planning activities. The dashboard serves as the primary interface where users can access all wedding planning modules and track their overall progress.

## Requirements

### Requirement 1

**User Story:** As an engaged couple, I want to access a centralized dashboard that shows my wedding planning progress, so that I can quickly understand what needs attention and stay organized throughout the planning process.

#### Acceptance Criteria

1. WHEN a user logs in THEN the system SHALL display a dashboard with an overview of all wedding planning modules
2. WHEN viewing the dashboard THEN the system SHALL show progress indicators for each module (paperwork, budgeting, todos, vendors, etc.)
3. WHEN on the dashboard THEN the system SHALL display upcoming deadlines and overdue items across all modules
4. WHEN accessing the dashboard THEN the system SHALL provide quick action buttons to add new items to any module
5. IF there are urgent items (overdue tasks, approaching deadlines) THEN the system SHALL highlight them prominently on the dashboard

### Requirement 2

**User Story:** As a user, I want to manage my wedding paperwork digitally, so that I can track permits, licenses, and contracts without losing important documents.

#### Acceptance Criteria

1. WHEN I access the paperwork module THEN the system SHALL display all my wedding-related documents organized by type
2. WHEN I add a new document THEN the system SHALL allow me to upload files, set status (pending, approved, rejected), and add deadline reminders
3. WHEN a document deadline approaches THEN the system SHALL send me notifications
4. WHEN viewing documents THEN the system SHALL allow me to filter by status, type, and due date
5. IF I upload a document THEN the system SHALL store it securely and provide a preview when possible

### Requirement 3

**User Story:** As a couple planning our wedding, I want to create and manage a detailed budget, so that I can control spending and avoid going over our allocated funds.

#### Acceptance Criteria

1. WHEN I access the budgeting module THEN the system SHALL display budget categories with planned vs actual spending
2. WHEN I add a budget item THEN the system SHALL allow me to specify category, planned amount, actual amount, and vendor
3. WHEN viewing the budget THEN the system SHALL show visual charts of spending by category and overall budget utilization
4. WHEN I exceed a category budget THEN the system SHALL alert me with warnings
5. IF I want to export budget data THEN the system SHALL provide CSV and PDF export options

### Requirement 4

**User Story:** As a wedding planner (couple or professional), I want to manage tasks and to-dos with deadlines, so that I can ensure nothing important is forgotten during the planning process.

#### Acceptance Criteria

1. WHEN I access the todo module THEN the system SHALL display all tasks organized by status (todo, in-progress, done)
2. WHEN I create a task THEN the system SHALL allow me to set title, description, due date, priority, and assign to partner or planner
3. WHEN a task is due soon THEN the system SHALL send reminder notifications
4. WHEN viewing tasks THEN the system SHALL allow filtering by status, assignee, due date, and priority
5. IF I complete a task THEN the system SHALL update the status and reflect progress on the dashboard

### Requirement 5

**User Story:** As a couple, I want to manage vendor relationships and contracts, so that I can track communications, deals, and booking status for all wedding services.

#### Acceptance Criteria

1. WHEN I access the vendors module THEN the system SHALL display all vendors organized by category and status
2. WHEN I add a vendor THEN the system SHALL allow me to store contact information, category, contract details, and current status
3. WHEN managing vendors THEN the system SHALL track status progression (contacted, negotiating, booked, completed)
4. WHEN viewing vendors THEN the system SHALL allow me to upload contracts and rate/review services
5. IF I need to contact a vendor THEN the system SHALL provide quick access to their contact information

### Requirement 6

**User Story:** As a couple, I want to create a detailed wedding day rundown, so that everyone involved knows the timeline and their responsibilities.

#### Acceptance Criteria

1. WHEN I access the rundown module THEN the system SHALL display a chronological timeline of wedding day events
2. WHEN I add an event THEN the system SHALL allow me to specify time, duration, description, location, and assigned responsibilities
3. WHEN viewing the rundown THEN the system SHALL show a clear timeline with all events and responsible parties
4. WHEN I need to share the rundown THEN the system SHALL provide PDF export functionality
5. IF events overlap or have scheduling conflicts THEN the system SHALL highlight potential issues

### Requirement 7

**User Story:** As a user, I want the system to be responsive and work on all devices, so that I can manage my wedding planning from anywhere.

#### Acceptance Criteria

1. WHEN I access the platform on mobile devices THEN the system SHALL display a responsive interface optimized for touch interaction
2. WHEN using the platform on tablets THEN the system SHALL adapt the layout for medium-sized screens
3. WHEN accessing on desktop THEN the system SHALL utilize the full screen space efficiently
4. WHEN switching between devices THEN the system SHALL maintain data consistency and sync state
5. IF I'm offline THEN the system SHALL show appropriate messaging and cache essential data when possible

### Requirement 8

**User Story:** As a couple, I want to manage dresscode and uniform planning, so that I can coordinate outfits for different wedding events and share guidelines with guests.

#### Acceptance Criteria

1. WHEN I access the dresscode module THEN the system SHALL display dresscode plans organized by event (ceremony, reception, etc.)
2. WHEN I create a dresscode THEN the system SHALL allow me to upload inspiration photos, specify colors, and add detailed guidelines
3. WHEN managing dresscode THEN the system SHALL allow me to assign different codes for different events or guest groups
4. WHEN I want to share dresscode THEN the system SHALL integrate with invitation system to display guidelines to guests
5. IF I update dresscode information THEN the system SHALL notify relevant guests through the invitation system

### Requirement 9

**User Story:** As a couple, I want to track our wedding savings progress, so that I can monitor our financial readiness and adjust our budget accordingly.

#### Acceptance Criteria

1. WHEN I access the savings module THEN the system SHALL display current savings amount versus wedding goal
2. WHEN I update savings THEN the system SHALL allow me to log deposits and track progress over time
3. WHEN viewing savings progress THEN the system SHALL show visual charts and projections
4. WHEN savings change THEN the system SHALL update budget recommendations and affordability indicators
5. IF I'm behind on savings goals THEN the system SHALL suggest budget adjustments or timeline modifications

### Requirement 10

**User Story:** As a couple, I want to manage dowry (mahar) details and documentation, so that I can track this important cultural and religious aspect of our wedding.

#### Acceptance Criteria

1. WHEN I access the dowry module THEN the system SHALL display all dowry items organized by type (cash, gold, property, etc.)
2. WHEN I add dowry items THEN the system SHALL allow me to specify type, description, value, and upload proof or receipts
3. WHEN viewing dowry THEN the system SHALL calculate total value and provide summary reports
4. WHEN managing dowry THEN the system SHALL track status (promised, received, documented)
5. IF I need documentation THEN the system SHALL provide export functionality for legal or religious purposes

### Requirement 11

**User Story:** As a couple, I want to plan and manage wedding souvenirs, so that I can organize memorable gifts for our guests efficiently.

#### Acceptance Criteria

1. WHEN I access the souvenir module THEN the system SHALL display all souvenir plans with vendor and cost information
2. WHEN I plan souvenirs THEN the system SHALL allow me to specify type, quantity, vendor, cost, and distribution plan
3. WHEN managing souvenirs THEN the system SHALL track status (planned, ordered, received, distributed)
4. WHEN calculating costs THEN the system SHALL integrate with budgeting module for expense tracking
5. IF I need to distribute souvenirs THEN the system SHALL provide guest lists and tracking functionality

### Requirement 12

**User Story:** As a couple, I want to create and manage digital wedding invitations, so that I can invite guests elegantly while tracking RSVPs and managing wedding communications.

#### Acceptance Criteria

1. WHEN I access the invitation module THEN the system SHALL provide template selection with customization options
2. WHEN I create invitations THEN the system SHALL allow me to input couple details, event information, and venue details
3. WHEN managing guests THEN the system SHALL provide guest list management with individual invitation links
4. WHEN guests receive invitations THEN the system SHALL provide RSVP functionality with meal preferences and plus-one options
5. IF I want to track responses THEN the system SHALL provide real-time RSVP status and guest management dashboard

### Requirement 13

**User Story:** As a couple, I want to share our love story and wedding gallery, so that guests can connect with our journey and view wedding-related media.

#### Acceptance Criteria

1. WHEN I access the gallery module THEN the system SHALL allow me to upload and organize photos and videos
2. WHEN I create love story content THEN the system SHALL provide timeline functionality with text, images, and video support
3. WHEN guests view invitations THEN the system SHALL display our love story and gallery in an engaging format
4. WHEN managing media THEN the system SHALL optimize images and videos for web viewing
5. IF I want to collect guest photos THEN the system SHALL provide functionality for guests to upload their own media

### Requirement 14

**User Story:** As a couple, I want to manage wedding gifts digitally, so that guests can contribute conveniently and I can track all gift-related activities.

#### Acceptance Criteria

1. WHEN I set up gift options THEN the system SHALL provide digital envelope functionality with bank transfer and QRIS options
2. WHEN guests want to give gifts THEN the system SHALL integrate with gift registry platforms (Tokopedia, Shopee, etc.)
3. WHEN receiving digital gifts THEN the system SHALL track contributions and provide thank-you message functionality
4. WHEN managing gifts THEN the system SHALL provide reporting and export capabilities for gift tracking
5. IF guests prefer physical gifts THEN the system SHALL provide registry links and wish list functionality

### Requirement 15

**User Story:** As a user, I want secure authentication and data protection, so that my personal wedding information remains private and secure.

#### Acceptance Criteria

1. WHEN I register THEN the system SHALL require email verification before account activation
2. WHEN I log in THEN the system SHALL use secure session management with appropriate timeouts
3. WHEN I upload files THEN the system SHALL store them securely with proper access controls
4. WHEN accessing my data THEN the system SHALL ensure only I can view my wedding information
5. IF I forget my password THEN the system SHALL provide a secure password reset mechanism