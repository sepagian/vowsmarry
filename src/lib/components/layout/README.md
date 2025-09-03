# Layout Components and Design Tokens

This directory contains the comprehensive layout component system for the VowsMarry Wedding Planner Dashboard. The system includes both base layout components and UI-specific layout patterns, all built with the design token system and following a mobile-first responsive design approach with a 4px base unit spacing system.

## Component Categories

### Base Layout Components
Fundamental building blocks for creating layouts:
- **Container**: Responsive container with configurable sizing and padding
- **Grid**: Flexible CSS Grid system with responsive configuration
- **GridItem**: Grid item component with spanning and positioning
- **Stack**: Vertical/horizontal stack with consistent spacing
- **Flex**: Advanced flexbox component with full responsive control

### UI-Specific Layout Components
Specialized layouts designed for common UI patterns:
- **CardGrid**: Responsive grid specifically for card components
- **FormLayout**: Structured form layouts with responsive columns
- **ButtonGroup**: Flexible button grouping with consistent spacing
- **DashboardLayout**: Complete dashboard layout with header/sidebar/footer
- **StatsGrid**: Specialized grid for statistics and metrics cards
- **AlertStack**: Vertical stack for alert/notification components
- **BreadcrumbLayout**: Responsive wrapper for breadcrumb navigation
- **PageHeader**: Structured page header with title, actions, and breadcrumbs
- **DataTable**: Responsive table layout with actions and styling
- **ModalLayout**: Structured modal with header, body, and footer
- **SidebarLayout**: Complete sidebar application layout

## Design Tokens Integration

### Layout Tokens
- **Container Sizes**: Responsive container widths from `xs` (320px) to `7xl` (1280px)
- **Breakpoints**: Mobile-first breakpoints for responsive design
- **Grid System**: Flexible grid configurations with 1-12 columns and rows
- **Max Widths**: Content container max-widths for optimal reading and layout

### Spacing Tokens
- **Base Spacing**: 4px base unit system from `0` to `96` (384px)
- **Semantic Spacing**: Contextual spacing for components, layouts, sections, and pages
- **Responsive Spacing**: Different spacing values for mobile, tablet, and desktop
- **Negative Spacing**: Negative margin values for advanced layouts

## Base Layout Components

### Container
Responsive container component with configurable sizing and padding.

```svelte
<script>
  import { Container } from '$lib/components/layout';
</script>

<!-- Basic container -->
<Container>
  <p>Content goes here</p>
</Container>

<!-- Large container with custom padding -->
<Container size="5xl" padding="lg">
  <p>Large container content</p>
</Container>

<!-- Full width container without centering -->
<Container size="full" center={false}>
  <p>Full width content</p>
</Container>
```

**Props:**
- `size`: Container size ('xs' to '7xl', 'full', 'screen')
- `center`: Whether to center the container (default: true)
- `padding`: Responsive padding ('none', 'sm', 'md', 'lg')
- `as`: HTML element type (default: 'div')

### Grid
Flexible CSS Grid system with responsive column and row configuration.

```svelte
<script>
  import { Grid, GridItem } from '$lib/components/layout';
</script>

<!-- Basic 3-column grid -->
<Grid cols={3} gap={4}>
  <GridItem>Item 1</GridItem>
  <GridItem>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
</Grid>

<!-- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop -->
<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={{ default: 4, md: 6, lg: 8 }}>
  <GridItem>Responsive item 1</GridItem>
  <GridItem>Responsive item 2</GridItem>
  <GridItem>Responsive item 3</GridItem>
</Grid>

<!-- Auto-fit grid with minimum column width -->
<Grid autoFit="250px" gap={6}>
  <GridItem>Auto-fit item 1</GridItem>
  <GridItem>Auto-fit item 2</GridItem>
  <GridItem>Auto-fit item 3</GridItem>
</Grid>
```

**Props:**
- `cols`: Number of columns (responsive object supported)
- `rows`: Number of rows (responsive object supported)
- `gap`: Gap between items (responsive object supported)
- `autoFit`: Auto-fit columns with minimum width
- `autoFill`: Auto-fill columns with minimum width

### GridItem
Grid item component with spanning and positioning controls.

