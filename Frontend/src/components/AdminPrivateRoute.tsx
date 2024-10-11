import { ComponentType, ReactElement } from 'react';
import { Navigate, useLoaderData, useMatch } from 'react-router';
import userProps from '../types/userProps';

export default function AdminPrivateRoute({
  Component,
}: {
  Component: ComponentType;
}): ReactElement {
  const user = useLoaderData() as userProps;
  const match = useMatch('/admin/chapter');
  if (Object.keys(user ?? {}).length > 0) {
    if (
      user.authorization === 'admin' ||
      (match && user.authorization === 'reviewer')
    ) {
      return <Component />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  } else {
    console.log('here');
    return <Navigate to="/" />;
  }
}
