/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminFAQs from '../components/admin/AdminFAQs.tsx';

export const Route = createFileRoute('/admin/faqs')({
  component: AdminFAQs,
});
