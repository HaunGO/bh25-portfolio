const localPart = 'Hello';
const domainPart = 'BrandonHaun.com';

export function getContactEmail() {
  return `${localPart}@${domainPart}`;
}

export function copyContactEmail() {
  const email = getContactEmail();
  const copied = copyWithExecCommand(email);

  if (copied) {
    void navigator.clipboard?.writeText?.(email).catch(() => undefined);
  }

  return copied;
}

export function writeContactEmailToClipboard() {
  const email = getContactEmail();
  if (!navigator.clipboard?.writeText) {
    return Promise.reject(new Error('Clipboard API unavailable'));
  }
  return navigator.clipboard.writeText(email);
}

function copyWithExecCommand(value: string) {
  let copied = false;

  const onCopy = (event: ClipboardEvent) => {
    event.clipboardData?.setData('text/plain', value);
    event.preventDefault();
    copied = true;
  };

  document.addEventListener('copy', onCopy, true);
  try {
    copied = document.execCommand('copy') || copied;
  } catch {
    // Keep the copy-event result if execCommand throws.
  }
  document.removeEventListener('copy', onCopy, true);

  if (copied) {
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, value.length);

  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}
