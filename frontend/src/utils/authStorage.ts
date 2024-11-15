import { AuthStorageEnum } from '../types/auth';

export const authStorage = {
  getAccess() {
    if (typeof window !== 'undefined') {
      return localStorage?.getItem(AuthStorageEnum.accessToken) || '';
    }

    return null;
  },
  setAccess(token: string) {
    localStorage.setItem(AuthStorageEnum.accessToken, token);
  },
  removeAccess: () => {
    localStorage.removeItem(AuthStorageEnum.accessToken);
  },
  removeTokens: () => {
    authStorage.removeAccess();
  },
};
