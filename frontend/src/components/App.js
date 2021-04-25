import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Admin } from "../pages/Admin";
import { Form } from "../pages/Form";
import { Home } from '../pages/Home';
import { Header } from "./Header";

export const App = () => {
  
  return (
    <Router>
      <Header/>
      <Switch>
        <Route path="/form">
          <Form/>
        </Route>
        <Route path="/admin">
          <Admin/>
        </Route>
        <Route path="*">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}