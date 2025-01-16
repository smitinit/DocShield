import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription } from "@/components/ui/card";
import { Input } from "./components/ui/input";
import { Skeleton } from "./components/ui/skeleton";

import { useCallback, useEffect, useMemo, useState } from "react";

import FT from "./FraudTableComp";

// Types
interface Insight {
  value: string;
}

export interface FraudData {
  id: number;
  signal: string;
  status: string;
}

// ------------------------------ Initiate -> App ------------------------------

function App() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [fraudData, setFraudData] = useState<FraudData[]>([]);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(true);
  const [loadingFraudData, setLoadingFraudData] = useState<boolean>(true);
  const loadingTime = 0;

  const fetchInsights = useCallback(() => {
    if (insights.length > 0) return;
    setLoadingInsights(true);
    fetch("api/insights")
      .then((res) => res.json())
      .then((data: Insight[]) => {
        if (data) {
          setTimeout(() => {
            setInsights(data);
            setLoadingInsights(false);
          }, loadingTime);
        }
      });
  }, [insights]);

  const fetchFraudTableData = useCallback(() => {
    if (fraudData.length > 0) return;
    setLoadingFraudData(true);
    fetch("api/fraud-data")
      .then((res) => res.json())
      .then((data: FraudData[]) => {
        if (data) {
          setTimeout(() => {
            setFraudData(data);
            setLoadingFraudData(false);
          }, loadingTime);
        }
      });
  }, [fraudData]);

  useEffect(() => {
    fetchInsights();
    fetchFraudTableData();
  }, [fetchInsights, fetchFraudTableData]);

  const memoizedFraudData = useMemo(() => fraudData, [fraudData]);
  const memoizedInsights = useMemo(() => insights, [insights]);

  return (
    <div className="flex h-[100vh] justify-center items-center">
      <Resizable
        insights={memoizedInsights}
        fraudData={memoizedFraudData}
        loadingInsights={loadingInsights}
        loadingFraudData={loadingFraudData}
      />
    </div>
  );
}
export default App;

// ------------------------------ Resizable Panel-Main App ---------------------

interface ResizableProps {
  insights: Insight[];
  fraudData: FraudData[];
  loadingInsights: boolean;
  loadingFraudData: boolean;
}

function Resizable({
  insights,
  fraudData,
  loadingFraudData,
  loadingInsights,
}: ResizableProps) {
  const memoizedInsights = useMemo(() => insights, [insights]);
  const memoizedFraudData = useMemo(() => fraudData, [fraudData]);

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="w-full max-w-[90vw] max-h-[80vh] min-h-[50vh] border-[2px] border-slate-400"
    >
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} minSize={30}>
            <Upload />
          </ResizablePanel>
          {/* <ResizableHandle className="bg-gray-300 hover:bg-gray-500" /> */}
          <ResizablePanel
            defaultSize={60}
            minSize={50}
            className="overflow-auto"
          >
            <div className="p-4 h-full">
              <Tabs defaultValue="Table" className="h-full">
                <TabsList className="flex w-full">
                  <TabsTrigger
                    value="Table"
                    className="flex-1 bg-white text-black data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Tests
                  </TabsTrigger>
                  <TabsTrigger
                    value="OCR"
                    className="flex-1 bg-white text-black data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="Table"
                  style={{ height: "calc(100% - 1rem)" }}
                  className=""
                >
                  <div
                    style={{ height: "calc(100% - 1rem)" }}
                    className="h-full overflow-auto px-4 pb-3"
                  >
                    <FT
                      fraudData={memoizedFraudData}
                      loadingFraudData={loadingFraudData}
                    />
                  </div>
                </TabsContent>

                <TabsContent
                  value="OCR"
                  style={{ height: "calc(100% - 1rem)" }}
                >
                  <Insights
                    content={memoizedInsights}
                    loadingInsights={loadingInsights}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle className="bg-gray-300 hover:bg-gray-500" />

      <ResizablePanel defaultSize={40} minSize={25}>
        <FraudAnalysis />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

// ------------------------------ Upload Section -------------------------------

function Upload() {
  return (
    // <div className="flex flex-col items-center justify-center p-6 bg-white text-slate-900 rounded-lg shadow-lg w-full h-full max-w-full">
    //   <h2 className="text-xl font-semibold text-slate-900 mb-4">
    //     Upload Your File
    //   </h2>

    //   <label
    //     htmlFor="file-upload"
    //     className="w-full h-full flex items-center justify-center border-2 border-slate-300 rounded-lg bg-slate-100 cursor-pointer hover:border-slate-500 transition-all"
    //   >
    //     <Input type="file" id="file-upload" className="hidden" />
    //     <span className="text-center text-slate-600">Choose File</span>
    //   </label>

    //   <p className="mt-4 text-slate-500 text-sm">No file chosen</p>
    // </div>
    <div className="flex flex-col items-center justify-center p-6 bg-white text-slate-900 rounded-lg shadow-lg w-full h-full max-w-full min-h-[350px]">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Upload Your File
      </h2>

      <label
        htmlFor="file-upload"
        className="w-full min-h-[80%] flex items-center justify-center border-2 border-slate-300 rounded-lg bg-slate-100 cursor-pointer hover:border-slate-500 transition-all"
      >
        <Input type="file" id="file-upload" className="hidden" />
        <span className="text-center text-slate-600">Choose File</span>
      </label>

      <p className="mt-4 text-slate-500 text-sm">No file chosen</p>
    </div>
  );
}

