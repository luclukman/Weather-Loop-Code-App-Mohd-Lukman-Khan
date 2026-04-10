import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Thermometer, Wind, CloudRain, Sun, Snowflake, Info, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ClimateResult {
  id: string;
  type: "AQI" | "TEMP" | "CYCLE";
  title: string;
  message: string;
  variant: "default" | "warning" | "success" | "info";
  icon: React.ReactNode;
}

export default function App() {
  const [temp, setTemp] = useState<string>("");
  const [results, setResults] = useState<ClimateResult[]>([]);
  const [region, setRegion] = useState<"icy" | "non-icy" | "none">("none");

  const runLogic = () => {
    const n = parseFloat(temp);
    if (isNaN(n)) return;

    const newResults: ClimateResult[] = [];
    let currentRegion: "icy" | "non-icy" | "none" = "none";

    // --- AQI CHECK ---
    if (n >= -40 && n <= 32) {
      newResults.push({
        id: "aqi-1",
        type: "AQI",
        title: "AQI CHECK",
        message: "Air Quality Index in icy and non-icy areas lies between 0-100. You can add rainfall in every season according to your choice.",
        variant: "success",
        icon: <Wind className="w-4 h-4" />,
      });
    } else if (n > 32) {
      newResults.push({
        id: "aqi-2",
        type: "AQI",
        title: "AQI CHECK",
        message: "Hence rainfall for 1/2 hour in non-icy areas so that temperature is reduced again and follows the same cycle after temperature falls back.",
        variant: "warning",
        icon: <CloudRain className="w-4 h-4" />,
      });
      newResults.push({
        id: "aqi-3",
        type: "AQI",
        title: "AQI STATUS",
        message: "Air Quality Index is slightly shifted, then again lies between after rainfall condition.",
        variant: "info",
        icon: <Info className="w-4 h-4" />,
      });
    } else if (n < -40) {
      newResults.push({
        id: "aqi-4",
        type: "AQI",
        title: "AQI CHECK",
        message: "Heat generation active until temperature is within the code.",
        variant: "warning",
        icon: <RefreshCw className="w-4 h-4" />,
      });
      newResults.push({
        id: "aqi-5",
        type: "AQI",
        title: "AQI STATUS",
        message: "Air Quality Index is slightly shifted, then again lies between after heat generation condition.",
        variant: "info",
        icon: <Info className="w-4 h-4" />,
      });
    }

    // --- TEMPERATURE CHECK ---
    
    // Non-icy areas between 15 <= n <= 32
    if (n >= 15 && n <= 32) {
      currentRegion = "non-icy";
      newResults.push({
        id: "temp-1",
        type: "TEMP",
        title: "TEMP CHECK",
        message: "Valid region: non-icy areas, condition autumn and spring season lies between summer and winter.",
        variant: "default",
        icon: <Sun className="w-4 h-4" />,
      });
      if (n > 20) {
        newResults.push({
          id: "temp-2",
          type: "TEMP",
          title: "SEASON",
          message: "Summer in non-icy areas. After 32°C it follows a reverse cycle in decreasing order in non-icy areas.",
          variant: "default",
          icon: <Sun className="w-4 h-4 text-orange-500" />,
        });
      } else {
        newResults.push({
          id: "temp-3",
          type: "TEMP",
          title: "SEASON",
          message: "Winter temperature in non-icy areas. Below 15°C it follows a reverse cycle in increasing order in non-icy areas.",
          variant: "default",
          icon: <Snowflake className="w-4 h-4 text-blue-500" />,
        });
        newResults.push({
          id: "temp-4",
          type: "TEMP",
          title: "ACTION",
          message: "Heat generation happens in non-icy areas after temperature reduces below 15°C.",
          variant: "info",
          icon: <RefreshCw className="w-4 h-4" />,
        });
      }
    } else if (n > 32) {
      newResults.push({
        id: "temp-5",
        type: "TEMP",
        title: "TEMP CHECK",
        message: "Not valid for both icy and non-icy areas.",
        variant: "warning",
        icon: <AlertTriangle className="w-4 h-4" />,
      });
    } else if (n < -40) {
      newResults.push({
        id: "temp-6",
        type: "TEMP",
        title: "TEMP CHECK",
        message: "Not valid for both icy and non-icy region.",
        variant: "warning",
        icon: <AlertTriangle className="w-4 h-4" />,
      });
    }

    // Icy region lies between -40 <= n < 15
    if (n >= -40 && n < 15) {
      currentRegion = "icy";
      newResults.push({
        id: "temp-7",
        type: "TEMP",
        title: "TEMP CHECK",
        message: "Valid region: icy areas, condition autumn and spring season lies between summer and winter.",
        variant: "default",
        icon: <Snowflake className="w-4 h-4" />,
      });
      if (n > 0) {
        newResults.push({
          id: "temp-8",
          type: "TEMP",
          title: "SEASON",
          message: "Summer in icy areas. After 15°C it follows a reverse cycle in decreasing order in icy areas.",
          variant: "default",
          icon: <Sun className="w-4 h-4 text-orange-400" />,
        });
        newResults.push({
          id: "temp-9",
          type: "TEMP",
          title: "ACTION",
          message: "Rainfall happens in icy areas 1/2 hour after 15°C so that the temperature is reduced and again follows back original condition.",
          variant: "info",
          icon: <CloudRain className="w-4 h-4" />,
        });
      } else {
        newResults.push({
          id: "temp-10",
          type: "TEMP",
          title: "SEASON",
          message: "Winter season in icy areas. Below -40°C it follows a reverse cycle in increasing order in icy areas.",
          variant: "default",
          icon: <Snowflake className="w-4 h-4 text-blue-600" />,
        });
        newResults.push({
          id: "temp-11",
          type: "TEMP",
          title: "ACTION",
          message: "Heat generation happens in icy areas after temperature goes below -40°C.",
          variant: "info",
          icon: <RefreshCw className="w-4 h-4" />,
        });
      }
    }

    newResults.push({
      id: "cycle-end",
      type: "CYCLE",
      title: "CYCLE STATUS",
      message: "Cycle completed. Repeats every one year. Starting again...",
      variant: "success",
      icon: <RefreshCw className="w-4 h-4" />,
    });

    setResults(newResults);
    setRegion(currentRegion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      runLogic();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className={cn(
              "h-2 w-full transition-colors duration-500",
              region === "icy" ? "bg-blue-400" : region === "non-icy" ? "bg-orange-400" : "bg-neutral-200"
            )} />
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold tracking-tight text-neutral-900">
                  Climate Cycle Simulator
                </CardTitle>
                {region !== "none" && (
                  <Badge variant={region === "icy" ? "secondary" : "default"} className={cn(
                    "capitalize px-3 py-1",
                    region === "icy" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                  )}>
                    {region} Region
                  </Badge>
                )}
              </div>
              <CardDescription className="text-neutral-500">
                Enter the temperature in Celsius to simulate environmental conditions and AQI status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="temp" className="text-sm font-medium text-neutral-700">
                  Temperature (°C)
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="temp"
                      type="number"
                      placeholder="e.g., 25"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 text-lg border-neutral-200 focus:ring-neutral-900"
                    />
                  </div>
                  <Button 
                    onClick={runLogic}
                    className="h-12 px-8 bg-neutral-900 hover:bg-neutral-800 text-white transition-all active:scale-95"
                  >
                    Check Status
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                    Simulation Results
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono opacity-50">
                    {results.length} STAGES
                  </Badge>
                </div>

                <ScrollArea className="h-[400px] rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {results.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center h-[300px] text-neutral-400 space-y-2"
                        >
                          <Info className="w-8 h-8 opacity-20" />
                          <p className="text-sm italic">Results will appear here after check...</p>
                        </motion.div>
                      ) : (
                        results.map((result, index) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              "p-4 rounded-lg border flex gap-4 items-start transition-all",
                              result.variant === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-900" :
                              result.variant === "warning" ? "bg-amber-50 border-amber-100 text-amber-900" :
                              result.variant === "info" ? "bg-sky-50 border-sky-100 text-sky-900" :
                              "bg-white border-neutral-200 text-neutral-900 shadow-sm"
                            )}
                          >
                            <div className={cn(
                              "p-2 rounded-full shrink-0",
                              result.variant === "success" ? "bg-emerald-100" :
                              result.variant === "warning" ? "bg-amber-100" :
                              result.variant === "info" ? "bg-sky-100" :
                              "bg-neutral-100"
                            )}>
                              {result.icon}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                                  {result.type}
                                </span>
                                <h4 className="text-sm font-bold">{result.title}</h4>
                              </div>
                              <p className="text-sm leading-relaxed opacity-90">
                                {result.message}
                              </p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <footer className="text-center text-xs text-neutral-400 font-medium uppercase tracking-[0.2em]">
          Climate Cycle Simulator &copy; 2026
        </footer>
      </div>
    </div>
  );
}
