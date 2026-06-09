/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAuthenticated } from '../lib/auth.ts';
import AdminDashboard from '../components/AdminDashboard.tsx';

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: AdminDashboard,
});
