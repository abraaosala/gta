/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({ routeTree });
