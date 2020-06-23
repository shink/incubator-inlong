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
    path: '/broker/:id',
    component: () => import('@/pages/Broker/brokerDetail'),
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
