import { useEffect, useState, useRef, type JSX } from "react";
import { AlertTriangle, ChevronRight, Lightbulb } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../utils/utils";

/* -----------------------------------------
   Type definitions
------------------------------------------ */

type RiskLevel = "low" | "medium" | "high";

interface IssueDetail {
  id: string;
  type: string;
  severity: RiskLevel;
  snippet: string;
  explanation: string;
  suggestedFix?: string;
}

interface Section {
  id: string;
  heading?: string;
  text: string;
  riskLevel: RiskLevel;
  issues: IssueDetail[];
}

interface DocumentData {
  title?: string;
  sections: Section[];
}

interface Summary {
  overallRisk: RiskLevel;
  riskScore: number;
}

interface ContractAnalysis {
  contractId: string;
  fileName: string;
  uploadedAt: string;
  document: DocumentData;
  summary: Summary;
}

interface ContractListItem {
  contractId: string;
  fileName: string;
  uploadedAt: string;
  overallRisk: RiskLevel;
  riskScore: number;
}

interface ContractListResponse {
  items: ContractListItem[];
}

/* -----------------------------------------
   Highlight type
------------------------------------------ */

interface Highlight {
  start: number;
  end: number;
  level: RiskLevel;
  text: string;
  riskId: string;
  issue: IssueDetail;
}

/* -----------------------------------------
   API base URL
------------------------------------------ */

const API_BASE_URL =
  "http://redguard-backend-redguard.apps.cluster-d5t2f.d5t2f.sandbox2788.opentlc.com";

/* -----------------------------------------
   Component
------------------------------------------ */

