<script module lang="ts">
  // Module-level constants. Created once per import, not per instance.
  const styles = {
    bar: 'align-items:center;background-color:#000d;box-sizing:border-box;color:#fff;display:flex;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:small;left:0;min-width:0;padding:0.25rem 0.5rem;position:fixed;top:0;width:100%;z-index:99999',
    logo: 'align-items:center;color:inherit;display:flex;flex-shrink:0;height:20px;margin-right:10px;text-decoration:none',
    user: 'color:inherit;display:block;margin-right:10px;min-width:50px;overflow:hidden;text-decoration:none;text-overflow:ellipsis;white-space:nowrap',
    controls: 'align-items:center;display:flex;flex-grow:1;flex-shrink:1;justify-content:flex-end;margin-right:10px',
    link: 'color:inherit;display:block;flex-shrink:1;overflow:hidden;text-decoration:none;text-overflow:ellipsis;white-space:nowrap',
    span: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
    preview:
      'background:none;border:none;color:inherit;cursor:pointer;font-family:inherit;font-size:inherit;margin-left:10px;padding:0',
  } as const

  const dummyUser = {
    id: 1,
    email: 'hello@zapal.tech',
    firstName: 'Ronald',
    lastName: 'CEO',
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  import type { PayloadAdminBarProps, PayloadMeUser } from './types'

  const {
    id: docID,
    barProps,
    elementId = 'payload-admin-bar',
    adminPath = '/admin',
    apiPath = '/api',
    authCollectionSlug = 'users',
    class: className,
    classes,
    cmsURL,
    collectionLabels,
    collectionLabelsLocale,
    collectionSlug,
    createProps,
    devMode,
    additionalControls,
    controlsProps,
    editProps,
    suppressFetchUserWarning,
    getUserLabel,
    labels,
    logo,
    logoProps,
    logoText = 'Dashboard',
    logoutProps,
    onAuthChange,
    preview,
    previewProps,
    showEnterPreview,
    onPreviewEnter,
    onPreviewExit,
    style,
    unstyled,
    userProps,
  }: PayloadAdminBarProps = $props()

  let user = $state<PayloadMeUser>(undefined)

  const styled = $derived(!unstyled)
  const adminPathWithNoTrailingSlash = $derived(adminPath.endsWith('/') ? adminPath.slice(0, -1) : adminPath)
  const apiPathWithNoTrailingSlash = $derived(apiPath.endsWith('/') ? apiPath.slice(0, -1) : apiPath)

  /**
   * Resolves a label for the edit or create links.
   * If `override` is a function it receives the collection singular label; a string is used as-is;
   * `undefined` falls back to the default composed string.
   */
  function resolveCollectionLabel(
    override: string | ((options: { slug: string; label: string; locale?: string }) => string) | undefined,
    defaultVerb: string,
  ): string {
    const label = collectionLabels?.singular
      ? typeof collectionLabels.singular === 'string'
        ? collectionLabels.singular
        : (collectionLabels.singular?.[collectionLabelsLocale ?? 'en'] ?? 'page')
      : 'page'
    const slug = collectionSlug ?? ''
    if (typeof override === 'function') return override({ slug, label, locale: collectionLabelsLocale })
    return override ?? `${defaultVerb} ${label}`
  }

  /**
   * Safely builds an absolute URL by resolving `path` against `cmsURL`.
   * Falls back to concatenation if `URL` construction fails.
   */
  function buildURL(path: string): string {
    if (!cmsURL) return path

    try {
      const base = cmsURL.endsWith('/') ? cmsURL : `${cmsURL}/`
      const relativePath = path.startsWith('/') ? path.slice(1) : path

      return new URL(relativePath, base).href
    } catch {
      return `${cmsURL.endsWith('/') ? cmsURL.slice(0, -1) : cmsURL}${path.startsWith('/') ? path : `/${path}`}`
    }
  }

  /**
   * Merges a default style string with an optional consumer override.
   * Returns `undefined` when both are empty so the attribute is omitted entirely.
   */
  function getStyle(base: string, extra?: string | null): string | undefined {
    const effectiveBase = styled ? base : ''

    if (!effectiveBase && !extra) return undefined
    if (!effectiveBase) return extra ?? undefined
    if (!extra) return effectiveBase

    return `${effectiveBase};${extra}`
  }

  onMount(() => {
    const fetchMe = async () => {
      const resolvedDevUser =
        typeof devMode === 'object' && devMode !== null ? ({ ...dummyUser, ...devMode } as NonNullable<PayloadMeUser>) : dummyUser

      if (!cmsURL) {
        user = devMode ? resolvedDevUser : null

        return
      }

      try {
        const meURL = buildURL(`${apiPathWithNoTrailingSlash}/${authCollectionSlug}/me`)
        const meResponse = await fetch(meURL, {
          method: 'GET',
          credentials: 'include',
        })
        const { user: fetchedUser } = (await meResponse.json()) as { user?: PayloadMeUser }

        user = fetchedUser ?? (devMode ? resolvedDevUser : null)
      } catch (err) {
        if (!suppressFetchUserWarning) console.warn('[PayloadAdminBar]', err)
        if (devMode) user = resolvedDevUser
      }
    }

    void fetchMe()
  })

  $effect(() => {
    onAuthChange?.(user)
  })
</script>

{#if user}
  {@const { id: userID, email } = user}
  <div {...barProps} class={className} id={elementId} style={getStyle(styles.bar, style)}>
    <a {...logoProps} class={classes?.logo} href={buildURL(adminPath)} style={getStyle(styles.logo, logoProps?.style)}>
      {#if logo}
        {@render logo()}
      {:else}
        {logoText}
      {/if}
    </a>
    <a
      rel="noopener noreferrer"
      target="_blank"
      {...userProps}
      href={buildURL(`${adminPathWithNoTrailingSlash}/collections/${authCollectionSlug}/${userID}`)}
      class={classes?.user}
      style={getStyle(styles.user, userProps?.style)}
    >
      <span style={getStyle(styles.span)}>{getUserLabel ? getUserLabel(user) : email || labels?.profile || 'Profile'}</span>
    </a>
    <div {...controlsProps} class={classes?.controls} style={getStyle(styles.controls, controlsProps?.style)}>
      {#if additionalControls}
        {@render additionalControls()}
      {/if}

      {#if collectionSlug && docID}
        <a
          rel="noopener noreferrer"
          target="_blank"
          {...editProps}
          href={buildURL(`${adminPathWithNoTrailingSlash}/collections/${collectionSlug}/${docID}`)}
          class={classes?.edit}
          style={getStyle(styles.link, editProps?.style)}
        >
          <span style={getStyle(styles.span)}>{resolveCollectionLabel(labels?.edit, 'Edit')}</span>
        </a>
      {/if}
      {#if collectionSlug}
        <a
          rel="noopener noreferrer"
          target="_blank"
          {...createProps}
          class={classes?.create}
          href={buildURL(`${adminPathWithNoTrailingSlash}/collections/${collectionSlug}/create`)}
          style={getStyle(styles.link, createProps?.style)}
        >
          <span style={getStyle(styles.span)}>{resolveCollectionLabel(labels?.create, 'New')}</span>
        </a>
      {/if}
      {#if preview}
        <button
          {...previewProps}
          class={classes?.preview}
          onclick={onPreviewExit}
          type="button"
          style={getStyle(styles.preview, previewProps?.style)}
        >
          {labels?.exitPreview ?? 'Exit preview mode'}
        </button>
      {:else if showEnterPreview}
        <button
          {...previewProps}
          class={classes?.preview}
          onclick={onPreviewEnter}
          type="button"
          style={getStyle(styles.preview, previewProps?.style)}
        >
          {labels?.enterPreview ?? 'Enter preview mode'}
        </button>
      {/if}
      <a
        rel="noopener noreferrer"
        target="_blank"
        {...logoutProps}
        class={classes?.logout}
        href={buildURL(`${adminPathWithNoTrailingSlash}/logout`)}
        style={getStyle(styles.link, logoutProps?.style)}
      >
        <span style={getStyle(styles.span)}>{labels?.logout ?? 'Logout'}</span>
      </a>
    </div>
  </div>
{/if}
