export function isValidHexString(str: string): boolean {
  // Sprawdza czy string zawiera tylko dozwolone znaki hex: 0-9, a-f, A-F
  const hexRegex = /^[0-9a-fA-F]*$/;
  return hexRegex.test(str);
}

export function getInvalidHexChars(str: string): string[] {
  // Zwraca listę nieprawidłowych znaków
  const invalidChars: string[] = [];
  const hexRegex = /^[0-9a-fA-F]$/;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (!hexRegex.test(char) && !invalidChars.includes(char)) {
      invalidChars.push(char);
    }
  }

  return invalidChars;
}

export function validateHexInput(
  value: string,
  fieldName: string
): string | null {
  if (!value) return null; // Empty is OK

  if (!isValidHexString(value)) {
    const invalidChars = getInvalidHexChars(value);
    return `${fieldName} contains invalid characters: ${invalidChars.join(
      ", "
    )}. Only 0-9, a-f, A-F are allowed.`;
  }

  return null; // Valid
}
