import argon2 from 'argon2';

export async function hashPassword(password) {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    throw new Error('Помилка при хешуванні паролю');
  }
}

export async function verifyPassword(hashedPassword, userProvidedPassword) {
    try {
      // Порівнюємо хеш паролю з наданим користувачем паролем
      const passwordMatch = await argon2.verify(hashedPassword, userProvidedPassword);
      return passwordMatch;
    } catch (error) {
      throw new Error('Помилка при перевірці паролю');
    }
  }