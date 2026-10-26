const seriousSituationSignals = [
  'depress', 'suicide', 'kill myself', 'die', 'hopeless', 'crying', 'breakdown',
  'panic attack', 'anxiety attack', 'hospital', 'emergency', 'doctor', 'funeral',
  'passed away', 'grief', 'medical', 'fail college', 'failing out', 'expelled',
  'abuse', 'trauma', 'self-harm',
];

export function isSeriousSituation(text?: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase();
  return seriousSituationSignals.some(signal => normalized.includes(signal));
}

