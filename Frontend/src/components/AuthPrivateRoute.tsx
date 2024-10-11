import { ComponentType, ReactElement } from 'react';
import { Navigate, useLoaderData } from 'react-router';
import userProps from '../types/userProps';

export default function AuthPrivateRoute({
  Component,
}: {
  Component: ComponentType;
}): ReactElement {
  const user = useLoaderData() as userProps;
  if (Object.keys(user ?? {}).length != 0) {
    if (user.authorization === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  } else {
    return <Component />;
  }
}
