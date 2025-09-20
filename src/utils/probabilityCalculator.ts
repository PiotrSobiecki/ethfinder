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

export function calculateAddressProbability(
  prefix: string,
  suffix: string,
  count: number = 1,
  ignoreCase: boolean = false
): ProbabilityEstimate {
  // Choose character set based on case sensitivity setting
  const hexChars = ignoreCase
    ? 16 // Case-insensitive: 0-9, a-f (treating A-F same as a-f)
    : 22; // Case-sensitive: 0-9, a-f, A-F (all distinct)

  // Calculate total pattern length
  const totalPatternLength = prefix.length + suffix.length;

  // Probability calculation: 1 / (hexChars^patternLength)
  const probability = 1 / Math.pow(hexChars, totalPatternLength);

  // Expected attempts for finding ONE address = 1 / probability
  const expectedAttemptsPerAddress = Math.round(1 / probability);

  // For multiple addresses, we need to find them sequentially
  // Each address takes on average the same time to find
  const totalExpectedAttempts = expectedAttemptsPerAddress * count;

  // Estimate time based on ~1500 addresses/second average speed
  const addressesPerSecond = 1500;
  const estimatedSeconds = totalExpectedAttempts / addressesPerSecond;

  // Format time
  const estimatedTime = formatTime(estimatedSeconds);

  // Determine difficulty
  const difficulty = getDifficulty(totalPatternLength);

  return {
    probability,
    expectedAttempts: totalExpectedAttempts,
    estimatedTime,
    difficulty,
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

function getDifficulty(
  patternLength: number
): ProbabilityEstimate["difficulty"] {
  if (patternLength <= 2) {
    return "Very Easy";
  } else if (patternLength <= 3) {
    return "Easy";
  } else if (patternLength <= 4) {
    return "Medium";
  } else if (patternLength <= 5) {
    return "Hard";
  } else if (patternLength <= 6) {
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
