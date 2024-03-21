import { Router, Route, Switch } from "wouter-preact";
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { lazy, Suspense } from 'preact/compat';

import './app.css'
import Header from "@/components/header"

const Home = lazy(() => import('@/routes/home/index.tsx'))
export function App() {
  return (
    <>
      <Router hook={useHashLocation}>
        <Header></Header>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" component={Home}></Route>

          </Switch>
        </Suspense>
      </Router>
    </>
  )
}