```svelte
<Grid cols={4} gap={4}>
  <GridItem colSpan={2}>Spans 2 columns</GridItem>
  <GridItem colStart={3} colEnd={5}>Positioned item</GridItem>
  <GridItem rowSpan={2}>Spans 2 rows</GridItem>
</Grid>
```

**Props:**
- `colSpan`: Column span (responsive object supported)
- `rowSpan`: Row span (responsive object supported)
- `colStart/colEnd`: Column positioning
- `rowStart/rowEnd`: Row positioning
- `justifySelf/alignSelf`: Self alignment

### Stack
Vertical or horizontal stack with consistent spacing between items.

```svelte
<script>
  import { Stack } from '$lib/components/layout';
</script>

<!-- Vertical stack with medium spacing -->
<Stack direction="vertical" spacing={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

<!-- Horizontal stack with responsive spacing -->
<Stack 
  direction="horizontal" 
  spacing={{ default: 2, md: 4, lg: 6 }}
  justify="between"
  align="center"
>
  <div>Left item</div>
  <div>Center item</div>
  <div>Right item</div>
</Stack>
```

**Props:**
- `direction`: 'vertical' | 'horizontal'
- `spacing`: Spacing between items (responsive object supported)
- `justify`: Main axis alignment
- `align`: Cross axis alignment
- `wrap`: Whether items should wrap

### Flex
Advanced flexbox component with full control over flex properties.

```svelte
<script>
  import { Flex } from '$lib/components/layout';
</script>

<!-- Basic flex row -->
<Flex justify="between" align="center" gap={4}>
  <div>Left content</div>
  <div>Right content</div>
</Flex>

<!-- Responsive flex: column on mobile, row on desktop -->
<Flex 
  direction={{ default: 'col', md: 'row' }}
  gap={{ default: 4, md: 8 }}
  align="stretch"
>
  <div>Flexible item 1</div>
  <div>Flexible item 2</div>
</Flex>
```

**Props:**
- `direction`: Flex direction (responsive object supported)
- `justify`: Justify content (responsive object supported)
- `align`: Align items (responsive object supported)
- `wrap`: Flex wrap (responsive object supported)
- `gap`: Gap between items (responsive object supported)

## UI-Specific Layout Components

### CardGrid
Responsive grid layout specifically designed for card components.

```svelte
<script>
  import { CardGrid } from '$lib/components/layout';
</script>

<CardGrid cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
  <!-- Card components -->
</CardGrid>

<!-- Auto-fit cards with minimum width -->
<CardGrid autoFit minCardWidth="300px" gap={6}>
  <!-- Card components -->
</CardGrid>
```

**Props:**
- `cols`: Responsive column configuration
- `gap`: Spacing between cards
- `minCardWidth`: Minimum width for auto-fit layout
- `autoFit`: Use auto-fit instead of fixed columns

### FormLayout
Structured layout for forms with responsive column support.

```svelte
<script>
  import { FormLayout } from '$lib/components/layout';
</script>

<FormLayout layout="two-column" spacing={6} maxWidth="lg">
  <!-- Form fields -->
</FormLayout>
```

**Props:**
- `layout`: 'single' | 'two-column' | 'three-column' | 'mixed'
- `spacing`: Spacing between form fields
- `maxWidth`: Maximum width of the form
- `centered`: Whether to center the form

### ButtonGroup
Flexible layout for grouping buttons with consistent spacing.

```svelte
<script>
  import { ButtonGroup } from '$lib/components/layout';
</script>

<ButtonGroup orientation="horizontal" justify="end" spacing={3}>
  <!-- Button components -->
</ButtonGroup>
```

**Props:**
- `orientation`: 'horizontal' | 'vertical'
- `align`: Alignment of buttons
- `justify`: Justification of buttons
- `spacing`: Spacing between buttons
- `wrap`: Whether buttons should wrap
- `fullWidthMobile`: Full width buttons on mobile

### DashboardLayout
Complete dashboard layout with header, sidebar, and footer support.

```svelte
<script>
  import { DashboardLayout } from '$lib/components/layout';
</script>

<DashboardLayout variant="sidebar" containerSize="7xl">
  {#snippet header()}
    <nav>Navigation content</nav>
  {/snippet}
  
  {#snippet sidebar()}
    <aside>Sidebar content</aside>
  {/snippet}
  
  <main>Main dashboard content</main>
  
  {#snippet footer()}
    <footer>Footer content</footer>
  {/snippet}
</DashboardLayout>
```

