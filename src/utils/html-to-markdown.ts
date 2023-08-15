import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

const removeUnwantedTags = (html: string, tagsToRemove: string[]) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  tagsToRemove.forEach((tag) => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
  });

  return doc.body.innerHTML;
};

export const convertHtmlToMarkdown = (html: string) => {
  // Create an instance of the Turndown service
  const turndownService = new TurndownService();

  // Remove unwanted tags
  html = removeUnwantedTags(html, [
    'style',
    'script',
    'iframe',
    'video',
    'audio',
    'nav',
    'header',
    'footer',
    'aside',
    'form',
    'input',
    'button',
  ]);

  // Find the position of the first h tag
  const firstHTagIndex = Math.min(
    ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
      const index = html.indexOf(`<${tag}>`);
      return index === -1 ? Infinity : index;
    }),
  );

  // Remove content before the h tag
  if (firstHTagIndex !== Infinity) {
    html = html.substring(firstHTagIndex);
  }

  // Convert HTML to Markdown
  const markdown = turndownService.turndown(html);

  return markdown;
};
