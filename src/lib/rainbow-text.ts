import { applyRainbowEnter, applyRainbowLeave } from '@/lib/motion';

const SKIP_CLOSEST =
  'script, style, noscript, textarea, input, select, option, code, pre, svg, canvas, [data-rainbow-skip], [data-hero-section-title], [data-rainbow-char]';

const enhancedRoots = new WeakSet<HTMLElement>();

export function isRainbowTextEnabled(value: string | null) {
  return value === '' || value === 'on' || value === 'true';
}

function shouldSkipNode(node: Text) {
  const parent = node.parentElement;
  if (!parent) {
    return true;
  }

  if (parent.closest(SKIP_CLOSEST)) {
    return true;
  }

  const text = node.textContent;
  if (!text || !text.trim()) {
    return true;
  }

  return false;
}

function wrapTextNode(node: Text) {
  const text = node.textContent ?? '';
  const fragment = document.createDocumentFragment();

  for (const character of text) {
    if (/\s/.test(character)) {
      fragment.appendChild(document.createTextNode(character));
      continue;
    }

    const span = document.createElement('span');
    span.dataset.rainbowChar = '';
    span.textContent = character;
    fragment.appendChild(span);
  }

  node.parentNode?.replaceChild(fragment, node);
}

function wrapCharacters(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return shouldSkipNode(node as Text)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  nodes.forEach(wrapTextNode);
}

function bindDelegatedHover(root: HTMLElement) {
  if (enhancedRoots.has(root)) {
    return;
  }

  const onEnter = (event: Event) => {
    if (!isRainbowTextEnabled(root.getAttribute('data-rainbow-text'))) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const character = target.closest<HTMLElement>('[data-rainbow-char]');
    if (!character || !root.contains(character)) {
      return;
    }

    if (!character.dataset.rainbowRest) {
      character.dataset.rainbowRest = getComputedStyle(character).color;
    }

    applyRainbowEnter(character);
  };

  const onLeave = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const character = target.closest<HTMLElement>('[data-rainbow-char]');
    if (!character || !root.contains(character)) {
      return;
    }

    applyRainbowLeave(
      character,
      character.dataset.rainbowRest || getComputedStyle(character).color,
    );
  };

  root.addEventListener('mouseover', onEnter);
  root.addEventListener('mouseout', onLeave);
  enhancedRoots.add(root);
}

export function enableRainbowText(root: HTMLElement) {
  wrapCharacters(root);
  bindDelegatedHover(root);
}

export function syncRainbowText(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-rainbow-text]').forEach((root) => {
    if (isRainbowTextEnabled(root.getAttribute('data-rainbow-text'))) {
      enableRainbowText(root);
    }
  });
}
