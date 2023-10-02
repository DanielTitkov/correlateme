import { H1, H2, H3 } from './components/typography/typography'
import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard.tsx'

import Home from './pages/Home.tsx'
import NoMatch from './pages/NoMatch.tsx';
import Layout from './pages/Layout.tsx';

function App() {
  // console.log(import.meta.env)

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="about" element={<About />} /> */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  )
}



export default App
