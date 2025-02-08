import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('home/route.tsx'),
  route('/login', 'authentication/login.tsx'),
  route('/signup', 'authentication/signup.tsx'),
  route('/logout', 'authentication/logout.tsx'),
  route('/workouts', 'workouts/index.tsx'),
  route('/workouts/create', 'workouts/create.tsx'),
  route('/workouts/:name', 'workouts/[name].tsx'),
  route('/movements/:name', 'routes/movements/[name].tsx'),
] satisfies RouteConfig;
