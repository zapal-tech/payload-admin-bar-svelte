import type { Snippet } from 'svelte'
import type { ClassValue, HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements'

export type PayloadMeUser =
  | {
      email: string
      id: number | string
      [key: string]: unknown
    }
  | null
  | undefined

/** Inline CSS string, e.g. `'color:red;font-size:14px'`. */
export type StyleProps = string

export type PayloadAdminBarProps = {
  /** URL path to the Payload admin panel. @default '/admin' */
  adminPath?: string
  /** URL path to the Payload REST API. @default '/api' */
  apiPath?: string
  /** Slug of the collection used for authentication. @default 'users' */
  authCollectionSlug?: string
  /** CSS class applied to the admin bar root element. Accepts any value supported by `clsx` (string, array, object). */
  class?: ClassValue
  /** CSS classes applied to individual child elements. Each value accepts any `clsx`-compatible class. */
  classes?: {
    /** CSS class for the controls wrapper `<div>`. */
    controls?: ClassValue
    /** CSS class for the "New …" create anchor. */
    create?: ClassValue
    /** CSS class for the "Edit …" anchor. */
    edit?: ClassValue
    /** CSS class for the logo anchor. */
    logo?: ClassValue
    /** CSS class for the logout anchor. */
    logout?: ClassValue
    /** CSS class for the "Exit preview mode" button. */
    preview?: ClassValue
    /** CSS class for the user profile anchor. */
    user?: ClassValue
  }
  /**
   * Base URL of the Payload CMS instance, e.g. `'https://cms.example.com'`
   *
   * **Required**. The component will not render or fetch without it.
   */
  cmsURL: string
  /** Singular and plural labels used in the "Edit …" and "New …" links. */
  collectionLabels?: {
    /** Plural label, e.g. `'Posts'`. Currently unused in link text but available for custom rendering. */
    plural?: string
    /** Singular label used in link text, e.g. `'Post'` → "Edit Post" / "New Post". */
    singular?: string
  }
  /** Slug of the collection the current document belongs to. Enables the "Edit …" and "New …" links. */
  collectionSlug?: string
  /** Extra HTML attributes forwarded to the "New …" create `<a>` element. */
  createProps?: HTMLAnchorAttributes
  /**
   * When `true`, renders the bar with the built-in dummy user even when not authenticated.
   * When an object, the provided fields are merged over the default dummy user — useful for
   * previewing the bar with realistic data during local development.
   *
   * @example `devMode={true}` — uses built-in dummy user
   * @example `devMode={{ email: 'dev@example.com', id: '42', firstName: 'Dev' }}` — custom preview user
   */
  devMode?: boolean | { email?: string; id?: number | string; [key: string]: unknown }
  /** Extra HTML attributes forwarded to the controls `<div>` element. */
  divProps?: HTMLAttributes<HTMLDivElement>
  /**
   * When `true`, suppresses the `console.warn` emitted when the `/me` fetch fails.
   * Useful in environments where unauthenticated requests are expected (e.g. static previews).
   */
  suppressFetchUserWarning?: boolean
  /**
   * The `id` HTML attribute of the admin bar root element.
   * @default 'payload-admin-bar'
   */
  elementId?: string
  /** Extra HTML attributes forwarded to the "Edit …" `<a>` element. */
  editProps?: HTMLAnchorAttributes
  /**
   * Returns the display string for the authenticated user shown in the profile link.
   * Receives the full user object; defaults to `user.email`, falling back to `labels.profile` or `'Profile'`.
   *
   * @example `getUserLabel={user => user.username as string}`
   */
  getUserLabel?: (user: NonNullable<PayloadMeUser>) => string
  /** The document `id`. Used to build the "Edit …" link URL. Requires `collectionSlug` to take effect. */
  id?: string
  /**
   * Translations / overrides for button and link text.
   *
   * For `edit` and `create`, a plain `string` replaces the entire label;
   * a function receives the collection's singular label (e.g. `'Post'`) and returns the composed string.
   */
  labels?: {
    /**
     * Override for the "Edit …" link text.
     * @example `edit: 'Редагувати'` or `edit: ({ label }) => \`Bearbeiten ${label}\``
     * @default ({ label }) => \`Edit ${label}\`
     */
    edit?: string | ((options: { slug: string; label: string }) => string)
    /**
     * Override for the "New …" link text.
     * @example `create: 'Створити'` or `create: ({ label }) => \`Neu ${label}\``
     * @default ({ label }) => \`New ${label}\`
     */
    create?: string | ((options: { slug: string; label: string }) => string)
    /**
     * Override for the logout link text.
     * @default 'Logout'
     */
    logout?: string
    /**
     * Override for the "Exit preview mode" button text.
     * @default 'Exit preview mode'
     */
    exitPreview?: string
    /**
     * Fallback profile link text used when `getUserLabel` is not set and the user has no email.
     * @default 'Profile'
     */
    profile?: string
  }
  /** Custom logo content rendered inside the logo link. When provided, `logoText` is ignored. */
  logo?: Snippet
  /**
   * Text shown inside the logo link when no custom `logo` snippet is provided.
   * @default 'Payload CMS'
   */
  logoText?: string
  /** Extra HTML attributes forwarded to the logo `<a>` element. */
  logoProps?: HTMLAnchorAttributes
  /** Extra HTML attributes forwarded to the logout `<a>` element. */
  logoutProps?: HTMLAnchorAttributes
  /** Callback fired whenever the authenticated user state changes. Called with `undefined` while loading, the user object on success, or `null` when not authenticated. */
  onAuthChange?: (user: PayloadMeUser) => void
  /** Callback fired when the "Exit preview mode" button is clicked. */
  onPreviewExit?: () => void
  /** When `true`, shows the "Exit preview mode" button. */
  preview?: boolean
  /** Extra HTML attributes forwarded to the "Exit preview mode" `<button>` element. */
  previewProps?: HTMLButtonAttributes
  /** Inline CSS string appended after default styles on the root element, e.g. `'margin-top:48px'`. */
  style?: string
  /** When `true`, removes all default inline styles, giving full style control. @default false */
  unstyled?: boolean
  /** Extra HTML attributes forwarded to the user profile `<a>` element. */
  userProps?: HTMLAnchorAttributes
}
