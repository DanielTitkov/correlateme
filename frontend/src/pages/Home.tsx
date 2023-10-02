import { useEffect, useRef, useState } from 'react'

import { Button } from "../components/ui/button"
import { H1, H2, H3, H4 } from '../components/typography/typography'
import supabase from '../config/supabaseClient'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { AlertCircle, Terminal } from 'lucide-react'
import { Icons } from '../components/ui/icon'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select'
import { DatePicker } from '../components/ui/date-picker'
import { endOfDay, startOfDay } from 'date-fns'
import { Metric, Observation } from '../types/composite'
import _ from 'lodash';


function Home() {
  // temporary // FIXME
  const userId = "7d37704a-489d-447f-a623-4433e22bfb55"

  // metrics
  const [fetchError, setFetchError] = useState("")
  const [metricsData, setMetricsData] = useState<Metric[] | null>(null)

  // create new metric form 
  const [newMetricName, setNewMetricName] = useState("")
  const [newMetricDesc, setNewMetricDesc] = useState("")
  const [newMetricKind, setNewMetricKind] = useState("")
  const [newMetricError, setNewMetricError] = useState("")

  // date picker
  const [date, setDate] = useState<Date | null>(new Date());

  // editing observations
  const debouncedSavesRef = useRef<{ [key: string]: _.DebouncedFunc<(obs: Observation) => void> }>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});


  const fetchMetricsData = async () => {
    const { data, error } = await supabase
      .from("metrics")
      .select(`*, observations(*)`)
      .eq("user_id", userId)
      .gte("observations.timestamp", startOfDay(date).toISOString())
      .lte('observations.timestamp', endOfDay(date).toISOString())

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
    initializeDebouncedSaves(data)
    console.log(debouncedSavesRef)
  }

  const initializeDebouncedSaves = (metrics: Metric[]) => {
    metrics.forEach(metric => {
      if (!debouncedSavesRef.current[metric.id]) {
        debouncedSavesRef.current[metric.id] = _.debounce(saveObservation, 1000);
      }
    });
  };

  const saveObservation = async function (observation: Observation) {
    setSaving(prev => ({ ...prev, [observation.metric_id]: true }));
    console.log("SAVING!", observation) // FIXME
    if (!observation.id) {
      const { data, error } = await supabase
        .from("observations")
        .insert([observation])
        .select()

      if (error) {
        setNewMetricError(`Error occurred: ${error.message}. Code: ${error.code}.`)
      }

      if (data) {
        console.log("INSERTED")
        setNewMetricError("")
      }
    } else {
      const { data, error } = await supabase
        .from("observations")
        .update([observation])
        .eq('id', observation.id)
        .select()

      if (error) {
        setNewMetricError(`Error occurred: ${error.message}. Code: ${error.code}.`)
      }

      if (data) {
        console.log("UPDATED")
        setNewMetricError("")
      }
    }

    fetchMetricsData()
    setSaving(prev => ({ ...prev, [observation.metric_id]: false }));
  };

  const handleObservationChange = async (metric: Metric, newValue: string) => {
    let observation = metric.observations?.[0];

    if (!observation) {
      observation = {
        metric_id: metric.id,
        timestamp: date?.toISOString(),
        user_id: metric.user_id,
        value: parseFloat(newValue),
      };

      metric.observations = [observation];
    } else {
      observation.value = parseFloat(newValue);
    }

    const updatedMetrics = metricsData ? metricsData.map(m => {
      if (m.id === metric.id) {
        return { ...m, observations: [observation] };
      }
      return m;
    }) : null;

    setMetricsData(updatedMetrics);

    debouncedSavesRef.current[observation.metric_id](observation);
  };

  useEffect(() => {
    fetchMetricsData()
  }, [])

  useEffect(() => {
    setMetricsData(null)
    fetchMetricsData()
  }, [date])

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
          <H2>Today: {date?.toISOString().substring(0, 10)}</H2>
          <div className="flex items-center space-x-2">
            <DatePicker date={date} setDate={setDate} />
            <Button>Quick record</Button>

          </div>
        </div>
        <div className="space-y-4 mt-4">


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
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {metricsData.map(metric => (

                  <div key={metric.id}>
                    <Label htmlFor={metric.id}>
                      {metric.name}
                    </Label>
                    <Input
                      type='number'
                      id={metric.id}
                      onChange={(e) => handleObservationChange(metric, e.target.value)}
                      value={metric.observations?.[0]?.value ?? ""}
                      disabled={saving[metric.id] ?? false}
                    />
                  </div>

                ))}
              </div>
            ) : (
              <div className="flex items-center">
                <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
                <H4>Loading...</H4>
              </div>
            )}
          </div>

        </div>
      </div >
    </>
  )
}

export default Home
