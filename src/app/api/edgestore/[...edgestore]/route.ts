import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { z } from 'zod';

/**
 * This is the main router for Edgestore.
 * It is used to define the different buckets and access control.
 */
const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  publicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 4, // 4MB
      accept: ['image/jpeg', 'image/png', 'image/webp'],
    })
    // .input( // Optional input validation
    //   z.object({
    //     type: z.enum(['profile', 'post']),
    //   }),
    // )
    // protect access to this bucket
    // .beforeUpload(({ ctx, input }) => {
    //   console.log('beforeUpload', ctx, input);
    //   //   ensure user is authenticated
    //   //   if (!ctx.userId) {
    //   //     return false;
    //   //   }
    //   return true; // allow upload
    // })
    /**
     * return `true` to allow delete
     * This function must be defined if you want to delete files directly from the client.
     */
    .beforeDelete(({ ctx, fileInfo }) => {
      console.log('beforeDelete', ctx, fileInfo);
      //   ensure user is authenticated and owns the file
      //   if (!ctx.userId || fileInfo.metadata?.userId !== ctx.userId) {
      //     return false;
      //   }
      return true; // allow delete
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  /**
   * Context used in `beforeUpload` and `beforeDelete`
   * {@link https://edgestore.dev/docs/quick-start#handle-session-and-context}
   */
  // createContext: async ({ req }) => {
  //   const session = await getSession({ req }); // replace with your auth provider
  //   return {
  //     userId: session?.user?.id,
  //   };
  // },
});

export { handler as GET, handler as POST };

/**
 * This type is used to protect the routes nextjs
 * and auto generate an EdgeStore client for the frontend page.lt
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
