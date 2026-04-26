<script>
  import { PayloadAdminBar } from '$lib'
</script>

<PayloadAdminBar
  logoText="Sniffed, fetched & approved by Ronald 🐕"
  adminPath="/about#ronald"
  cmsURL="https://zapal.tech"
  devMode={{
    email: 'ronald@zapal.tech',
  }}
  labels={{ logout: 'Sign out' }}
/>

<main
  style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:760px;margin:80px auto;padding:0 1.5rem;line-height:1.6;color:#111"
>
  <h1 style="font-size:2rem;margin-bottom:0.25rem">payload-admin-bar-svelte</h1>
  <p style="color:#555;margin-top:0">
    A Payload CMS Admin Bar component for Svelte 5, built by <a
      href="https://zapal.tech?utm_source=demo&utm_medium=referral&utm_campaign=payload-admin-bar-svelte&utm_content=banner"
      style="color:#ff2800;font-weight:700;">Zapal</a
    >.
  </p>

  <hr style="border:none;border-top:1px solid #e0e0e0;margin:2rem 0" />

  <section>
    <h2 style="font-size:1.25rem">About Zapal</h2>
    <p>
      <a
        href="https://zapal.tech?utm_source=demo&utm_medium=referral&utm_campaign=payload-admin-bar-svelte&utm_content=about-zapal-company-name"
        style="color:#931200">Zapal</a
      > is a software development company focused on building modern web applications and open-source developer tooling. We create high-quality
      solutions using cutting-edge technologies like Svelte, SvelteKit, and Payload CMS.
    </p>
    <p>
      Reach us at <a href="mailto:hello@zapal.tech" style="color:#931200">hello@zapal.tech</a> or visit our website at
      <a
        href="https://zapal.tech?utm_source=demo&utm_medium=referral&utm_campaign=payload-admin-bar-svelte&utm_content=about-zapal-website-link"
        style="color:#931200">zapal.tech</a
      >.
    </p>
  </section>

  <section style="margin-top:2rem">
    <h2 style="font-size:1.25rem">Component preview</h2>
    <p>
      The admin bar above is rendered in <code>devMode</code> — it uses a dummy user so you can see it without a live Payload CMS backend.
      In production the bar appears only for authenticated users.
    </p>
  </section>

  <section style="margin-top:2rem">
    <h2 style="font-size:1.25rem">Quick start</h2>
    <pre style="background:#f4f4f4;border-radius:6px;padding:1rem;overflow-x:auto;font-size:0.875rem"><code
        >npm install @zapal/payload-admin-bar-svelte</code
      ></pre>
    <pre style="background:#f4f4f4;border-radius:6px;padding:1rem;overflow-x:auto;font-size:0.875rem"><code
        >&lt;script&gt;
  import &#123; PayloadAdminBar &#125; from '@zapal/payload-admin-bar-svelte'
&lt;/script&gt;

&lt;PayloadAdminBar cmsURL="https://your-cms.com" /&gt;</code
      ></pre>
  </section>

  <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid #e0e0e0;font-size:0.875rem;color:#777">
    <p>
      <a href="https://github.com/zapal-tech/payload-admin-bar-svelte" style="color:#931200">GitHub</a>
      &nbsp;·&nbsp;
      <a href="https://www.npmjs.com/package/@zapal/payload-admin-bar-svelte" style="color:#931200">npm</a>
      &nbsp;·&nbsp;
      <a
        href="https://zapal.tech?utm_source=demo&utm_medium=referral&utm_campaign=payload-admin-bar-svelte&utm_content=footer"
        style="color:#931200">zapal.tech</a
      >
    </p>
  </footer>
</main>
