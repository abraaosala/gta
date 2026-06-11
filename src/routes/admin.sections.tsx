/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminSections from '../components/admin/AdminSections.tsx';

export const Route = createFileRoute('/admin/sections')({
  component: AdminSections,
});
