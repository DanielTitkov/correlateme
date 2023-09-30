import React from 'react';
import { Metric, Observation } from '../../types/supabase';
import { formatDateToDDMMYYYY } from '../../lib/utils';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { H4 } from '../typography/typography';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

interface MetricCardProps {
    metric: Metric & {
      observations: Observation[];
    };
  }

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const totalValue = metric.observations.reduce((acc, observation) => acc + observation.value, 0);
  const average = totalValue / metric.observations.length;

  const transformedData = metric.observations.map(observation => ({
    timestamp: formatDateToDDMMYYYY(new Date(observation.timestamp)),
    value: observation.value,
    average: average,
  }));

  console.log(transformedData) // FIXME

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
                style={{
                  stroke: "#343cdc",
                  opacity: 0.25,
                } as React.CSSProperties}
              />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  style: { fill: "#343cdc" },
                }}
                style={{
                  stroke: "#343cdc",
                } as React.CSSProperties}
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

                  return null;
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
  );
};

export default MetricCard;
