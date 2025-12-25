import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("onboarding", "routes/onboarding.tsx"),
    route("food-log", "routes/food-log.tsx"),
    route("weight-progress", "routes/weight-progress.tsx"),
] satisfies RouteConfig;
