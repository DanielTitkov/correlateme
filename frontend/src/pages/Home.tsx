import { useEffect, useState } from 'react'

import { Button } from "../components/ui/button"
import { H1, H2, H4 } from '../components/typography/typography'
import supabase from '../config/supabaseClient'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Terminal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { CalendarDateRangePicker } from '../components/ui/data-range-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Icons } from '../components/ui/icon'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatDateToDDMMYYYY } from '../lib/utils'


function Home() {
  const [fetchError, setFetchError] = useState("")
  const [metricsData, setMetricsData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("metrics")
        .select("*, observations(*)")

      if (error) {
        setFetchError('Failed to fetch metrics data')
        setMetricsData(null)
        console.log(error)
      }

      if (data) {
        setMetricsData(data)
        setFetchError("")
      }

      console.log(data, error)
    }

    fetchData()
  }, [])

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex items-center justify-between space-y-2">
          <H2>Dashboard</H2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">My</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Shared
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              System
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Archive
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
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

              {metricsData ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {metricsData.map(metric => {

                    const totalValue = metric.observations.reduce((acc, observation) => acc + observation.value, 0);
                    const average = totalValue / metric.observations.length;

                    const transformedData = metric.observations.map(observation => ({
                      timestamp: formatDateToDDMMYYYY(new Date(observation.timestamp)),
                      value: observation.value,
                      average: average,
                    }));

                    console.log(transformedData)

                    return (
                      <Card key={metric.id}>
                        <CardHeader>
                          <CardTitle>{metric.name}</CardTitle>
                          <CardDescription>{metric.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="my-3 h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={transformedData}
                                margin={{
                                  top: 5,
                                  right: 10,
                                  left: 10,
                                  bottom: 0,
                                }}
                              >
                                <Line
                                  type="monotone"
                                  strokeWidth={2}
                                  dataKey="average"
                                  activeDot={{
                                    r: 6,
                                    style: { fill: "#343cdc", opacity: 0.25 },
                                  }}
                                  style={
                                    {
                                      stroke: "#343cdc",
                                      opacity: 0.25,
                                    } as React.CSSProperties
                                  }
                                />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  strokeWidth={2}
                                  activeDot={{
                                    r: 8,
                                    style: { fill: "#343cdc" },
                                  }}
                                  style={
                                    {
                                      stroke: "#343cdc",
                                    } as React.CSSProperties
                                  }
                                />
                                <Tooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                          <H4>
                                            {payload[0].payload.timestamp}
                                          </H4>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Average
                                              </span>
                                              <span className="font-bold text-muted-foreground">
                                                {payload[0].value}
                                              </span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Current
                                              </span>
                                              <span className="font-bold">
                                                {payload[1].value}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }

                                    return null
                                  }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline">Edit</Button>
                          <Button>Correlate</Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center">
                  <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
                  <H4>Loading...</H4>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Home
