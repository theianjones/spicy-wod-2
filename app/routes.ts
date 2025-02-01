import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("home/route.tsx"),
	route("/login", "authentication/login.tsx"),
	route("/signup", "authentication/signup.tsx")
] satisfies RouteConfig;