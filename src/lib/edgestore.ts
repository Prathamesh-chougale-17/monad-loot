// This file is used to define the EdgeStore router type for client-side usage.
// It should not be imported directly in your components.
// Instead, use the `useEdgeStore` hook from `@edgestore/react`.
import type { EdgeStoreRouter } from '../app/api/edgestore/[...edgestore]/route';

// Export the router type to be used in `useEdgeStore`
export type { EdgeStoreRouter };
