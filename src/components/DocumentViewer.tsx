import { useState, useEffect, useRef, type JSX } from "react";
import { AlertTriangle, ChevronRight, Lightbulb } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../utils/utils";

const documentText = `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of January 1, 2024 ("Effective Date") by and between TechCorp Solutions Inc. ("Provider") and Client Company LLC ("Client").

1. SERVICES
Provider agrees to provide software development services as outlined in Statement of Work documents.

2. PAYMENT TERMS
2.1 Client shall pay Provider within 90 days of invoice date.
2.2 All payments shall be made in US Dollars.
2.3 Late payments may incur interest charges.

3. INTELLECTUAL PROPERTY
3.1 All intellectual property created during the engagement, including but not limited to source code, documentation, designs, and any derivative works, shall be assigned to Client.
3.2 Provider hereby assigns all rights, title, and interest in such intellectual property.

4. LIABILITY
4.1 Provider shall be liable for any and all damages arising from this agreement without limitation.
4.2 Client may seek remedies for any breach or negligence.

5. TERMINATION
5.1 Either party may terminate this agreement with 30 days written notice.
5.2 Upon termination, all outstanding payments become immediately due.

6. CONFIDENTIALITY
6.1 Both parties agree to maintain confidentiality of proprietary information.
6.2 This obligation survives termination of the agreement.

7. GOVERNING LAW
This agreement shall be governed by the laws of the State of Delaware.`;

const highlights = [
  {
    start: 428,
    end: 488,
    level: "medium",
    text: "Client shall pay Provider within 90 days of invoice date",
    riskId: 1,
  },
  {
    start: 782,
    end: 960,
    level: "high",
    text: "All intellectual property created during the engagement, including but not limited to source code, documentation, designs, and any derivative works, shall be assigned to Client",
    riskId: 2,
  },
  {
    start: 1107,
    end: 1215,
    level: "high",
    text: "Provider shall be liable for any and all damages arising from this agreement without limitation",
    riskId: 3,
  },
  {
    start: 1347,
    end: 1417,
    level: "medium",
    text: "Either party may terminate this agreement with 30 days written notice",
    riskId: 4,
  },
];

const riskDetails = {
  1: {
    category: "Payment Terms",
    level: "medium",
    title: "Extended Payment Terms",
    explanation:
      "Net 90 payment terms significantly increase cash flow risk and may impact operational sustainability.",
    suggestion:
      "Recommend negotiating Net 30 or Net 45 terms, or implementing milestone-based payments.",
  },
  2: {
    category: "IP Rights",
    level: "high",
    title: "Broad IP Assignment",
    explanation:
      "The current clause assigns ALL intellectual property, which may include pre-existing background IP and tools that Provider uses across multiple clients.",
    suggestion:
      'Limit assignment to "foreground IP" specifically created for this project, excluding pre-existing tools and methodologies.',
  },
  3: {
    category: "Liability",
    level: "high",
    title: "Unlimited Liability",
    explanation:
      "Accepting unlimited liability exposure is extremely risky and could result in catastrophic financial consequences.",
    suggestion:
      "Cap liability at 2x the contract value or implement specific exclusions for indirect and consequential damages.",
  },
  4: {
    category: "Termination",
    level: "medium",
    title: "Short Notice Period",
    explanation:
      "30 days may be insufficient for resource planning and transition of ongoing work.",
    suggestion:
      "Negotiate 60-90 day notice period for termination without cause, with shorter period allowed for material breach.",
  },
};

export function DocumentViewer({
  highlightSection,
}: {
  highlightSection?: string;
}) {
  const [selectedRisk, setSelectedRisk] = useState<number | null>(1);

  // --- SCAN ANIMATION STATE ---
  const [scanning, setScanning] = useState(false);
  const [activeHighlightIds, setActiveHighlightIds] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const scannerAnimation = useAnimation();

  const scanDuration = 3; // sek

  const getRiskColor = (level: string) => {
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

  const getBadgeColor = (level: string) => {
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

  // start scan na mount (tylko forward)
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

    startScan();
  }, [scannerAnimation]);

  // live podświetlanie w trakcie skanu – od początku frazy
  useEffect(() => {
    if (!scanning || !scannerRef.current || !contentRef.current) return;

    let frameId: number;

    const tick = () => {
      if (!scannerRef.current || !contentRef.current) return;

      const scannerRect = scannerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const scannerRightEdge = scannerRect.right - contentRect.left;

      const newActive: number[] = [];

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
  }, [scanning]);

  // render tekstu + highlightów
  const renderDocumentWithHighlights = () => {
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
            // 🔴 dopóki skaner tu nie dojedzie – fraza wygląda jak normalny tekst
            !isActive && "text-[#D4D4DD]",
            // po przejeździe skanera – pełen kolor + glow
            isActive &&
              cn(
                getRiskColor(highlight.level),
                "text-[#FFF9F9] shadow-[0_0_2px_rgba(255,50,60,0.8)] border",
                `border-[#FF3B3B]/50`
              )
          )}
          onClick={() => setSelectedRisk(highlight.riskId)}
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

  const selectedRiskData = selectedRisk
    ? riskDetails[selectedRisk as keyof typeof riskDetails]
    : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Document Viewer - Left Panel */}
      <div className="lg:col-span-2">
        <Card className="h-[800px] border-gray-800 bg-[#1a1a1a]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                Service Agreement Contract
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
                {/* tekst kontraktu */}
                <div ref={contentRef}>
                  <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                    {renderDocumentWithHighlights()}
                  </pre>
                </div>

                {/* scanner overlay */}
                <motion.div
                  ref={scannerRef}
                  className="pointer-events-none absolute -top-8 left-0 h-[calc(100%+64px)]"
                  initial={{ x: "-90%" }}
                  animate={scannerAnimation}
                >
                  <div className="flex h-full flex-row-reverse">
                    {/* główna linia */}
                    <div className="h-full w-[6px] bg-gradient-to-b from-[#FF6666] via-[#FF2D2D] to-transparent shadow-[0_0_24px_rgba(255,45,45,0.9)]" />
                    {/* ogon gradientu – zrobione w CSS, bez tailwind.config */}
                    <div className="scan-gradient-bar h-full w-24" />
                  </div>
                </motion.div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Risk Details Sidebar - Right Panel */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6 border-gray-800 bg-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="text-white">Risk Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRiskData ? (
              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#EE0000]" />
                    <Badge className={getBadgeColor(selectedRiskData.level)}>
                      {selectedRiskData.level.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-white">{selectedRiskData.title}</h3>
                  <p className="text-sm text-gray-400">
                    {selectedRiskData.category}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-white">
                    <ChevronRight className="h-4 w-4 text-[#EE0000]" />
                    Explanation
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {selectedRiskData.explanation}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-800 bg-[#0f0f0f] p-4">
                  <h4 className="mb-2 flex items-center gap-2 text-white">
                    <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                    Suggested Fix
                  </h4>
                  <p className="mb-4 text-sm leading-relaxed text-gray-300">
                    {selectedRiskData.suggestion}
                  </p>
                </div>
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
