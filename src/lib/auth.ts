/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {loginAPI, storeToken, storeRefreshToken, clearToken, getStoredToken, logoutAPI, refreshTokenAPI} from './api.ts';

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await loginAPI(email, password);
    storeToken(result.accessToken);
    storeRefreshToken(result.refreshToken);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Credenciais inválidas' };
  }
}

export async function logout(): Promise<void> {
  await logoutAPI();
}

export function isAuthenticated(): boolean {
  return getStoredToken() !== null;
}

export async function refreshAuth(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    await refreshTokenAPI();
    return true;
  } catch {
    clearToken();
    return false;
  }
}
