import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { UploadPage } from "./components/UploadPage";
import { DocumentViewer } from "./components/DocumentViewer";
import { RiskDashboard } from "./components/RiskDashboard";
import { ClauseImprovement } from "./components/ClauseImprovement";
import { ComparisonMode } from "./components/ComparisonMode";
import { AuditReport } from "./components/AuditReport";
import "./styles/globals.css";
import Header from "./components/layout/Header";

// import redHatLogo from "figma:asset/47e290391f04b200e62d1fb113da9b4822230f53.png";

export default function App() {
  const [activeTab, setActiveTab] = useState("upload");
  const [hasDocument, setHasDocument] = useState(false);

  const handleDocumentUploaded = () => {
    setHasDocument(true);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white">
      <Header></Header>

      <main className="container mx-auto px-2 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>

            <TabsTrigger value="dashboard" disabled={!hasDocument}>
              Dashboard
            </TabsTrigger>

            <TabsTrigger value="viewer" disabled={!hasDocument}>
              Document Viewer
            </TabsTrigger>

            {/* <TabsTrigger value="improvement" disabled={!hasDocument}>
              Improvements
            </TabsTrigger>

            <TabsTrigger value="comparison" disabled={!hasDocument}>
              Comparison
            </TabsTrigger>

            <TabsTrigger value="report" disabled={!hasDocument}>
              Audit Report
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="upload">
            <UploadPage onDocumentUploaded={handleDocumentUploaded} />
          </TabsContent>

          <TabsContent value="dashboard">
            <RiskDashboard />
          </TabsContent>

          <TabsContent value="viewer">
            <DocumentViewer />
          </TabsContent>

          <TabsContent value="improvement">
            <ClauseImprovement />
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonMode />
          </TabsContent>

          <TabsContent value="report">
            <AuditReport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
