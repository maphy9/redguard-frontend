import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { UploadPage } from "./components/UploadPage";
import { DocumentViewer } from "./components/DocumentViewer";
import { RiskDashboard } from "./components/RiskDashboard";
import { ClauseImprovement } from "./components/ClauseImprovement";
import { ComparisonMode } from "./components/ComparisonMode";
import { AuditReport } from "./components/AuditReport";
import "./styles/globals.css";

// import redHatLogo from "figma:asset/47e290391f04b200e62d1fb113da9b4822230f53.png";

export default function App() {
  const [activeTab, setActiveTab] = useState("upload");
  const [hasDocument, setHasDocument] = useState(false);

  const handleDocumentUploaded = () => {
    setHasDocument(true);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0f0f0f]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#EE0000] rounded-sm flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm transform rotate-12"></div>
              </div>
              <div>
                <h1 className="text-white">AI Contract Risk Analyzer</h1>
                <p className="text-gray-400 text-sm">Powered by Red Hat AI</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <button className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Reports
                </button>
              </nav>
              <button className="px-4 py-2 bg-[#EE0000] text-white rounded hover:bg-[#CC0000] transition-colors">
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-[#1a1a1a] border border-gray-800 mb-8">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-[#EE0000] data-[state=active]:text-white"
            >
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              disabled={!hasDocument}
              className="data-[state=active]:bg-[#EE0000] data-[state=active]:text-white disabled:opacity-50"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="viewer"
              disabled={!hasDocument}
              className="data-[state=active]:bg-[#EE0000] data-[state=active]:text-white disabled:opacity-50"
            >
              Document Viewer
            </TabsTrigger>
            <TabsTrigger
              value="improvement"
              disabled={!hasDocument}
              className="data-[state=active]:bg-[#EE0000] data-[state=active]:text-white disabled:opacity-50"
            >
              Improvements
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              disabled={!hasDocument}
              className="data-[state=active]:bg-[#EE0000] data-[state=active]:text-white disabled:opacity-50"
            >
              Comparison
            </TabsTrigger>
            <TabsTrigger
              value="report"
              disabled={!hasDocument}
              className="data-[state=active]:bg-[#EE0000] data-[state=active]:text-white disabled:opacity-50"
            >
              Audit Report
            </TabsTrigger>
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
