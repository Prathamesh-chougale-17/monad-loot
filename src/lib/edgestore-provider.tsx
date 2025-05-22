'use client';

import { EdgeStoreProvider as Provider } from '@edgestore/react';
import type React from 'react';

export function EdgeStoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
