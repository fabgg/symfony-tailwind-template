# Skeleton — Symfony 7.4 + Tailwind CSS

A ready-to-use Symfony 7.4 starter kit with Tailwind CSS, Stimulus, Turbo, and a complete set of UI components. No Node.js required — the entire frontend is managed via Asset Mapper.

## Requirements

- PHP 8.2+
- [Composer](https://getcomposer.org/)
- [Symfony CLI](https://symfony.com/download) (recommended)
- [Docker](https://www.docker.com/) (for PostgreSQL)

## Quick Start

```bash
# 1. Clone the repository
git clone git@github.com:fabgg/symfony-tailwind-template.git my-project
cd my-project

# 2. Install PHP dependencies
composer install

# 3. Start Docker services (PostgreSQL + Mailpit)
docker compose up -d

# 4. Run database migrations
php bin/console doctrine:migrations:migrate --no-interaction

# 5. Build Tailwind CSS
php bin/console tailwind:build

# 6. Start the dev server
symfony server:start
```

The application is available at `https://127.0.0.1:8000`.

## Development

### Tailwind CSS

Tailwind v4 is compiled via `symfonycasts/tailwind-bundle`. Run the watcher during development:

```bash
php bin/console tailwind:build --watch
```

CSS entry point: `assets/styles/app.css`

### Frontend Stack

| Tool | Purpose |
|------|---------|
| **Asset Mapper** | JS dependency management (no Webpack/Encore) |
| **Stimulus** | Lightweight JS controllers |
| **Turbo** | SPA-like page transitions |
| **Tailwind CSS** | Utility-first CSS framework |

JS dependencies are declared in `importmap.php`. To add a new package:

```bash
php bin/console importmap:require <package-name>
```

### Database

PostgreSQL 16 runs via Docker (`compose.yaml`). Default connection:

```
postgresql://app:pwdApp@127.0.0.1:5432/app
```

Common commands:

```bash
php bin/console doctrine:migrations:migrate      # Run migrations
php bin/console doctrine:schema:validate          # Validate schema
php bin/console make:entity                       # Create/edit entity
php bin/console make:migration                    # Generate migration
```

### Code Quality

```bash
php bin/console lint:twig templates/    # Validate Twig syntax
php bin/console lint:yaml config/       # Validate YAML syntax
php bin/console lint:container          # Validate DI container
```

### Testing

```bash
./bin/phpunit                                   # Run all tests
./bin/phpunit tests/Path/To/TestFile.php        # Single file
./bin/phpunit --filter testMethodName            # Single method
```

### Code Generation

```bash
php bin/console make:controller
php bin/console make:entity
php bin/console make:form
php bin/console make:migration
```

## Project Structure

```
assets/
├── app.js                          # JS entry point
├── controllers/                    # Stimulus controllers (17)
│   ├── accordion_controller.js
│   ├── alert_controller.js
│   ├── colorpicker_controller.js
│   ├── darkmode_controller.js
│   ├── datepicker_controller.js
│   ├── daterange_controller.js
│   ├── dropdown_controller.js
│   ├── dropzone_controller.js
│   ├── modal_controller.js
│   ├── password_visibility_controller.js
│   ├── sidebar_controller.js
│   ├── tabs_controller.js
│   ├── tags_controller.js
│   ├── tomselect_controller.js
│   ├── wizard_controller.js
│   └── wysiwyg_controller.js
└── styles/
    ├── app.css                     # CSS entry point (Tailwind)
    └── theme.css                   # Semantic color tokens

src/
├── Controller/                     # Route controllers
├── Entity/                         # Doctrine entities
├── Form/                           # Form types
│   └── Type/                       # Custom field types
└── Repository/                     # Doctrine repositories

templates/
├── base.html.twig                  # Root template
├── layouts/
│   ├── app.html.twig               # Main layout (sidebar + topbar)
│   └── auth.html.twig              # Auth layout (centered card)
├── components/                     # Twig components
│   ├── Accordion.html.twig
│   ├── Alert.html.twig
│   ├── Badge.html.twig
│   ├── Button.html.twig
│   ├── ButtonGroup.html.twig
│   ├── Card.html.twig
│   ├── Modal.html.twig
│   ├── Pagination.html.twig
│   ├── Table.html.twig
│   ├── Tabs.html.twig
│   └── Wizard.html.twig
├── form/
│   └── tailwind_theme.html.twig    # Complete Tailwind form theme
└── pages/                          # Page templates
    ├── auth/                       # Login, Register
    ├── dashboard/                  # Dashboard with stats
    ├── demo/                       # CRUD demo (index, show, new, edit)
    ├── home/                       # Home page
    ├── legal/                      # Legal notice
    ├── profile/                    # User profile (show, edit)
    └── styleguide/                 # Typography, Components, Forms
```

## Available Routes

| Route | Path | Description |
|-------|------|-------------|
| `app_home` | `/` | Home page |
| `app_login` | `/login` | Sign in |
| `app_register` | `/register` | Create account |
| `app_logout` | `/logout` | Log out |
| `app_dashboard` | `/dashboard` | Dashboard with stats |
| `app_profile_show` | `/profile` | View profile |
| `app_profile_edit` | `/profile/edit` | Edit profile |
| `app_demo_index` | `/demo` | Demo CRUD listing |
| `app_demo_new` | `/demo/new` | Create demo item |
| `app_demo_show` | `/demo/{id}` | View demo item |
| `app_demo_edit` | `/demo/{id}/edit` | Edit demo item |
| `app_styleguide_*` | `/styleguide/*` | Typography, Components, Forms |
| `app_legal_mentions` | `/mentions-legales` | Legal notice |

## UI Components

Reusable Twig components using `symfony/ux-twig-component`:

| Component | Usage |
|-----------|-------|
| **Alert** | `<twig:Alert type="success">Message</twig:Alert>` |
| **Badge** | `<twig:Badge variant="success">Active</twig:Badge>` |
| **Breadcrumbs** | `<twig:Breadcrumbs :items="[{label: 'Home', url: '/'}, {label: 'Current'}]" />` |
| **Button** | `<twig:Button variant="primary">Click</twig:Button>` |
| **ButtonGroup** | `<twig:ButtonGroup>...</twig:ButtonGroup>` |
| **Card** | `<twig:Card title="Title">Content</twig:Card>` |
| **Code** | `<twig:Code>some_function()</twig:Code>` |
| **Heading** | `<twig:Heading :level="2">Title</twig:Heading>` |
| **Link** | `<twig:Link href="/url">Click here</twig:Link>` |
| **Mark** | `<twig:Mark>highlighted text</twig:Mark>` |
| **Modal** | `<twig:Modal id="my-modal" title="Title">...</twig:Modal>` |
| **Pagination** | `<twig:Pagination currentPage="1" totalPages="10" route="..." />` |
| **Table** | `<twig:Table hoverable striped>...</twig:Table>` |
| **Tabs** | `<twig:Tabs defaultTab="tab1">...</twig:Tabs>` |
| **Text** | `<twig:Text variant="secondary" size="sm">...</twig:Text>` |
| **Accordion** | `<twig:Accordion>...</twig:Accordion>` |
| **Wizard** | `<twig:Wizard>...</twig:Wizard>` |

## Custom Form Types

Enhanced form fields with JS-powered interactions:

| Type | Description | JS Library |
|------|-------------|------------|
| `ColorPickerType` | Color input with preview | — |
| `DatePickerType` | Date picker | Flatpickr |
| `DateRangeType` | Start/end date range | Flatpickr |
| `DropzoneType` | Drag & drop file upload | — |
| `EnhancedChoiceType` | Searchable select | Tom Select |
| `TagsType` | Tag input with autocomplete | Tom Select |
| `WysiwygType` | Rich text editor | Trix |

## Dark Mode

Three modes available via the toggle button in the topbar:

- **Auto** — follows system preference
- **Dark** — forced dark mode
- **Light** — forced light mode

Colors are defined using semantic CSS custom properties in `assets/styles/theme.css`.

## Environment Configuration

Precedence: real env vars > `.env.local` > `.env.$APP_ENV.local` > `.env.$APP_ENV` > `.env`

Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_ENV` | `dev` | Environment (`dev`, `prod`, `test`) |
| `APP_SECRET` | — | Application secret (generate one) |
| `DATABASE_URL` | `postgresql://app:pwdApp@127.0.0.1:5432/app` | Database connection |
| `MESSENGER_TRANSPORT_DSN` | `doctrine://default` | Async message transport |
| `MAILER_DSN` | `null://null` | Mail transport |

## License

This project is released under the [MIT License](LICENSE.md).
