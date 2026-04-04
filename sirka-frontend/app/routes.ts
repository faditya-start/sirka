import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("onboarding", "routes/onboarding.tsx"),
    route("food-log", "routes/food-log.tsx"),
    route("weight-progress", "routes/weight-progress.tsx"),
    route("profile", "routes/profile.tsx"),
    route("exercise", "routes/exercise.tsx"),
    route("sleep", "routes/sleep.tsx"),
    route("mood", "routes/mood.tsx"),
    route("history", "routes/history-summary.tsx"),
    route("gamification", "routes/gamification.tsx"),
] satisfies RouteConfig;