import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';


export default function mdParser(markdown: string): string {
    
const parser: any = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
                 hljs.highlight(str, { language: lang }).value +
                 '</code></pre>';
        } catch (err) {}
      }
  
      return '<pre class="hljs"><code>' + parser.utils.escapeHtml(str) + '</code></pre>';
    }
  })

return parser.render(markdown)
}