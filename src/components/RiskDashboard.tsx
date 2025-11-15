import { useState, useEffect } from "react";
import {
  AlertTriangle,
  FileText,
  TrendingUp,
  Activity,
  Filter,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// PieChart imports kept for future use / extension
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

type RiskLevel = "low" | "medium" | "high";

interface TopRisk {
  id: number;
  level: RiskLevel;
  category: string;
  title: string;
  description: string;
  section?: string | null;
  impact?: string | null;
  recommendation?: string | null;
}

interface CategoryScore {
  name: string;
  value: number;
}

interface Summary {
  overallRisk: RiskLevel;
  riskScore: number;
  criticalIssues: number;
  mediumIssues: number;
  lowIssues: number;
  recommendation: string;
}

interface ContractAnalysis {
  contractId: string;
  fileName: string;
  uploadedAt: string;
  summary: Summary;
  categories: CategoryScore[];
  topRisks: TopRisk[];
  // other fields exist in backend, but we don't need them here
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

interface RiskDashboardProps {
  handleSwitchToViewer: () => void;
}

// Base URL – configure via Vite env or fall back to same-origin
const API_BASE_URL =
  "http://redguard-backend-redguard.apps.cluster-d5t2f.d5t2f.sandbox2788.opentlc.com";

export function RiskDashboard({ handleSwitchToViewer }: RiskDashboardProps) {
  const [filterLevel, setFilterLevel] = useState<"all" | RiskLevel>("all");
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- Fetch latest contract + analysis from backend ----------
  useEffect(() => {
    const loadLatestAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Get list of contracts
        const listRes = await fetch(`${API_BASE_URL}/api/contracts`);
        if (!listRes.ok) {
          throw new Error(`List request failed with ${listRes.status}`);
        }
        const listJson: ContractListResponse = await listRes.json();

        if (!listJson.items || listJson.items.length === 0) {
          setAnalysis(null);
          return;
        }

        // Here we simply take the latest item (last in array)
        const latest = listJson.items[listJson.items.length - 1];

        // 2) Get full analysis for that contract
        const detailRes = await fetch(
          `${API_BASE_URL}/api/contracts/${latest.contractId}`
        );
        if (!detailRes.ok) {
          throw new Error(`Detail request failed with ${detailRes.status}`);
        }
        const detailJson: ContractAnalysis = await detailRes.json();
        setAnalysis(detailJson);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load contract analysis from backend.");
      } finally {
        setLoading(false);
      }
    };

    loadLatestAnalysis();
  }, []);

  const risks: TopRisk[] = analysis?.topRisks ?? [];

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "high":
        return "bg-[#FF2D2D] text-[#E6E6E9]";
      case "medium":
        return "bg-[#F59E0B] text-black";
      case "low":
        return "bg-[#FFF176] text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredRisks = risks.filter((risk) =>
    filterLevel === "all" ? true : risk.level === filterLevel
  );

  const highRiskCount = risks.filter((r) => r.level === "high").length;
  const mediumRiskCount = risks.filter((r) => r.level === "medium").length;
  const lowRiskCount = risks.filter((r) => r.level === "low").length;

  // Optional: riskData from categories (for PieChart, if you uncomment it later)
  const riskData =
    analysis?.categories?.map((c, idx) => ({
      name: c.name,
      value: c.value,
      color: ["#FF2D2D", "#F59E0B", "#FFF176", "#FF4747", "#22C55E"][idx % 5],
    })) ?? [];

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-[#9A9AA2]">Loading risk dashboard…</p>
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

  if (!analysis) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-[#9A9AA2]">
          No analyzed contracts found. Upload a document first.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2 space-y-8">
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-[#1A1A1D] to-[#240000] border border-[#262629]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#E6E6E9]">
              Overall risk score
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D2D]/10">
              <AlertTriangle className="h-4 w-4 text-[#FF7A7A]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#FF7A7A]">
                {analysis.summary.riskScore}
              </span>
              <span className="text-xs text-[#9A9AA2]">/ 100</span>
            </div>
            <p className="mt-2 text-xs text-[#9A9AA2]">
              {analysis.summary.recommendation}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border border-[#262629]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#E6E6E9]">
              Risk distribution
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7B61FF]/15">
              <FileText className="h-4 w-4 text-[#B4A6FF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-8">
              <div>
                <p className="text-xs text-[#9A9AA2]">High</p>
                <p className="text-lg font-semibold text-[#FF7A7A]">
                  {highRiskCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9A9AA2]">Medium</p>
                <p className="text-lg font-semibold text-[#FBBF24]">
                  {mediumRiskCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9A9AA2]">Low</p>
                <p className="text-lg font-semibold text-[#A3E635]">
                  {lowRiskCount}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-[#555565]">
              Distribution of clause-level risks across the entire contract.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border border-[#262629]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#E6E6E9]">
              AI confidence & signal
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#059669]/10">
              <Activity className="h-4 w-4 text-[#34D399]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#34D399]">89%</span>
              <span className="text-xs text-[#9A9AA2]">confidence</span>
            </div>
            <p className="mt-2 text-xs text-[#9A9AA2]">
              Model calibrated on synthetic legal datasets and internal
              benchmarks.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk list */}
      <Card className="bg-[#1A1A1D] border border-[#262629]">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold text-[#E6E6E9]">
              Detailed Risk Analysis
            </CardTitle>
            <Select
              value={filterLevel}
              onValueChange={(val) =>
                setFilterLevel(val as "all" | RiskLevel)
              }
            >
              <SelectTrigger className="w-40 bg-[#0D0D0F] border-[#262629] text-xs text-[#E6E6E9]">
                <div className="flex w-full items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="All levels" />
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1D] border-[#262629] text-[#E6E6E9]">
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRisks.map((risk) => (
              <div
                key={risk.id}
                className="rounded-xl border border-[#262629] bg-[#0D0D0F] p-4 transition-all duration-200 hover:border-[#FF2D2D]/60 hover:shadow-[0_16px_40px_rgba(0,0,0,0.85)] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <Badge
                        className={cn(
                          "px-2 py-0.5 text-[11px] font-semibold",
                          getRiskColor(risk.level)
                        )}
                      >
                        {risk.level.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-[#9A9AA2]">
                        {risk.category}
                      </span>
                      {risk.section && (
                        <span className="text-xs text-[#555565]">
                          {risk.section}
                        </span>
                      )}
                    </div>
                    <h4 className="mb-1 text-sm font-semibold text-[#E6E6E9]">
                      {risk.title}
                    </h4>
                    <p className="mb-2 text-xs text-[#9A9AA2]">
                      {risk.description}
                    </p>

                    {expandedRisk === risk.id && (
                      <div className="mt-3 rounded-lg border border-[#262629] bg-black/70 p-4">
                        <h5 className="mb-2 text-sm font-semibold text-[#E6E6E9]">
                          Detailed Analysis
                        </h5>
                        <p className="mb-3 text-xs text-[#9A9AA2]">
                          {risk.impact ||
                            "This risk could expose your organization to significant liability or commercial exposure."}
                        </p>
                        {risk.recommendation && (
                          <>
                            <h5 className="mb-2 text-sm font-semibold text-[#E6E6E9]">
                              Recommendation
                            </h5>
                            <p className="text-xs text-[#9A9AA2]">
                              {risk.recommendation}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedRisk(
                          expandedRisk === risk.id ? null : risk.id
                        )
                      }
                      className="border-[#262629] bg-transparent text-xs text-[#E6E6E9] hover:bg-[#1A1A1D] hover:text-white"
                    >
                      {expandedRisk === risk.id ? "Hide details" : "Details"}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          expandedRisk === risk.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      onClick={handleSwitchToViewer}
                      variant="outline"
                      size="sm"
                      className="border-[#262629] bg-transparent text-xs text-[#E6E6E9] hover:bg-[#1A1A1D] hover:text-white"
                    >
                      View in doc
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredRisks.length === 0 && (
              <p className="text-xs text-[#9A9AA2]">
                No risks for the selected filter.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// small helper so Badge can accept combined classes
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
