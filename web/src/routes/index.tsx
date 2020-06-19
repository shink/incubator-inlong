import { RouteProps } from '@/typings';

const routes: RouteProps[] = [
  {
    path: '/issue/:id',
    component: () => import('@/pages/Issue/consumeGroupDetail'),
  },
  {
    path: '/issue',
    component: () => import('@/pages/Issue'),
  },
  {
    path: '/broker',
    component: () => import('@/pages/Broker'),
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
