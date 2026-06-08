/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import Login from '../components/Login.tsx';

export const Route = createFileRoute('/login')({
  component: Login,
});
