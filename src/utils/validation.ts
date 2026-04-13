export const getValidationError = (input: HTMLInputElement | null): string => {
  if (!input) return "";

  const trimmedValue = input.value.trim();

  if (input.validity.valueMissing || trimmedValue.length === 0) {
    return "Пустое поле";
  }

  if (trimmedValue.length < 2) {
    return "Минимальное количество символов: 2";
  }

  // Валидация URL для аватара и карточек
  if (input.type === "url") {
    const urlPattern = /^https?:\/\/.+\..+/;
    if (!urlPattern.test(trimmedValue)) {
      return input.getAttribute("data-error-message") || "Неверный формат URL";
    }
  }

  if (!input.validity.valid) {
    return input.validationMessage || input.getAttribute("data-error-message") || "Неверный формат";
  }

  return "";
};