// Purpose: Defines the client-side Edgestore hook.
// This replaces the direct import of `useEdgeStore` from `@edgestore/react`
// to ensure it's typed with our specific router.

'use client';

import { type EdgeStoreRouter } from '../app/api/edgestore/[...edgestore]/route';
import { createEdgeStoreProvider } from '@edgestore/react';

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>();

export { EdgeStoreProvider, useEdgeStore };
