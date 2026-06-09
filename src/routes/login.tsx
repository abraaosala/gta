/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAuthenticated } from '../lib/auth.ts';
import Login from '../components/Login.tsx';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/admin' });
    }
  },
  component: Login,
});
