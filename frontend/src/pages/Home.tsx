import { useEffect, useState } from 'react'

import { Button } from "../components/ui/button"
import { H1, H2 } from '../components/typography/typography'
import supabase from '../config/supabaseClient'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Terminal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'

function Home() {
  const [fetchError, setFetchError] = useState("")
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("metrics")
        .select()

      if (error) {
        setFetchError('Failed to fetch metrics data')
        setData(null)
        console.log(error)
      }

      if (data) {
        setData(data)
        setFetchError("")
      }

      console.log(data, error)
    }

    fetchData()
  }, [])

  return (
    <>
      <H1>Correlate Me</H1>
      <H2>Dashboard of personal stuff</H2>
      <div>
        {fetchError && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              {fetchError}
            </AlertDescription>
          </Alert>
        )}

        {data && (
          <div>
            {data.map(metric => (
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>{metric.name}</CardTitle>
                  <CardDescription>{metric.id}</CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Deploy</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Home
