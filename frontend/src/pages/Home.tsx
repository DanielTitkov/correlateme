import { useEffect, useState } from 'react'

import { Button } from "../components/ui/button"
import { H1, H2, H4 } from '../components/typography/typography'
import supabase from '../config/supabaseClient'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { AlertCircle, Terminal } from 'lucide-react'
import { CalendarDateRangePicker } from '../components/ui/data-range-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Icons } from '../components/ui/icon'
import MetricCard from '../components/ui/metric-card'
import { Metric, Observation } from '../types/supabase'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select'



function Home() {
  // temporary // FIXME
  const userId = "7d37704a-489d-447f-a623-4433e22bfb55"

  // metrics
  const [fetchError, setFetchError] = useState("")
  const [metricsData, setMetricsData] = useState<(Metric & { observations: Observation[] })[] | null>(null)

  // create new metric form 
  const [newMetricName, setNewMetricName] = useState("")
  const [newMetricDesc, setNewMetricDesc] = useState("")
  const [newMetricKind, setNewMetricKind] = useState("")
  const [newMetricError, setNewMetricError] = useState("")

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

    console.log(data, error) // FIXME
  }


  const handleMetricSubmit = async () => {

    if (!newMetricName || !newMetricKind) {
      setNewMetricError("Please fill required field")
      return
    }

    console.log(newMetricName, newMetricDesc, newMetricKind, newMetricError) // FIXME

    const { data, error } = await supabase
      .from("metrics")
      .insert([{
        user_id: userId,
        name: newMetricName,
        desc: newMetricDesc,
        kind: newMetricKind,
      }])
      .select()

    if (error) {
      setNewMetricError(`Error occurred: ${error.message}. Code: ${error.code}.`)
      console.log(error.message, error.code)
    }

    if (data) {
      console.log(data)
      setNewMetricName("")
      setNewMetricDesc("")
      setNewMetricKind("")
      setNewMetricError("")
      fetchData() // updated date from db
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div className="flex-col md:flex">
        {newMetricError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to create metric</AlertTitle>
            <AlertDescription>
              {newMetricError}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center justify-between space-y-2">
          <H2>Dashboard</H2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Sheet>
              <SheetTrigger asChild>
                <Button>New Metric</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add new metric</SheetTitle>
                  <SheetDescription>
                    Create new metric, click "Save" when you are done.
                  </SheetDescription>
                </SheetHeader>
                {/* form start */}
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input id="name" placeholder="Name" required className="col-span-4" value={newMetricName} onChange={(e) => setNewMetricName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input id="desc" placeholder="Description" className="col-span-4" value={newMetricDesc} onChange={(e) => setNewMetricDesc(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Select name="kind" required value={newMetricKind} onValueChange={(v) => setNewMetricKind(v)}>
                      <SelectTrigger className="col-span-4">
                        <SelectValue placeholder="Select metric type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Metric types</SelectLabel>
                          <SelectItem value="numeric">Numeric</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* form end */}
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit" onClick={() => handleMetricSubmit()}>Save</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">My</TabsTrigger>
            <TabsTrigger value="shared" disabled>
              Shared
            </TabsTrigger>
            <TabsTrigger value="system" disabled>
              System
            </TabsTrigger>
            <TabsTrigger value="archive" disabled>
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
                  {metricsData.map(metric => (
                    <MetricCard key={metric.id} metric={metric} />
                  ))}
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
