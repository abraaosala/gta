/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminGallery from '../components/admin/AdminGallery.tsx';

export const Route = createFileRoute('/admin/gallery')({
  component: AdminGallery,
});
