/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminTestimonials from '../components/admin/AdminTestimonials.tsx';

export const Route = createFileRoute('/admin/testimonials')({
  component: AdminTestimonials,
});
