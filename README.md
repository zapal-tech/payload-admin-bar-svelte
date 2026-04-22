# Payload Admin Bar for Svelte

A Svelte 5 component for the Payload CMS admin bar; a full rewrite of the original React component
([@payloadcms/admin-bar](https://www.npmjs.com/package/@payloadcms/admin-bar)) for Svelte applications.

<p style="padding:0.5rem 1rem;background:rgba(0,0,0,0.08)">
  This package is proudly built and maintained by <a href="https://zapal.tech" style="color:#ff2800">Zapal</a>.<br>
  We are a Ukrainian software development company committed to giving back to the open-source community.
</p>

## Installation

```sh
pnpm add @zapal/payload-admin-bar-svelte
```

## Usage

```svelte
<script lang="ts">
  import { PayloadAdminBar } from '@zapal/payload-admin-bar-svelte'
</script>

<PayloadAdminBar cmsURL="https://cms.example.com" collectionSlug="pages" id="12345" />
```

## Props

| Prop                       | Type                                     | Default               | Description                                                                                                                                                                             |
| -------------------------- | ---------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cmsURL`                   | `string`                                 | -                     | **Required.** Base URL of your Payload CMS instance, e.g. `'https://cms.example.com'`.                                                                                                  |
| `adminPath`                | `string`                                 | `'/admin'`            | URL path to the Payload admin panel.                                                                                                                                                    |
| `apiPath`                  | `string`                                 | `'/api'`              | URL path to the Payload REST API.                                                                                                                                                       |
| `authCollectionSlug`       | `string`                                 | `'users'`             | Slug of the authentication collection.                                                                                                                                                  |
| `collectionSlug`           | `string`                                 | -                     | Slug of the collection the current page belongs to. Enables "Edit …" and "New …" links.                                                                                                 |
| `id`                       | `string`                                 | -                     | Document ID used to build the "Edit …" link. Requires `collectionSlug`.                                                                                                                 |
| `elementId`                | `string`                                 | `'payload-admin-bar'` | The `id` HTML attribute of the bar's root element.                                                                                                                                      |
| `logo`                     | `Snippet`                                | -                     | Custom logo snippet rendered inside the logo link. When provided, `logoText` is ignored.                                                                                                |
| `logoText`                 | `string`                                 | `'Payload CMS'`       | Text shown in the logo link when no custom `logo` snippet is provided.                                                                                                                  |
| `collectionLabels`         | `{ singular?: string; plural?: string }` | -                     | Labels for "Edit …" and "New …" links (e.g. `{ singular: 'Post' }` → "Edit Post").                                                                                                      |
| `labels`                   | `object`                                 | -                     | Translations / overrides for all button and link text. See [Labels](#labels) below.                                                                                                     |
| `getUserLabel`             | `(user) => string`                       | -                     | Returns the display string for the profile link. Defaults to `user.email`. See [Profile label](#profile-label) below.                                                                   |
| `class`                    | `ClassValue`                             | -                     | CSS class on the root element. Accepts strings, arrays, or objects (clsx-compatible).                                                                                                   |
| `classes`                  | `object`                                 | -                     | Per-element class overrides: `logo`, `user`, `controls`, `edit`, `create`, `preview`, `logout`.                                                                                         |
| `style`                    | `string`                                 | -                     | Extra inline CSS appended after default styles on the root element.                                                                                                                     |
| `unstyled`                 | `boolean`                                | `false`               | When `true`, removes all default inline styles.                                                                                                                                         |
| `preview`                  | `boolean`                                | -                     | When `true`, shows the "Exit preview mode" button.                                                                                                                                      |
| `devMode`                  | `boolean \| object`                      | -                     | When `true`, renders with the built-in dummy user. When an object, its fields are merged over the dummy user — enabling a custom preview user. See [devMode user](#devmode-user) below. |
| `suppressFetchUserWarning` | `boolean`                                | -                     | When `true`, suppresses the `console.warn` emitted when the `/me` fetch fails. Useful in environments where unauthenticated requests are expected.                                      |
| `onAuthChange`             | `(user) => void`                         | -                     | Callback fired when authentication state changes. Receives the user object, `null`, or `undefined`.                                                                                     |
| `onPreviewExit`            | `() => void`                             | -                     | Callback fired when "Exit preview mode" is clicked.                                                                                                                                     |
| `logoProps`                | `HTMLAnchorAttributes`                   | -                     | Extra HTML attributes forwarded to the logo `<a>`.                                                                                                                                      |
| `userProps`                | `HTMLAnchorAttributes`                   | -                     | Extra HTML attributes forwarded to the user profile `<a>`.                                                                                                                              |
| `editProps`                | `HTMLAnchorAttributes`                   | -                     | Extra HTML attributes forwarded to the "Edit …" `<a>`.                                                                                                                                  |
| `createProps`              | `HTMLAnchorAttributes`                   | -                     | Extra HTML attributes forwarded to the "New …" `<a>`.                                                                                                                                   |
| `logoutProps`              | `HTMLAnchorAttributes`                   | -                     | Extra HTML attributes forwarded to the logout `<a>`.                                                                                                                                    |
| `divProps`                 | `HTMLAttributes<HTMLDivElement>`         | -                     | Extra HTML attributes forwarded to the controls `<div>`.                                                                                                                                |
| `previewProps`             | `HTMLButtonAttributes`                   | -                     | Extra HTML attributes forwarded to the preview `<button>`.                                                                                                                              |

### Labels

The `labels` prop lets you translate or override every piece of text rendered by the component (e.g. for internationalization).
You can provide a plain string to fully replace a label, or a function that receives `{ slug, label }` — where `slug` is the
current `collectionSlug` and `label` is the singular label from `collectionLabels.singular` — allowing precise control over the
composed string.

```svelte
<script lang="ts">
  import { PayloadAdminBar } from '@zapal/payload-admin-bar-svelte'

  const currentCollectionSlug = 'pages' // dynamic value in a real app
  const currentDocumentId = 1 // dynamic value in a real app
  const labels = {
    pages: 'сторінка',
    blog: 'пост',
  }

  const getPageCollectionLabel = (slug: string): string => labels[slug] ?? 'документ'
</script>

<PayloadAdminBar
  cmsURL="https://cms.example.com"
  collectionSlug={currentCollectionSlug}
  id={currentDocumentId}
  collectionLabels={{ singular: getPageCollectionLabel(currentCollectionSlug) }}
  labels={{
    edit: 'Редагувати',
    create: ({ label }) => {
      if (label === 'сторінка') return 'Нова сторінка'

      return `Новий ${label}`
    },
    logout: 'Logga ut',
    exitPreview: 'Quitter le mode aperçu',
    profile: 'Účet', // fallback when user has no email
  }}
/>
```

| Key           | Type                                                               | Default                              |
| ------------- | ------------------------------------------------------------------ | ------------------------------------ |
| `edit`        | `string \| ((options: { slug: string; label: string }) => string)` | `` ({ label }) => `Edit ${label}` `` |
| `create`      | `string \| ((options: { slug: string; label: string }) => string)` | `` ({ label }) => `New ${label}` ``  |
| `logout`      | `string`                                                           | `'Logout'`                           |
| `exitPreview` | `string`                                                           | `'Exit preview mode'`                |
| `profile`     | `string`                                                           | `'Profile'`                          |

### devMode user

Passing an object to `devMode` lets you customize the preview user shown in the bar during local development. Any fields you
provide are merged over the built-in dummy user, so omitted fields fall back to the defaults (`id: 1`,
`email: 'hello@zapal.tech'`, `firstName: 'Ronald'`, `lastName: 'CEO'`).

```svelte
<!-- uses built-in dummy user -->
<PayloadAdminBar cmsURL="https://cms.example.com" devMode={true} />

<!-- custom preview user -->
<PayloadAdminBar
  cmsURL="https://cms.example.com"
  devMode={{ email: 'dev@mycompany.com', id: '42', firstName: 'Dev', role: 'editor' }}
  getUserLabel={(user) => `${user.firstName} (${user.role})`}
/>
```

The devMode object accepts the same shape as `PayloadMeUser` but all fields are optional:

| Field   | Type               | Description                                     |
| ------- | ------------------ | ----------------------------------------------- |
| `email` | `string`           | Overrides the dummy user email.                 |
| `id`    | `number \| string` | Overrides the dummy user id.                    |
| `[key]` | `unknown`          | Any extra fields accessible via `getUserLabel`. |

When a real authenticated user is returned from the CMS, `devMode` is ignored regardless of its value.

### Profile label

By default the profile link shows `user.email`. Use `getUserLabel` to display any other field:

```svelte
<PayloadAdminBar
  cmsURL="https://cms.example.com"
  getUserLabel={user => (user.username as string) ?? user.email}
/>
```

The function receives the full user object (typed as `NonNullable<PayloadMeUser>`), which includes `email`, `id`, and any
additional fields returned by Payload (available as `unknown` via the index signature).

## Differences from `@payloadcms/admin-bar`

This package is a Svelte 5 rewrite of the original React component. Key differences:

### Renamed props

| Original     | Svelte    |
| ------------ | --------- |
| `className`  | `class`   |
| `classNames` | `classes` |

### Changed prop types

| Prop                                                                | Original (React)                             | Svelte                                                                             |
| ------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `logo`                                                              | `ReactElement`                               | `Snippet` (Svelte snippet)                                                         |
| All `style` props                                                   | `CSSProperties` (object)                     | `string` (CSS string, e.g. `'color:red'`)                                          |
| All class props                                                     | `string`                                     | `ClassValue` (from `svelte/elements` — supports strings, arrays, objects via clsx) |
| `logoProps`, `userProps`, `editProps`, `createProps`, `logoutProps` | custom `AnchorExtraProps`                    | `HTMLAnchorAttributes` (from `svelte/elements`)                                    |
| `divProps`                                                          | `{ [key: string]: unknown; style?: string }` | `HTMLAttributes<HTMLDivElement>` (from `svelte/elements`)                          |
| `previewProps`                                                      | `{ [key: string]: unknown; style?: string }` | `HTMLButtonAttributes` (from `svelte/elements`)                                    |
| `PayloadMeUser.id`                                                  | `string`                                     | `number \| string` (depends on database adapter)                                   |

### New props

- **`elementId`** — overrides the `id` attribute of the bar element (default: `'payload-admin-bar'`).
- **`logoText`** — sets the default logo text (default: `'Payload CMS'`). Ignored when a custom `logo` snippet is provided.
- **`labels`** — translation / override object for all button and link text (`edit`, `create`, `logout`, `exitPreview`,
  `profile`). The `edit` and `create` values accept a function with signature `({ slug, label }) => string`.
- **`getUserLabel`** — function to derive a display string from the authenticated user object, enabling display of any user field
  (e.g. `username`) instead of `email`.
- **`devMode` (extended)** — now accepts an object in addition to `boolean`. When an object is passed, its fields are merged over
  the built-in dummy user so you can preview the bar with realistic data. See [devMode user](#devmode-user).
- **`suppressFetchUserWarning`** — suppresses the `console.warn` logged when the `/me` fetch throws. Set this when unauthenticated
  requests are an expected condition in your environment (e.g. static site previews, storybooks).

### Removed exports

- **`AnchorExtraProps`** — replaced by `HTMLAnchorAttributes` from `svelte/elements`.

### Behavioural changes

- **`cmsURL` has no default.** The component will not fetch or render without it. Previously the React component defaulted to
  `'http://localhost:3000'`.
- **URL construction uses `new URL()`** for safe, standards-compliant URL building rather than plain string concatenation.
- **Svelte 5 runes** — internally uses `$props()`, `$state()`, `$derived()`, and `$effect()`.

<br/><hr/><br/>

## About Zapal

We are a Ukrainian IT outsourcing and software development company. We believe in giving back to the community, which is why we
open-source the tools we build and use daily to ship high-quality software.

If this package helped you save time, imagine what our dedicated team could do for your product. Whether you need help with
complex custom integrations, building an app from scratch, or expanding your engineering capacity, we are open for business.

- **[Explore our work](https://zapal.tech/projects)**
- **[Hire us for your next project](https://zapal.tech/contacts)**

## Stand with Ukraine 🇺🇦

Zapal is a Ukrainian company. russia's war against our country began in 2014, and since February 2022, our country has been
defending itself against a brutal, unprovoked full-scale invasion by Russia.

We are fighting an existential war against what was once called the "second army in the world." The odds are incredibly
disproportionate, yet Ukraine stands.

While our cities face relentless missile strikes and attacks, our people refuse to break. Our developers continue to write code;
sometimes from bomb shelters, sometimes running on generators, and still we continue to deliver.

But **the only reason** we are alive, working, and able to contribute to the open-source community is the unimaginable daily
heroism of the Ukrainian Armed Forces.

If you use our software, please consider supporting the defenders who make our work possible. Every donation helps balance the
scales and save lives:

If you find this package useful, we ask that you consider supporting the defenders who make our work possible. Every donation
helps balance the scales and save lives:

- **[Come Back Alive](https://savelife.in.ua/en/)** - The largest foundation providing vital tactical equipment, armor, and
  technology to defenders.
- **[Sternenko Fund](https://sternenkofund.org/en/)** - A highly effective initiative focused on supplying FPV drones and
  reconnaissance UAVs directly to front-line units.
- **[United24](https://u24.gov.ua/)** - The official fundraising platform of Ukraine, allowing you to donate directly to Defense,
  Medical Aid, or Rebuilding efforts.
- **[Learn more about how you can help](https://www.zapal.tech/support-ukraine)**
