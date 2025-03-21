import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home/route.tsx'),
  route('/login', 'routes/authentication/login.tsx'),
  route('/signup', 'routes/authentication/signup.tsx'),
  route('/logout', 'routes/authentication/logout.tsx'),
  route('/workouts', 'routes/workouts/index.tsx'),
  route('/workouts/create', 'routes/workouts/create.tsx'),
  route('/workouts/:name', 'routes/workouts/[name]/index.tsx', [
    route('log-result', 'routes/workouts/log-result.tsx'),
  ]),
  route('/workouts/:name/edit', 'routes/workouts/[name]/edit.tsx'),
  route('/movements/:name', 'routes/movements/[name].tsx'),
] satisfies RouteConfig;
