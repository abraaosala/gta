/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminContacts from '../components/admin/AdminContacts.tsx';

export const Route = createFileRoute('/admin/contacts')({
  component: AdminContacts,
});
