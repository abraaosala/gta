/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFileRoute } from '@tanstack/react-router';
import App from '../App.tsx';

export const Route = createFileRoute('/')({
  component: App,
});
