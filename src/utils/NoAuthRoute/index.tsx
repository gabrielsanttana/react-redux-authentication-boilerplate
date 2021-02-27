import React from 'react';
import {connect} from 'react-redux';
import {RouteProps} from 'react-router';
import {Redirect, Route, RouteComponentProps} from 'react-router-dom';
import {PublicRoutes} from '../../routes';
import {ApplicationState} from '../../store/reducers/rootReducer';

interface StateProps {
  isAuthed?: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

interface OwnProps {
  location?: RouteProps['location'];
  requiredRoles?: any[];
  exact?: boolean;
}

const NoAuthRoute: React.FC<StateProps & OwnProps> = ({
  isAuthed,
  isAdmin,
  isStaff,
  location,
  requiredRoles,
  exact,
}) => {
  const userRole = isAdmin ? 'admin' : isStaff ? 'staff' : 'nonAdmin';
  const userHasRequiredRole = requiredRoles?.includes(userRole);
  const isUnauthorized = isAuthed && !userHasRequiredRole;
  const renderPageNotFound = isAuthed;

  return (
    <Route
      exact={exact}
      render={(props: RouteComponentProps) => {
        if (renderPageNotFound)
          return (
            <Redirect
              to={{
                pathname: PublicRoutes.notFound,
              }}
            />
          );

        if (isUnauthorized)
          return (
            <Redirect
              to={{
                pathname: PublicRoutes.unauthorized,
              }}
            />
          );

        if (!isAuthed)
          return (
            <Redirect
              to={{
                pathname: PublicRoutes.login,
                state: {
                  requestedPath: location?.pathname,
                },
              }}
            />
          );
      }}
    />
  );
};

export default connect((state: ApplicationState) => ({
  isAuthed: state.getIn(['authentication', 'data', 'is_authenticated']),
  isStaff: state.getIn(['authentication', 'data', 'user', 'is_staff']),
  isAdmin: state.getIn(['authentication', 'data', 'user', 'is_superuser']),
}))(NoAuthRoute);