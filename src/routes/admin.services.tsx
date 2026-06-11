/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminServices from '../components/admin/AdminServices.tsx';

export const Route = createFileRoute('/admin/services')({
  component: AdminServices,
});