export function DocumentViewer() {
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [documentText, setDocumentText] = useState<string>("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<IssueDetail | null>(null);

  // --- SCAN ANIMATION STATE ---
  const [scanning, setScanning] = useState(false);
  const [activeHighlightIds, setActiveHighlightIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const scannerAnimation = useAnimation();
  const scanDuration = 3; // seconds

  /* -----------------------------------------
     Helpers
  ------------------------------------------ */

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "high":
        return "bg-[#FF3B3B]/55";
      case "medium":
        return "bg-[#FFB547]/50";
      case "low":
        return "bg-[#FFF86A]/55";
      default:
        return "bg-gray-500/55";
    }
  };

  const getBadgeColor = (level: RiskLevel) => {
    switch (level) {
      case "high":
        return "bg-[#EF4444] text-white";
      case "medium":
        return "bg-[#F59E0B] text-white";
      case "low":
        return "bg-[#FFF176] text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  /* -----------------------------------------
     Load latest contract analysis from backend
  ------------------------------------------ */

  useEffect(() => {
    const loadLatestAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Get list of contracts
        const listRes = await fetch(`${API_BASE_URL}/api/contracts`);
        if (!listRes.ok) {
          throw new Error(`List request failed with status ${listRes.status}`);
        }
        const listJson: ContractListResponse = await listRes.json();

        if (!listJson.items || listJson.items.length === 0) {
          setAnalysis(null);
          setDocumentText("");
          setHighlights([]);
          setSelectedIssue(null);
          return;
        }

        const latest = listJson.items[listJson.items.length - 1];

        // 2) Load full analysis for the latest contract
        const detailRes = await fetch(
          `${API_BASE_URL}/api/contracts/${latest.contractId}`
        );
        if (!detailRes.ok) {
          throw new Error(
            `Detail request failed with status ${detailRes.status}`
          );
        }
        const detailJson: ContractAnalysis = await detailRes.json();
        setAnalysis(detailJson);

        // Build one big text blob from sections
        const sections = detailJson.document?.sections ?? [];
        let combined = "";
        const sectionOffsets: number[] = [];

        sections.forEach((s, idx) => {
          sectionOffsets[idx] = combined.length;
          combined += s.text ?? "";
          if (idx < sections.length - 1) {
            combined += "\n\n";
          }
        });

        setDocumentText(combined);

        // Build highlights from issues using snippet positions
        const newHighlights: Highlight[] = [];
        sections.forEach((section, sectionIndex) => {
          const baseOffset = sectionOffsets[sectionIndex] ?? 0;
          const sectionText = section.text ?? "";

          section.issues?.forEach((issue) => {
            if (!issue.snippet) return;
            const localIndex = sectionText.indexOf(issue.snippet);
            if (localIndex === -1) return;

            const start = baseOffset + localIndex;
            const end = start + issue.snippet.length;

            newHighlights.push({
              start,
              end,
              level: issue.severity,
              text: issue.snippet,
              riskId: issue.id,
              issue,
            });
          });
        });

        setHighlights(newHighlights);
        setSelectedIssue(newHighlights[0]?.issue ?? null);
        setActiveHighlightIds([]); // reset active highlights for new doc
      } catch (e) {
        console.error(e);
        setError("Failed to load document analysis from backend.");
        setAnalysis(null);
        setDocumentText("");
        setHighlights([]);
        setSelectedIssue(null);
      } finally {
        setLoading(false);
      }
    };

    loadLatestAnalysis();
  }, []);

  /* -----------------------------------------
     Scanner animation (one forward pass)
  ------------------------------------------ */

  useEffect(() => {
    const startScan = async () => {
      if (!containerRef.current) return;

      setScanning(true);
      setActiveHighlightIds([]);

      const width = containerRef.current.offsetWidth;

      await scannerAnimation.start({
        x: width,
        transition: { duration: scanDuration, ease: "linear" },
      });

      setScanning(false);
    };

    if (documentText) {
      // rerun scan whenever we load a document
      scannerAnimation.set({ x: "-90%" });
      startScan();
    }
  }, [documentText, scannerAnimation]);

  /* -----------------------------------------
     Live highlight activation during scan
  ------------------------------------------ */

  useEffect(() => {
    if (!scanning || !scannerRef.current || !contentRef.current) return;

    let frameId: number;

    const tick = () => {
      if (!scannerRef.current || !contentRef.current) return;

      const scannerRect = scannerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const scannerRightEdge = scannerRect.right - contentRect.left;

      const newActive: string[] = [];

      highlights.forEach((h) => {
        const el = contentRef.current!.querySelector<HTMLSpanElement>(
          `[data-highlight-id="${h.riskId}"]`
        );
        if (!el) return;

        const elRect = el.getBoundingClientRect();
        const elCenter = (elRect.left + elRect.right) / 2 - contentRect.left;

        if (elCenter <= scannerRightEdge) {
          newActive.push(h.riskId);
        }
      });

      setActiveHighlightIds((prev) =>
        prev.length === newActive.length &&
        prev.every((id) => newActive.includes(id))
          ? prev
          : newActive
      );

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [scanning, highlights]);

  /* -----------------------------------------
     Render document with highlight spans
  ------------------------------------------ */

  const renderDocumentWithHighlights = () => {
    if (!documentText) return null;

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, index) => {
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`} className="text-[#D4D4DD]">
            {documentText.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      const isActive = activeHighlightIds.includes(highlight.riskId);

      parts.push(
        <span
          key={`highlight-${index}`}
          data-highlight-id={highlight.riskId}
          className={cn(
            "cursor-pointer px-1 rounded-sm transition-all duration-200",
            !isActive && "text-[#D4D4DD]",
            isActive &&
              cn(
                getRiskColor(highlight.level),
                "text-[#FFF9F9] shadow-[0_0_2px_rgba(255,50,60,0.8)] border",
                `border-[#FF3B3B]/50`
              )
          )}
          onClick={() => setSelectedIssue(highlight.issue)}
        >
          {highlight.text}
        </span>
      );

      lastIndex = highlight.end;
    });

    if (lastIndex < documentText.length) {
      parts.push(
        <span key="text-final" className="text-[#D4D4DD]">
          {documentText.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  /* -----------------------------------------
     UI states
  ------------------------------------------ */

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-[#9A9AA2]">Loading document viewer…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!analysis || !documentText) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-[#9A9AA2]">
          No analyzed contracts found. Upload and analyze a document first.
        </p>
      </div>
    );
  }

  /* -----------------------------------------
     Main layout
  ------------------------------------------ */

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT PANEL – DOCUMENT + SCANNER */}
      <div className="lg:col-span-2">
        <Card className="h-[800px] border-gray-800 bg-[#1a1a1a]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {analysis.document?.title || analysis.fileName}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded bg-[#FF3B3B]" />
                <span className="text-gray-400">High</span>
                <div className="ml-3 h-3 w-3 rounded bg-[#FFB547]" />
                <span className="text-gray-400">Medium</span>
                <div className="ml-3 h-3 w-3 rounded bg-[#FFF86A]" />
                <span className="text-gray-400">Low</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-[680px] pr-4">
              <div
                ref={containerRef}
                className="relative overflow-hidden rounded-lg border border-gray-800 bg-[#050509] p-6"
              >
                {/* Contract text */}
                <div ref={contentRef}>
                  <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                    {renderDocumentWithHighlights()}
                  </pre>
                </div>

                {/* Scanner overlay */}
                <motion.div
                  ref={scannerRef}
                  className="pointer-events-none absolute -top-8 left-0 h-[calc(100%+64px)]"
                  initial={{ x: "-90%" }}
                  animate={scannerAnimation}
                >
                  <div className="flex h-full flex-row-reverse">
                    <div className="h-full w-[6px] bg-gradient-to-b from-[#FF6666] via-[#FF2D2D] to-transparent shadow-[0_0_24px_rgba(255,45,45,0.9)]" />
                    {/* tail gradient – implemented via custom CSS class */}
                    <div className="scan-gradient-bar h-full w-24" />
                  </div>
                </motion.div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT PANEL – RISK DETAILS */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6 border-gray-800 bg-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="text-white">Risk Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedIssue ? (
              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#EE0000]" />
                    <Badge className={getBadgeColor(selectedIssue.severity)}>
                      {selectedIssue.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-white">
                    {selectedIssue.type || "Issue"}
                  </h3>
                  <p className="text-sm text-gray-400">Clause Risk</p>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-white">
                    <ChevronRight className="h-4 w-4 text-[#EE0000]" />
                    Explanation
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {selectedIssue.explanation}
                  </p>
                </div>

                {selectedIssue.suggestedFix && (
                  <div className="rounded-lg border border-gray-800 bg-[#0f0f0f] p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-white">
                      <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                      Suggested Fix
                    </h4>
                    <p className="mb-4 text-sm leading-relaxed text-gray-300">
                      {selectedIssue.suggestedFix}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                <p className="text-gray-400">
                  Click on a highlighted section to view risk details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
