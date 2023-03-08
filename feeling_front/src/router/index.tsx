import { Navigate, useRoutes, RouteObject } from 'react-router-dom'
import { lazy, LazyExoticComponent, Suspense } from 'react'
import { EPagePath } from '@/enums/page'
import HomeLayout from '@/layout/HomeLayout'
import LoginLayout from '@/layout/LoginLayout'
import CustomDotLoading from '@/components/CustomDotLoading'

const lazyElement = (Component: LazyExoticComponent<() => JSX.Element>) => {
  return (
    <Suspense fallback={<CustomDotLoading />}>
      <Component />
    </Suspense>
  )
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={EPagePath.HOME} replace={true} />
  },
  {
    element: <LoginLayout />,
    children: [
      {
        path: EPagePath.LOGIN,
        element: lazyElement(lazy(() => import('@/pages/Login')))
      },
      {
        path: EPagePath.REGISTER,
        element: lazyElement(lazy(() => import('@/pages/Register')))
      }
    ]
  },
  {
    element: <HomeLayout />,
    children: [
      {
        path: EPagePath.HOME,
        element: lazyElement(lazy(() => import('@/pages/Home')))
      },
      {
        path: EPagePath.SEARCH,
        element: lazyElement(lazy(() => import('@/pages/Search')))
      },
      {
        path: EPagePath.NOTIFY,
        element: lazyElement(lazy(() => import('@/pages/Notify')))
      },
      {
        path: EPagePath.MESSAGE,
        element: lazyElement(lazy(() => import('@/pages/Message')))
      },
      {
        path: EPagePath.PERSONAL_HOME,
        element: lazyElement(lazy(() => import('@/pages/PersonalHome')))
      },
      {
        path: EPagePath.PERSONAL_DATA,
        element: lazyElement(lazy(() => import('@/pages/PersonalData')))
      },
      {
        path: EPagePath.Follow,
        element: lazyElement(lazy(() => import('@/pages/Follow')))
      },
      {
        path: EPagePath.MESSAGE_DETAIL,
        element: lazyElement(lazy(() => import('@/pages/MsgDetail')))
      },
      {
        path: EPagePath.DETAIL,
        element: lazyElement(lazy(() => import('@/pages/Detail')))
      }
    ]
  },

  {
    path: '*',
    element: lazyElement(lazy(() => import('@/pages/404')))
  }
]

export default function Routes() {
  return useRoutes(routes)
}
