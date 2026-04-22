import { page } from '@vitest/browser/context'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from 'vitest-browser-svelte'

import AdminBar from './AdminBar.svelte'

const TEST_CMS_URL = 'http://cms.local'
const mockUser = { id: '123', email: 'hello@zapal.tech' }

let mockFetch: ReturnType<typeof vi.fn>

function mockFetchSuccess(user: object | null) {
  mockFetch = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue({ user }),
  } as unknown as Response)
  vi.stubGlobal('fetch', mockFetch)
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('PayloadAdminBar', () => {
  describe('when not authenticated', () => {
    beforeEach(() => {
      mockFetchSuccess(null)
    })

    it('renders nothing when user is null and devMode is off', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL } })
      await expect.poll(() => mockFetch.mock.calls.length).toBeGreaterThan(0)
      await expect.element(page.locator('#payload-admin-bar')).not.toBeInTheDocument()
    })

    it('renders bar in devMode even without a logged-in user', async () => {
      mockFetchSuccess(null)
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, devMode: true } })
      await expect.element(page.getByText('Payload CMS')).toBeVisible()
    })

    it('renders bar in devMode when fetch fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, devMode: true } })
      await expect.element(page.getByText('Payload CMS')).toBeVisible()
    })

    it('renders nothing when cmsURL is not provided and devMode is off', async () => {
      render(AdminBar, { props: {} })
      await expect.element(page.locator('#payload-admin-bar')).not.toBeInTheDocument()
    })
  })

  describe('when devMode is an object', () => {
    it('renders with the provided email', async () => {
      mockFetchSuccess(null)
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, devMode: { email: 'dev@example.com' } } })
      await expect.element(page.getByText('dev@example.com')).toBeVisible()
    })

    it('falls back to dummy email when not provided in devMode object', async () => {
      mockFetchSuccess(null)
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, devMode: { id: '999' } } })
      await expect.element(page.getByText('hello@zapal.tech')).toBeVisible()
    })

    it('uses devMode object extra fields via getUserLabel', async () => {
      mockFetchSuccess(null)
      render(AdminBar, {
        props: {
          cmsURL: TEST_CMS_URL,
          devMode: { firstName: 'DevUser' },
          getUserLabel: (user) => (user.firstName as string) ?? user.email,
        },
      })
      await expect.element(page.getByText('DevUser')).toBeVisible()
    })

    it('renders when fetch fails with devMode object', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, devMode: { email: 'fallback@example.com' } } })
      await expect.element(page.getByText('fallback@example.com')).toBeVisible()
    })

    it('renders when cmsURL is not provided with devMode object', async () => {
      render(AdminBar, { props: { devMode: { email: 'no-cms@example.com' } } })
      await expect.element(page.getByText('no-cms@example.com')).toBeVisible()
    })

    it('devMode object does not override authenticated user from fetch', async () => {
      mockFetchSuccess(mockUser)
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, devMode: { email: 'dev@example.com' } } })
      await expect.element(page.getByText(mockUser.email)).toBeVisible()
      await expect.element(page.getByText('dev@example.com')).not.toBeInTheDocument()
    })
  })

  describe('suppressFetchUserWarning', () => {
    it('emits console.warn when fetch fails and suppressFetchUserWarning is not set', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL } })
      await expect.element(page.locator('#payload-admin-bar')).not.toBeInTheDocument()
      expect(warnSpy).toHaveBeenCalledWith('[PayloadAdminBar]', expect.any(Error))
    })

    it('suppresses console.warn when fetch fails and suppressFetchUserWarning is true', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, suppressFetchUserWarning: true } })
      await expect.element(page.locator('#payload-admin-bar')).not.toBeInTheDocument()
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('still renders in devMode when fetch fails with suppressFetchUserWarning', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, devMode: true, suppressFetchUserWarning: true } })
      await expect.element(page.getByText('Payload CMS')).toBeVisible()
    })
  })

  describe('when authenticated', () => {
    beforeEach(() => {
      mockFetchSuccess(mockUser)
    })

    it('renders the admin bar with default logo text', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL } })
      await expect.element(page.getByText('Payload CMS')).toBeVisible()
    })

    it('renders the user email', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL } })
      await expect.element(page.getByText(mockUser.email)).toBeVisible()
    })

    it('renders logout link', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, adminPath: '/admin' } })
      await expect.element(page.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', `${TEST_CMS_URL}/admin/logout`)
    })

    it('renders edit link when collectionSlug and id are provided', async () => {
      render(AdminBar, {
        props: {
          cmsURL: TEST_CMS_URL,
          adminPath: '/admin',
          collectionSlug: 'posts',
          id: 'abc',
        },
      })
      await expect
        .element(page.getByRole('link', { name: 'Edit page' }))
        .toHaveAttribute('href', `${TEST_CMS_URL}/admin/collections/posts/abc`)
    })

    it('renders edit link with custom label', async () => {
      render(AdminBar, {
        props: {
          cmsURL: TEST_CMS_URL,
          collectionSlug: 'posts',
          id: 'abc',
          collectionLabels: { singular: 'Post' },
        },
      })
      await expect.element(page.getByText('Edit Post')).toBeVisible()
    })

    it('renders create link when collectionSlug is provided', async () => {
      render(AdminBar, {
        props: {
          cmsURL: TEST_CMS_URL,
          adminPath: '/admin',
          collectionSlug: 'posts',
        },
      })
      await expect
        .element(page.getByRole('link', { name: 'New page' }))
        .toHaveAttribute('href', `${TEST_CMS_URL}/admin/collections/posts/create`)
    })

    it('renders create link with custom label', async () => {
      render(AdminBar, {
        props: { cmsURL: TEST_CMS_URL, collectionSlug: 'posts', collectionLabels: { singular: 'Post' } },
      })
      await expect.element(page.getByText('New Post')).toBeVisible()
    })

    it('does not render edit link without id', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, collectionSlug: 'posts' } })
      await expect.element(page.getByText('Payload CMS')).toBeVisible()
      await expect.element(page.getByText('Edit page')).not.toBeInTheDocument()
    })

    it('does not render edit/create links without collectionSlug', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL } })
      await expect.element(page.getByText('Payload CMS')).toBeVisible()
      await expect.element(page.getByText('Edit page')).not.toBeInTheDocument()
      await expect.element(page.getByText('New page')).not.toBeInTheDocument()
    })

    it('renders exit preview button when preview is true', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, preview: true } })
      await expect.element(page.getByText('Exit preview mode')).toBeVisible()
    })

    it('does not render exit preview button when preview is false', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, preview: false } })
      await expect.element(page.getByText('Payload CMS')).toBeVisible()
      await expect.element(page.getByText('Exit preview mode')).not.toBeInTheDocument()
    })

    it('calls onPreviewExit when exit preview button is clicked', async () => {
      const onPreviewExit = vi.fn()
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, preview: true, onPreviewExit } })
      await page.getByText('Exit preview mode').click()
      expect(onPreviewExit).toHaveBeenCalledOnce()
    })

    it('calls onAuthChange with the user', async () => {
      const onAuthChange = vi.fn()
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, onAuthChange } })
      await expect.element(page.getByText(mockUser.email)).toBeVisible()
      expect(onAuthChange).toHaveBeenCalledWith(mockUser)
    })

    it('applies custom class to the bar', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, class: 'my-bar' } })
      await expect.element(page.locator('#payload-admin-bar')).toHaveClass('my-bar')
    })

    it('uses a custom elementId for the bar element', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, elementId: 'my-admin-bar' } })
      await expect.element(page.locator('#my-admin-bar')).toBeInTheDocument()
      await expect.element(page.locator('#payload-admin-bar')).not.toBeInTheDocument()
    })

    it('renders a custom logoText instead of Payload CMS', async () => {
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, logoText: 'My CMS' } })
      await expect.element(page.getByText('My CMS')).toBeVisible()
      await expect.element(page.getByText('Payload CMS')).not.toBeInTheDocument()
    })

    it('uses getUserLabel for the profile link text', async () => {
      const getUserLabel = vi.fn((user: { email: string; username?: string }) => user.username ?? user.email)
      const userWithUsername = { ...mockUser, username: 'johndoe' }
      mockFetchSuccess(userWithUsername)
      render(AdminBar, { props: { cmsURL: TEST_CMS_URL, getUserLabel } })
      await expect.element(page.getByText('johndoe')).toBeVisible()
      expect(getUserLabel).toHaveBeenCalledWith(userWithUsername)
    })

    it('uses custom labels for edit and create links (string)', async () => {
      render(AdminBar, {
        props: {
          cmsURL: TEST_CMS_URL,
          collectionSlug: 'posts',
          id: 'abc',
          labels: { edit: 'Редагувати', create: 'Створити' },
        },
      })
      await expect.element(page.getByText('Редагувати')).toBeVisible()
      await expect.element(page.getByText('Створити')).toBeVisible()
    })

    it('uses custom labels for edit and create links (function)', async () => {
      render(AdminBar, {
        props: {
          cmsURL: TEST_CMS_URL,
          collectionSlug: 'posts',
          id: 'abc',
          collectionLabels: { singular: 'Post' },
          labels: {
            edit: ({ label }) => `Bearbeiten ${label}`,
            create: ({ slug, label }) => `Neu ${label} (${slug})`,
          },
        },
      })
      await expect.element(page.getByText('Bearbeiten Post')).toBeVisible()
      await expect.element(page.getByText('Neu Post (posts)')).toBeVisible()
    })

    it('uses custom labels for logout and exitPreview', async () => {
      render(AdminBar, {
        props: {
          cmsURL: TEST_CMS_URL,
          preview: true,
          labels: { logout: 'Вийти', exitPreview: 'Вийти з перегляду' },
        },
      })
      await expect.element(page.getByText('Вийти')).toBeVisible()
      await expect.element(page.getByText('Вийти з перегляду')).toBeVisible()
    })

    it('uses custom cmsURL and adminPath for links', async () => {
      render(AdminBar, { props: { cmsURL: 'https://cms.example.com', adminPath: '/cms' } })
      await expect.element(page.getByRole('link', { name: 'Payload CMS' })).toHaveAttribute('href', 'https://cms.example.com/cms')
    })

    it('uses custom authCollectionSlug in user link', async () => {
      render(AdminBar, {
        props: {
          cmsURL: TEST_CMS_URL,
          adminPath: '/admin',
          authCollectionSlug: 'admins',
        },
      })
      await expect
        .element(page.getByRole('link', { name: mockUser.email }))
        .toHaveAttribute('href', `${TEST_CMS_URL}/admin/collections/admins/${mockUser.id}`)
    })

    it('fetches /me from the correct endpoint', async () => {
      render(AdminBar, {
        props: { cmsURL: TEST_CMS_URL, apiPath: '/api', authCollectionSlug: 'users' },
      })
      await expect.element(page.getByText(mockUser.email)).toBeVisible()
      expect(fetch).toHaveBeenCalledWith(`${TEST_CMS_URL}/api/users/me`, {
        credentials: 'include',
        method: 'get',
      })
    })
  })
})
