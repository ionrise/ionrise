(() => {
  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const status = document.querySelector('#inquiry-status');
  const submit = form.querySelector('button[type="submit"]');
  const widget = document.querySelector('#turnstile-widget');
  // Empty means same-origin hosting; set only after the Cloudflare Worker URL exists.
  const apiBase = form.dataset.apiBase || '';
  let widgetId, verifiedToken = '';
  // Texty podle jazyka stránky (data-lang na formuláři)
  const EN = form.dataset.lang === 'en';
  const M = EN ? {
    unavailable: 'The form is currently unavailable. Please e-mail us.', verify: 'Please complete the spam check.',
    expired: 'The check has expired, please verify again.', sending: 'Sending your enquiry…', failed: 'The message could not be sent.',
    sent: 'Thank you, your enquiry has been sent.', network: 'Connection failed. Please try again or e-mail us.',
    invalid: 'Please check your name, e-mail, message and the spam check.',
  } : {
    unavailable: 'Formulář je momentálně nedostupný. Napište nám prosím e-mail.', verify: 'Dokončete prosím ověření proti spamu.',
    expired: 'Ověření vypršelo, ověřte se prosím znovu.', sending: 'Odesílám poptávku…', failed: 'Zprávu se nepodařilo odeslat.',
    sent: '', network: 'Spojení se nezdařilo. Zkuste to prosím znovu nebo nám napište e-mail.', invalid: '',
  };
  const setStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', error);
  };
  const initialService = new URLSearchParams(location.search).get('sluzba');
  if (initialService && [...form.elements.service.options].some(option => option.value === initialService)) form.elements.service.value = initialService;

  const unavailable = () => { submit.disabled = true; setStatus(M.unavailable, true); };
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
          setStatus(M.verify);
          widgetId = window.turnstile.render(widget, {
            sitekey: config.sitekey, action: 'poptavka', language: EN ? 'en' : 'cs',
            callback: token => {
              verifiedToken = token;
              submit.disabled = false;
              if (status.textContent === M.verify || status.textContent === M.expired) setStatus('');
            },
            'expired-callback': () => { verifiedToken = ''; submit.disabled = true; setStatus(M.expired, true); },
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
    setStatus(M.sending);
    const data = new FormData(form);
    const payload = Object.fromEntries(['name', 'email', 'phone', 'service', 'message', 'website'].map(key => [key, data.get(key) || '']));
    payload.token = verifiedToken;
    try {
      const response = await fetch(`${apiBase}/api/poptavka`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error((EN ? (response.status === 400 ? M.invalid : M.failed) : result.message) || M.failed);
      form.reset();
      setStatus(M.sent || result.message);
    } catch (error) {
      setStatus(error.message === 'Failed to fetch' ? M.network : error.message, true);
    } finally {
      verifiedToken = '';
      if (widgetId !== undefined && window.turnstile) window.turnstile.reset(widgetId);
    }
  });
  prepare();
})();
