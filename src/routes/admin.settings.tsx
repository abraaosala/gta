/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminSettings from '../components/admin/AdminSettings.tsx';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
});