**Props:**
- `variant`: 'default' | 'sidebar' | 'full-width'
- `showHeader/showFooter`: Whether to show header/footer
- `containerSize`: Container size for content

### StatsGrid
Specialized grid for displaying statistics cards.

```svelte
<script>
  import { StatsGrid } from '$lib/components/layout';
</script>

<StatsGrid cols={{ default: 1, sm: 2, lg: 4 }} gap={6} equalHeight={true}>
  <!-- Stat cards -->
</StatsGrid>
```

**Props:**
- `cols`: Responsive column configuration
- `gap`: Spacing between stat cards
- `equalHeight`: Whether all cards should have equal height

### AlertStack
Vertical stack layout for alert components.

```svelte
<script>
  import { AlertStack } from '$lib/components/layout';
</script>

<AlertStack spacing={4} maxWidth="lg" position="top">
  <!-- Alert components -->
</AlertStack>
```

**Props:**
- `spacing`: Spacing between alerts
- `maxWidth`: Maximum width of alert stack
- `position`: 'top' | 'bottom' | 'center'
- `centered`: Whether to center horizontally

### PageHeader
Structured page header with title, description, actions, and breadcrumb support.

```svelte
<script>
  import { PageHeader } from '$lib/components/layout';
</script>

<PageHeader 
  title="Dashboard" 
  description="Welcome to your dashboard"
  showDivider={true}
>
  {#snippet actions()}
    <!-- Action buttons -->
  {/snippet}
  
  {#snippet breadcrumb()}
    <!-- Breadcrumb component -->
  {/snippet}
</PageHeader>
```

**Props:**
- `title`: Page title
- `description`: Page description
- `showDivider`: Whether to show divider below header

### DataTable
Responsive table layout with actions and styling support.

```svelte
<script>
  import { DataTable } from '$lib/components/layout';
</script>

<DataTable responsive={true} bordered={true} striped={true}>
  {#snippet actions()}
    <!-- Table actions -->
  {/snippet}
  
  {#snippet header()}
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Actions</th>
    </tr>
  {/snippet}
  
  <!-- Table rows -->
</DataTable>
```

**Props:**
- `responsive`: Whether table is scrollable on mobile
- `bordered`: Whether to show table border
- `striped`: Whether to show striped rows
- `size`: 'sm' | 'md' | 'lg'

### ModalLayout
Structured modal layout with header, body, and footer sections.

```svelte
<script>
  import { ModalLayout } from '$lib/components/layout';
</script>

<ModalLayout size="md" showClose={true} onClose={handleClose}>
  {#snippet header()}
    <h3>Modal Title</h3>
  {/snippet}
  
  <div>Modal content goes here</div>
  
  {#snippet footer()}
    <!-- Footer buttons -->
  {/snippet}
</ModalLayout>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
- `showClose`: Whether to show close button
- `showHeaderDivider`: Whether to show header divider
- `showFooterDivider`: Whether to show footer divider
- `onClose`: Close button click handler

### SidebarLayout
Complete sidebar layout for applications.

```svelte
<script>
  import { SidebarLayout } from '$lib/components/layout';
</script>

<SidebarLayout 
  sidebarWidth="md" 
  position="left" 
  collapsible={true} 
  collapsed={false}
