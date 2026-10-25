const form = document.querySelector('#waitlist-form');
const submitButton = document.querySelector('#join-waitlist');
const statusMessage = document.querySelector('#waitlist-status');
const success = document.querySelector('#waitlist-success');
let submitting = false;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitting || !form.reportValidity()) return;
  const endpoint = window.BLOCKTAP_WAITLIST_URL;
  if (!endpoint) {
    statusMessage.textContent = 'The waitlist is temporarily unavailable. Please try again shortly.';
    return;
  }
  submitting = true;
  submitButton.disabled = true;
  form.setAttribute('aria-busy', 'true');
  statusMessage.textContent = 'Saving your spot…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const values = Object.fromEntries(new FormData(form));
    values.consent = form.elements.consent.checked;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      signal: controller.signal,
      credentials: 'omit',
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) {
      throw new Error(result.error || 'We couldn’t save your spot. Please try again.');
    }
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.focus();
  } catch (error) {
    statusMessage.textContent = error.name === 'AbortError' || error instanceof TypeError
      ? 'We couldn’t confirm your spot. Check your connection and try again — you won’t be added twice.'
      : error.message;
  } finally {
    clearTimeout(timeout);
    submitting = false;
    submitButton.disabled = false;
    form.removeAttribute('aria-busy');
  }
});