// ------------------------------ Insights Section -----------------------------

function Insights({
  content,
  loadingInsights,
}: {
  content: Insight[];
  loadingInsights: boolean;
}) {
  return (
    <div
      style={{ height: "calc(100% - 1rem)" }}
      className="flex flex-col gap-3 p-4 overflow-auto"
    >
      {content &&
        content.map((insight, i: number) => (
          <Card
            className="flex w-full p-4 bg-white shadow-sm rounded-lg border border-gray-200"
            key={i}
          >
            <CardDescription className="text-sm font-medium text-gray-600">
              {insight.value}
            </CardDescription>
          </Card>
        ))}
      {loadingInsights &&
        Array.from({ length: 5 }, (_, i: number) => (
          <Card
            className="flex w-full p-4 bg-white shadow-sm rounded-lg border border-gray-200"
            key={i}
          >
            <CardDescription className="text-sm text-gray-600 w-full ">
              <Skeleton className="w-[50%] p-2 h-6 rounded-full" />
            </CardDescription>
          </Card>
        ))}
    </div>
  );
}

// ------------------------------ Fraud Analysis Section -----------------------

function FraudAnalysis() {
  // const position: number = 20; // for color meter as an example
  const [position, setPosition] = useState<number>(0); //dynamic af

  return (
    <div
      style={{ height: "calc(100% - 1rem)" }}
      className="flex flex-col p-4 m-4 bg-white overflow-auto"
    >
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">
        Fraud Analysis for the Given Document (
        <small>Color meter at bottom...</small>)
      </h1>

      <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Authenticity Indicators:
      </h2>
      <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
        <li>Institution: SVIT, Vasad is real.</li>
        <li>Email: contact@svitvasad.ac.in, Website: svitvasad.ac.in.</li>
        <li>Student ID: 22BEITM069 is in a valid format.</li>
        <li>Branch: Information Technology, valid duration (2022–2026).</li>
      </ul>

      <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Potential Fraud Indicators:
      </h2>
      <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
        <li>OCR errors: "BARDAR" and "waren umfarer" seem suspicious.</li>
        <li>Missing standard features: No photo, signature, or hologram.</li>
      </ul>

      <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Fraud Likelihood:
      </h2>
      <p className="leading-7 mt-4">
        Fraud Likelihood: <strong>0.4 (Moderate)</strong> - The document seems
        authentic but raises some suspicion due to OCR issues and missing
        standard features.
      </p>

      <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Suggestions for Verification:
      </h2>
      <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
        <li>Verify email and contact info on the SVIT website.</li>
        <li>Check the student ID number with SVIT's records.</li>
        <li>Confirm the details with the individual named on the document.</li>
      </ul>

      {/* color meter for testing  */}

      <h1 className="mt-10 scroll-m-20 border-b border-t pt-4 pb-4 text-3xl font-semibold tracking-tight flex flex-row justify-evenly">
        Color-Meter Demo
        <div>
          <span className="text-xl flex gap-4">
            Tweek to see changes :-
            <Input
              onChange={(e) => setPosition(+e.target.value * 100)}
              placeholder="position -> [0 - 0.1 - 0.99 - 1]%"
              className="w-fit"
            />
          </span>
        </div>
      </h1>
      <div className="flex  justify-center mt-4 p-4  gap-4">
        <ColorMeterForAValue position={position} />
      </div>
    </div>
  );
}

// ------------------------------ ColorMeter Section ---------------------------

function ColorMeterForAValue({ position = 0 }: { position: number }) {
  const safePosition = Math.min(position, 100);
  return (
    <>
      <div className="relative w-72 ">
        <div className="flex rounded-full overflow-hidden w-full h-8 text-center">
          <div className="bg-green-500 w-1/5 "></div>
          <div className="bg-yellow-300 w-1/5"></div>
          <div className="bg-amber-400 w-1/5"></div>
          <div className="bg-orange-400 w-1/5"></div>
          <div className="bg-red-500 w-1/5"></div>
        </div>

        <div
          className="absolute -top-[0.4rem] rotate-180 transition-all ease-in "
          style={{
            // prettier-ignore
            left: `${`calc(${safePosition}% - 8px)`
              // (safePosition !== 0 && safePosition !== 100 && safePosition > 3 && `calc(${safePosition}% - 3%)`) ||
              // (safePosition === 0 && `calc(${safePosition}%)`) ||
              // (safePosition === 100 && `calc(${safePosition}% - 6%)`)
            }`,
          }}
        >
          {/* <div className="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-black"></div> */}
          <div className="relative w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-black ">
            {/* <div className="absolute top-[-20px] left-[-0.5px] w-[1.2px] h-[19px] bg-slate-600"></div> */}
          </div>
        </div>
      </div>
    </>
  );
}
