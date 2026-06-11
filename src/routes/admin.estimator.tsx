/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import AdminEstimator from '../components/admin/AdminEstimator.tsx';

export const Route = createFileRoute('/admin/estimator')({
  component: AdminEstimator,
});
