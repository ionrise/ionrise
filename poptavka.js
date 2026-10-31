(() => {
  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const status = document.querySelector('#inquiry-status');
  const submit = form.querySelector('button[type="submit"]');
  const widget = document.querySelector('#turnstile-widget');
  // Empty means same-origin hosting; set only after the Cloudflare Worker URL exists.
  const apiBase = form.dataset.apiBase || '';
  let widgetId, verifiedToken = '';
  const setStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', error);
  };
  const initialService = new URLSearchParams(location.search).get('sluzba');
  if (initialService && [...form.elements.service.options].some(option => option.value === initialService)) form.elements.service.value = initialService;

  const unavailable = () => { submit.disabled = true; setStatus('Formulář je momentálně nedostupný. Napište nám prosím e-mail.', true); };
  async function prepare() {
    try {
      const response = await fetch(`${apiBase}/api/form-config`, { cache: 'no-store' });
      const config = await response.json();
      if (!response.ok || !config.sitekey) return unavailable();
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onerror = unavailable;
      script.onload = () => {
        try {
          setStatus('Dokončete prosím ověření proti spamu.');
          widgetId = window.turnstile.render(widget, {
            sitekey: config.sitekey, action: 'poptavka', language: 'cs',
            callback: token => {
              verifiedToken = token;
              submit.disabled = false;
              if (status.textContent === 'Dokončete prosím ověření proti spamu.' || status.textContent === 'Ověření vypršelo, ověřte se prosím znovu.') setStatus('');
            },
            'expired-callback': () => { verifiedToken = ''; submit.disabled = true; setStatus('Ověření vypršelo, ověřte se prosím znovu.', true); },
            'error-callback': () => { verifiedToken = ''; unavailable(); },
          });
        } catch { unavailable(); }
      };
      document.head.appendChild(script);
    } catch { unavailable(); }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || !verifiedToken) return;
    submit.disabled = true;
    setStatus('Odesílám poptávku…');
    const data = new FormData(form);
    const payload = Object.fromEntries(['name', 'email', 'phone', 'service', 'message', 'website'].map(key => [key, data.get(key) || '']));
    payload.token = verifiedToken;
    try {
      const response = await fetch(`${apiBase}/api/poptavka`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || 'Zprávu se nepodařilo odeslat.');
      form.reset();
      setStatus(result.message);
    } catch (error) {
      setStatus(error.message === 'Failed to fetch' ? 'Spojení se nezdařilo. Zkuste to prosím znovu nebo nám napište e-mail.' : error.message, true);
    } finally {
      verifiedToken = '';
      if (widgetId !== undefined && window.turnstile) window.turnstile.reset(widgetId);
    }
  });
  prepare();
})();
