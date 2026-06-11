/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminProducts from '../components/admin/AdminProducts.tsx';

export const Route = createFileRoute('/admin/products')({
  component: AdminProducts,
});
