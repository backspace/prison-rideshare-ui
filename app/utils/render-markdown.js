import { Marked } from 'marked';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Raw HTML in a post is escaped rather than passed through, so post content
// cannot inject markup. Posts are admin-authored, but they are still stored
// user input rendered with innerHTML.
const marked = new Marked({
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
  },
});

export default function renderMarkdown(markdown) {
  if (!markdown) {
    return '';
  }

  return marked.parse(markdown);
}
