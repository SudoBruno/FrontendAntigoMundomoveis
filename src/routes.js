import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Logon from './pages/Logon';
import Coefficient from './pages/WmsRawMaterial/Register/RawMaterial/coefficient';
import SideBar from './components/sidebar/sidebar';
import { isAuthenticated, Expedition } from './services/auth';
import TagLayout from './components/TagLayout';
import Barcode from './pages/WmsRawMaterial/Operation/Storage/Barcode';
// import StokebA from './pages/WmsRawMaterial/Operation/Storage/Barcode';
import LaunchProduction from './pages/LaunchProduction';
import ExpeditionLaunch from './pages/Expedition/Launch';
import LaunchRawMaterial from './pages/Expedition/Launch';
import StockBarcode from './pages/WmsRawMaterial/Search/SearchStorage/Barcode';
import Mount from './pages/Planting/Mount';

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

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />
        <Route path="/coefficient" exact component={Coefficient} />
        <Route path="/pcp/:id" component={TagLayout} />
        <PrivateRoute path="/wmsrm/barcode/:id" component={Barcode} />
        <PrivateRoute path="/stock/barcode/:id" component={StockBarcode} />
        <PrivateRoute path="/launch-product" component={LaunchProduction} />
        <ExpeditionRoute
          path="/launch-expedition"
          component={ExpeditionLaunch}
        />

        <PrivateRoute>
          <SideBar />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}
