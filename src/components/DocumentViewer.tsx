import { useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

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

export function DocumentViewer() {
  const [selectedRisk, setSelectedRisk] = useState<number | null>(1);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-[#FF5252]/30 hover:bg-[#FF5252]/40 border-l-4 border-[#FF5252]";
      case "medium":
        return "bg-[#FFB74D]/30 hover:bg-[#FFB74D]/40 border-l-4 border-[#FFB74D]";
      case "low":
        return "bg-[#FFF176]/30 hover:bg-[#FFF176]/40 border-l-4 border-[#FFF176]";
      default:
        return "bg-gray-500/30";
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

  const renderDocumentWithHighlights = () => {
    const parts = [];
    let lastIndex = 0;

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`} className="text-gray-300">
            {documentText.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      parts.push(
        <span
          key={`highlight-${index}`}
          className={`cursor-pointer transition-all ${getRiskColor(
            highlight.level
          )} px-1 rounded`}
          onClick={() => setSelectedRisk(highlight.riskId)}
        >
          {highlight.text}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < documentText.length) {
      parts.push(
        <span key="text-final" className="text-gray-300">
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Document Viewer - Left Panel */}
      <div className="lg:col-span-2">
        <Card className="bg-[#1a1a1a] border-gray-800 h-[800px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                Service Agreement Contract
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-[#FF5252] rounded"></div>
                  <span className="text-gray-400">High</span>
                  <div className="w-3 h-3 bg-[#FFB74D] rounded ml-3"></div>
                  <span className="text-gray-400">Medium</span>
                  <div className="w-3 h-3 bg-[#FFF176] rounded ml-3"></div>
                  <span className="text-gray-400">Low</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[680px] pr-4">
              <div className="bg-[#0f0f0f] p-6 rounded-lg border border-gray-800">
                <pre className="whitespace-pre-wrap font-serif">
                  {renderDocumentWithHighlights()}
                </pre>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Risk Details Sidebar - Right Panel */}
      <div className="lg:col-span-1">
        <Card className="bg-[#1a1a1a] border-gray-800 sticky top-6">
          <CardHeader>
            <CardTitle className="text-white">Risk Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRiskData ? (
              <div className="space-y-6">
                {/* Risk Header */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-[#EE0000]" />
                    <Badge className={getBadgeColor(selectedRiskData.level)}>
                      {selectedRiskData.level.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-white mb-2">{selectedRiskData.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {selectedRiskData.category}
                  </p>
                </div>

                {/* Explanation */}
                <div>
                  <h4 className="text-white mb-2 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-[#EE0000]" />
                    Explanation
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedRiskData.explanation}
                  </p>
                </div>

                {/* Suggested Fix */}
                <div className="bg-[#0f0f0f] p-4 rounded-lg border border-gray-800">
                  <h4 className="text-white mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                    Suggested Fix
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {selectedRiskData.suggestion}
                  </p>
                  {/* <Button className="w-full bg-[#EE0000] hover:bg-[#CC0000] text-white">
                    Generate Improved Version
                  </Button> */}
                </div>

                {/* Quick Actions */}
                {/* <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent border-gray-700 text-white hover:bg-gray-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Context
                  </Button>
                </div> */}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
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
