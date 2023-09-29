import { useEffect, useState } from 'react'

import { Button } from "./components/ui/button"
import { H1, H2, H3 } from './components/typography/typography'
import supabase from './config/supabaseClient.ts'
import Home from './pages/Home.tsx'
import DashboardPage from './pages/Dashboard.tsx'

function App() {
  // console.log(import.meta.env)

  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <H3>CorrelateMe</H3>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Home />
        </div>
      </div>
    </>
  )
}

export default App
