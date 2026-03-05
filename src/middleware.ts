import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";


const app = new Elysia()
  .use(openapi())


  .onRequest(({ request }) => {
    console.log("📥", request.method, request.url);
    console.log("🕒", new Date().toISOString());
  })


  .onRequest(({ request, set }) => {
    if (request.headers.get("x-block") === "true") {
      set.status = 403;
      return { message: "Blocked" };
    }
  })


  .get("/", () => "Hello Middleware")


  .get(
    "/dashboard",
    () => ({
      message: "Welcome to Dashboard",
    }),
    {
      beforeHandle({ headers, set }) {
        if (!headers.authorization) {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized",
          };
        }
      },
      response: t.Object({
        message: t.String(),
      }),
    }
  )


  .get(
    "/stats",
    () => {
      return {
        total: 100,
        active: 75,
      };
    },
    {
      response: t.Object({
        total: t.Number(),
        active: t.Number(),
      }),
    }
  )


  .listen(3000);


console.log("🦊 Server running at http://localhost:3000");