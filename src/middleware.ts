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

  .get(
  "/admin",
  () => {
    return { stats: 99 };
  },
  {
    beforeHandle({ headers, set }) {
      const auth = headers.authorization;
      if (auth !== "Bearer 123") {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized"
        };
      }
    }
  }
)

app.onAfterHandle(({ response }) => {
    return {
      success: true,
      Message: "data tersedia",
      data: response
    };
  })
  .get("/product", () => {
    return { id: 1, name: "Laptop" };
  })

app.get("/profile", () => ({
 name: "Nama kamu"
}))

  .listen(3000);


console.log("🦊 Server running at http://localhost:3000");