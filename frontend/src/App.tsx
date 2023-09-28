import { useEffect, useState } from 'react'

import { Button } from "./components/ui/button"
import { H1, H2 } from './components/typography/typography'
import supabase from './config/supabaseClient.ts'
import Home from './pages/Home.tsx'

function App() {
  // console.log(import.meta.env)

  return (
    <>
      <Home />
    </>
  )
}

export default App
