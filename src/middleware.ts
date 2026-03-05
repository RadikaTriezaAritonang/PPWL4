import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";


const app = new Elysia()
  .get("/admin", () => ({ stats: 99 }), {
    beforeHandle({ headers, set }) {
      if (headers.authorization !== "Bearer 123") {
        set.status = 401;
        return { success: false, message: "Unauthorized" };
      }
    }
  })

  .post("/login", ({ body }) => ({ message: "Success", data: body }), {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 })
    })
  })

  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        error: "Validation Error",
        detail: error.message
      };
    }
    
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { message: "Route not found" };
    }
  })
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

app.post(
 "/register",
 ({ body }) => body,
 {
   body: t.Object({
     name: t.String({ minLength: 3 }),
     email: t.String({ format: "email" })
   })
 }
)


app.onError(({ code, error, set }) => {


 if (code === "VALIDATION") {
   set.status = 400
   return {
     success: false,
     message: "Validation Error",
     detail: error.message
   };
 }

 if (code === "NOT_FOUND") {
   set.status = 404
   return {
     message: "Route not found"
   }
 }


 set.status = 500
 return {
   message: "Internal Server Error"
 }
})

  .listen(3000);


console.log("🦊 Server running at http://localhost:3000");