>
  {#snippet sidebar()}
    <nav>Sidebar navigation</nav>
  {/snippet}
  
  <main>Main content area</main>
</SidebarLayout>
```

**Props:**
- `sidebarWidth`: 'sm' | 'md' | 'lg'
- `position`: 'left' | 'right'
- `collapsible`: Whether sidebar can collapse
- `collapsed`: Whether sidebar is collapsed
- `showOnMobile`: Whether to show sidebar on mobile

## Responsive Utilities

### CSS Classes

The design token system provides several utility classes for common responsive patterns:

```html
<!-- Responsive container with padding -->
<div class="container-responsive">
  Content with responsive padding
</div>

<!-- Responsive section spacing -->
<section class="section-responsive">
  Section with responsive vertical spacing
</section>

<!-- Responsive component spacing -->
<div class="component-responsive">
  Component with responsive padding
</div>

<!-- Responsive grid pattern -->
<div class="grid-responsive-cards">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Responsive flex pattern -->
<div class="flex-responsive">
  <div>Flex item 1</div>
  <div>Flex item 2</div>
</div>
```

### Manual Responsive Classes

You can also use the design tokens directly with UnoCSS classes:

```html
<!-- Responsive spacing -->
<div class="p-4 md:p-6 lg:p-8">Responsive padding</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  <div>Grid item</div>
</div>

<!-- Responsive container -->
<div class="max-w-xs md:max-w-2xl lg:max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
  Responsive container
</div>
```

## Design Token Usage in TypeScript

```typescript
import { layoutTokens, spacingTokens, designTokens } from '$lib/design-tokens';

// Access layout tokens
const containerSize = layoutTokens.container['5xl']; // '64rem'
const breakpoint = layoutTokens.breakpoints.lg; // '64rem'

// Access spacing tokens
const spacing = spacingTokens.spacing[4]; // '1rem'
const sectionSpacing = spacingTokens.semantic.section.lg; // '3rem'

// Access combined tokens
const allTokens = designTokens.layout.container;
```

## Best Practices

1. **Mobile-First**: Always design for mobile first, then enhance for larger screens
2. **Consistent Spacing**: Use the 4px base unit system for all spacing
3. **Semantic Tokens**: Prefer semantic spacing tokens over raw values
4. **Responsive Components**: Use the layout components for consistent responsive behavior
5. **Grid Over Flexbox**: Use Grid for 2D layouts, Flex for 1D layouts
6. **Container Hierarchy**: Use Container > Grid/Stack/Flex > GridItem pattern
7. **Component Composition**: Use these layouts as containers for existing UI components
8. **Accessibility**: Built-in ARIA attributes and keyboard navigation support
9. **Performance**: Minimal CSS and optimized for tree-shaking

## Complete Examples

### Dashboard Page
```svelte
<DashboardLayout variant="sidebar">
  {#snippet header()}
    <PageHeader title="Analytics Dashboard">
      {#snippet actions()}
        <ButtonGroup>
          <Button variant="outline">Export</Button>
          <Button>Refresh</Button>
        </ButtonGroup>
      {/snippet}
    </PageHeader>
  {/snippet}
  
  {#snippet sidebar()}
    <!-- Navigation menu -->
  {/snippet}
  
  <StatsGrid cols={{ default: 1, sm: 2, lg: 4 }}>
    <!-- Stat cards -->
  </StatsGrid>
  
  <CardGrid cols={{ default: 1, lg: 2 }}>
    <!-- Dashboard cards -->
  </CardGrid>
</DashboardLayout>
```

### Form Page
```svelte
<DashboardLayout>
  <PageHeader title="Create User" description="Add a new user to the system">
    {#snippet breadcrumb()}
      <BreadcrumbLayout>
        <!-- Breadcrumb navigation -->
      </BreadcrumbLayout>
    {/snippet}
  </PageHeader>
  
  <FormLayout layout="two-column" maxWidth="2xl">
    <!-- Form fields -->
  </FormLayout>
  
  <ButtonGroup justify="end" fullWidthMobile={true}>
    <Button variant="outline">Cancel</Button>
    <Button>Create User</Button>
  </ButtonGroup>
</DashboardLayout>
```

### Data Management Page
```svelte
<DashboardLayout>
  <PageHeader title="User Management">
    {#snippet actions()}
      <Button>Add User</Button>
    {/snippet}
  </PageHeader>
  
  <DataTable responsive={true} striped={true}>
    {#snippet actions()}
      <div class="flex gap-4">
        <Input placeholder="Search users..." />
        <Button variant="outline">Filter</Button>
      </div>
    {/snippet}
    
    <!-- Table content -->
  </DataTable>
</DashboardLayout>
```

## Testing

Use the `test-layout.svelte` file to see all components in action:

```bash
# Navigate to the test route
http://localhost:5173/test-ui-layouts
```

This comprehensive layout system provides a solid foundation for building consistent, responsive, and accessible user interfaces in the VowsMarry Wedding Planner Dashboard.