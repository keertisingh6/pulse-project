type ApiRequest = { method?: string };
type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Use GET to check Kairo status.' });
  }

  return response.status(200).json({
    status: 'online',
    activeProvider: 'Google Gemini',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}

