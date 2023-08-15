import fs from 'fs';
import ora, { Ora } from 'ora';
import { fetchHtmlFromBrowserless } from './utils/fetch-html.js';
import { convertHtmlToMarkdown } from './utils/html-to-markdown.js';
import { isValidUrl } from './utils/is-valid-url.js';

const FILE_PATH = 'urls.txt';

const clearOutputDirectory = (): void => {
  const directory = 'output/';
  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      fs.unlinkSync(directory + file);
    });
  } else {
    fs.mkdirSync(directory);
  }
};

const generateUniqueFilename = (baseFilename: string): string => {
  let counter = 1;
  let filename = baseFilename;

  while (fs.existsSync(`output/${filename}`)) {
    filename = `${baseFilename.slice(0, -3)}-${counter}.md`;
    counter += 1;
  }

  return filename;
};
const processUrl = async (
  url: string,
  currentCount: number,
  total: number,
  spinner: Ora,
): Promise<void> => {
  spinner.text = `Processing URL ${currentCount}/${total}: ${url}`;

  try {
    const htmlContent = await fetchHtmlFromBrowserless(url);
    const markdownContent = convertHtmlToMarkdown(htmlContent);

    const baseFilename = `${new URL(url).hostname}.md`;
    const uniqueFilename = generateUniqueFilename(baseFilename);

    fs.writeFileSync(`output/${uniqueFilename}`, markdownContent);
  } catch (error) {
    spinner.fail(`Failed to process: ${url}`);
    if (error instanceof Error) {
      console.error(`Error details: ${error.message || 'Unknown error.'}`);
    }
  }
};

(async () => {
  if (!fs.existsSync(FILE_PATH)) {
    console.error(`The file '${FILE_PATH}' does not exist.`);
    return;
  }

  clearOutputDirectory();

  const urls = fs
    .readFileSync(FILE_PATH, 'utf-8')
    .split('\n')
    .map((url) => url.trim())
    .filter((url) => url && isValidUrl(url));

  const spinner = ora(`Starting processing URLs`).start();

  let currentCount = 0;
  for (const url of urls) {
    currentCount++;
    await processUrl(url, currentCount, urls.length, spinner);
  }

  spinner.succeed('All URLs processed.');
})();
