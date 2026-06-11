/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminBrands from '../components/admin/AdminBrands.tsx';

export const Route = createFileRoute('/admin/brands')({
  component: AdminBrands,
});
