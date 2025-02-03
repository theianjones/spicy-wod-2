import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("home/route.tsx"),
	route("/login", "authentication/login.tsx"),
	route("/signup", "authentication/signup.tsx"),
	route("/workouts", "workouts/index.tsx"),
	route("/workouts/create", "workouts/create.tsx"),
] satisfies RouteConfig;