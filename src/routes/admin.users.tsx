/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminUsers from '../components/admin/AdminUsers.tsx';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
});
