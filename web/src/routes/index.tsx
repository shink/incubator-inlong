import { RouteProps } from '@/typings';

const routes: RouteProps[] = [
  {
    path: '/issue',
    component: () => import('@/pages/Issue'),
    exact: true,
  },
  {
    path: '/hello',
    component: () => import('@/pages/Other/Hello'),
  },
  {
    path: '/user',
    component: () => import('@/pages/Other/User'),
  },
  {
    path: '/simple',
    component: () => import('@/pages/Other/Simple'),
  },
  {
    component: () => import('@/pages/NotFound'),
  },
];

export default routes;
