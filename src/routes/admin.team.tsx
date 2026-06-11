/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminTeam from '../components/admin/AdminTeam.tsx';

export const Route = createFileRoute('/admin/team')({
  component: AdminTeam,
});
