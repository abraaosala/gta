/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminProcess from '../components/admin/AdminProcess.tsx';

export const Route = createFileRoute('/admin/process')({
  component: AdminProcess,
});
