import { config } from 'dotenv';
config();

const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;

export const fetchHtmlFromBrowserless = async (
  url: string,
): Promise<string> => {
  const browserlessAPIEndpoint = 'https://chrome.browserless.io/content';
  const headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({ url });

  const browserlessResponse = await fetch(
    `${browserlessAPIEndpoint}?token=${BROWSERLESS_API_KEY}`,
    {
      method: 'POST',
      headers: headers,
      body: body,
    },
  );

  return browserlessResponse.text();
};
