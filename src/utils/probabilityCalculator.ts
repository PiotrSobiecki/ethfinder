export interface ProbabilityEstimate {
  probability: number;
  expectedAttempts: number;
  estimatedTime: string;
  difficulty:
    | "Very Easy"
    | "Easy"
    | "Medium"
    | "Hard"
    | "Very Hard"
    | "Extremely Hard";
}

// Zalozona predkosc generowania. Realna zalezy od maszyny i przegladarki;
// ta liczba sluzy wylacznie do pokazania rzedu wielkosci przed startem.
const ASSUMED_ADDRESSES_PER_SECOND = 1500;

// Koszt trafienia w jeden znak wzorca.
//
// Adres to ciag hex, wiec sam znak trafia sie z szansa 1/16. Przy dopasowaniu
// wrazliwym na wielkosc liter dochodzi drugi warunek: suma kontrolna EIP-55
// musi wylosowac te sama wielkosc, czyli dodatkowe 1/2 - ale wylacznie dla
// liter a-f, bo cyfry nie maja wariantu wielkosci.
//
// Wczesniej bylo tu jedno 22 dla calego alfabetu (10 cyfr + a-f + A-F), co
// zawyzalo trudnosc wzorcow cyfrowych i zanizalo literowych.
function combinationsForChar(char: string, ignoreCase: boolean): number {
  if (ignoreCase) return 16;
  return /[0-9]/.test(char) ? 16 : 32;
}

export function calculateAddressProbability(
  prefix: string,
  suffix: string,
  count: number = 1,
  ignoreCase: boolean = false
): ProbabilityEstimate {
  const pattern = prefix + suffix;

  let combinations = 1;
  for (const char of pattern) {
    combinations *= combinationsForChar(char, ignoreCase);
  }

  // Liczba prob potrzebnych srednio na JEDEN pasujacy adres (rozklad
  // geometryczny: wartosc oczekiwana to 1/p).
  const expectedAttemptsPerAddress = combinations;
  const probability = 1 / combinations;

  const secondsPerAddress =
    expectedAttemptsPerAddress / ASSUMED_ADDRESSES_PER_SECOND;

  return {
    probability,
    expectedAttempts: expectedAttemptsPerAddress,
    estimatedTime: formatTime(secondsPerAddress * count),
    difficulty: getDifficulty(expectedAttemptsPerAddress),
  };
}

function formatTime(seconds: number): string {
  if (seconds < 1) {
    return "Instant";
  } else if (seconds < 60) {
    return `~${Math.round(seconds)} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `~${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (seconds < 86400) {
    const hours = Math.round(seconds / 3600);
    return `~${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (seconds < 2592000) {
    const days = Math.round(seconds / 86400);
    return `~${days} day${days > 1 ? "s" : ""}`;
  } else if (seconds < 31536000) {
    const months = Math.round(seconds / 2592000);
    return `~${months} month${months > 1 ? "s" : ""}`;
  } else {
    const years = Math.round(seconds / 31536000);
    return `~${years} year${years > 1 ? "s" : ""}`;
  }
}

// Progi odpowiadaja dawnym przedzialom dlugosci wzorca (16^n), ale licza sie
// teraz od faktycznej liczby prob - dzieki temu wzorzec case-sensitive jest
// poprawnie oceniany jako trudniejszy od tego samego bez wielkosci liter.
function getDifficulty(
  expectedAttempts: number
): ProbabilityEstimate["difficulty"] {
  if (expectedAttempts <= 256) {
    return "Very Easy";
  } else if (expectedAttempts <= 4096) {
    return "Easy";
  } else if (expectedAttempts <= 65536) {
    return "Medium";
  } else if (expectedAttempts <= 1048576) {
    return "Hard";
  } else if (expectedAttempts <= 16777216) {
    return "Very Hard";
  } else {
    return "Extremely Hard";
  }
}

export function getPatternExamples(prefix: string, suffix: string): string[] {
  const examples = [];

  if (prefix && suffix) {
    examples.push(`0x${prefix}...${suffix}`);
    examples.push(`0x${prefix}123abc...789${suffix}`);
  } else if (prefix) {
    examples.push(`0x${prefix}...`);
    examples.push(`0x${prefix}123abc789def...`);
  } else if (suffix) {
    examples.push(`0x...${suffix}`);
    examples.push(`0x123abc789def...${suffix}`);
  }

  return examples;
}
