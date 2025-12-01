
// import NextAuth from "next-auth";
// import { authConfig } from "~/server/auth";

// const handler = NextAuth(authConfig);

// export { handler as GET, handler as POST };

import { handlers } from "~/server/auth";

export const { GET, POST } = handlers;
