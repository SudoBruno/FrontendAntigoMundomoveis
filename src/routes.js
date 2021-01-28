import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Logon from './pages/Logon';
import Coefficient from './pages/WmsRawMaterial/Register/RawMaterial/coefficient';
import SideBar from './components/sidebar/sidebar';
import { isAuthenticated, Expedition, Cover } from './services/auth';
import TagLayout from './components/TagLayout';
import MountTagLayout from './components/MountTagLayout';
import Barcode from './pages/WmsRawMaterial/Operation/Storage/Barcode';
// import StokebA from './pages/WmsRawMaterial/Operation/Storage/Barcode';
import LaunchProduction from './pages/LaunchProduction';
import ExpeditionLaunch from './pages/Expedition/Launch';
import StockBarcode from './pages/WmsRawMaterial/Search/SearchStorage/Barcode';
import CoverLaunch from './pages/Cover/Launch';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
    }
  />
);

const ExpeditionRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Expedition() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
    }
  />
);

const CoverRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Cover() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
    }
  />
);

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />
        <Route path="/coefficient" exact component={Coefficient} />
        <PrivateRoute path="/pcp/:id" component={TagLayout} />
        <PrivateRoute path="/wmsrm/barcode/:id" component={Barcode} />
        <PrivateRoute path="/stock/barcode/:id" component={StockBarcode} />
        <PrivateRoute path="/launch-product" component={LaunchProduction} />
        <PrivateRoute
          path="/mount/tag/:barCode/sector/:sectorId"
          component={MountTagLayout}
        />
        <PrivateRoute path="/mount/tag/:mountId" component={MountTagLayout} />
        <ExpeditionRoute
          path="/launch-expedition"
          component={ExpeditionLaunch}
        />
        <CoverRoute path="/cover/launch" component={CoverLaunch} />

        <PrivateRoute>
          <SideBar />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}
