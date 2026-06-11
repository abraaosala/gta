/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminInfo from '../components/admin/AdminInfo.tsx';

export const Route = createFileRoute('/admin/info')({
  component: AdminInfo,
});
