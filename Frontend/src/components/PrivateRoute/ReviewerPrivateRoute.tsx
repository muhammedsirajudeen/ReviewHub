import { ComponentType, ReactElement } from 'react';
import { Navigate, useLoaderData, useMatch } from 'react-router';
import userProps from '../../types/userProps';
export default function ReviewerPrivateRoute({
  Component,
}: {
  Component: ComponentType;
}): ReactElement {
  const user = useLoaderData() as userProps;
  const match = useMatch('/reviewer/approval');
  console.log(match);
  if (user) {
    if (user.authorization === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.authorization === 'reviewer') {
      return <Component />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  } else {
    return <Navigate to="/" />;
  }
}
