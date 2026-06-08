/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {loginAPI, storeToken, clearToken, getStoredToken, logoutAPI} from './api.ts';

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await loginAPI(email, password);
    storeToken(result.accessToken);
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
  try {
    return isAuthenticated();
  } catch {
    clearToken();
    return false;
  }
}
