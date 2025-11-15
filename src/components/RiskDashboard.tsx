import { useState } from "react";
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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

// const riskData = [
//   { name: "Liability", value: 8, color: "#FF2D2D" },
//   { name: "Payment Terms", value: 5, color: "#F59E0B" },
//   { name: "Termination", value: 3, color: "#FFF176" },
//   { name: "IP Rights", value: 6, color: "#FF4747" },
// ];

const risks = [
  {
    id: 1,
    level: "high",
    category: "Liability",
    title: "Unlimited liability clause",
    description: "Contract contains unlimited liability exposure without cap",
    section: "Section 8.2",
  },
  {
    id: 2,
    level: "high",
    category: "Payment Terms",
    title: "No late payment penalties",
    description: "Missing provisions for late payment protection",
    section: "Section 4.1",
  },
  {
    id: 3,
    level: "high",
    category: "IP Rights",
    title: "Broad IP assignment",
    description:
      "IP assignment clause is overly broad and may include background IP",
    section: "Section 12.3",
  },
  {
    id: 4,
    level: "medium",
    category: "Termination",
    title: "Short notice period",
    description: "Termination notice period of 30 days may be insufficient",
    section: "Section 10.1",
  },
  {
    id: 5,
    level: "medium",
    category: "Payment Terms",
    title: "Extended payment terms",
    description: "Net 90 payment terms increase cash flow risk",
    section: "Section 4.3",
  },
  {
    id: 6,
    level: "low",
    category: "General",
    title: "Governing law clarity",
    description:
      "Governing law clause could be more specific about jurisdiction",
    section: "Section 15.2",
  },
];
interface handleSwitchToViewerI {
  handleSwitchToViewer: () => void;
}
export function RiskDashboard({ handleSwitchToViewer }: handleSwitchToViewerI) {
  const [filterLevel, setFilterLevel] = useState("all");
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  const getRiskColor = (level: string) => {
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

  return (
    <div className="container mx-auto py-2 space-y-8">
      {/* Header */}
      {/* <div className="mb-2">
        <h2 className="text-2xl font-semibold text-[#E6E6E9] mb-1">
          Risk Analysis Dashboard
        </h2>
        <p className="text-sm text-[#9A9AA2]">
          Overview of critical risks detected in your contract.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="bg-[#1A1A1D] border border-[#FF2D2D] shadow-[0_18px_45px_rgba(255,45,45,0.35)] hover:shadow-[0_22px_55px_rgba(255,45,45,0.5)] hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-[#9A9AA2]">
              Total Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-semibold text-[#E6E6E9] mb-1">
                  {risks.length}
                </div>
                <div className="text-xs text-[#9A9AA2]">Issues found</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D0D0F] border border-[#262629]">
                <FileText className="w-5 h-5 text-[#FF2D2D]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border border-[#262629] hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(0,0,0,0.85)] transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-[#9A9AA2]">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-semibold text-[#E6E6E9] mb-1">
                  {highRiskCount}
                </div>
                <div className="text-xs text-[#9A9AA2]">Need attention</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1D] border border-[#FF2D2D]/40">
                <AlertTriangle className="w-5 h-5 text-[#FF2D2D]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border border-[#262629] hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(0,0,0,0.85)] transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-[#9A9AA2]">
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-semibold text-[#E6E6E9] mb-1">
                  72/100
                </div>
                <div className="text-xs text-[#9A9AA2]">High risk profile</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1D] border border-[#F59E0B]/30">
                <Activity className="w-5 h-5 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border border-[#262629] hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(0,0,0,0.85)] transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-[#9A9AA2]">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-semibold text-[#E6E6E9] mb-1">
                  4
                </div>
                <div className="text-xs text-[#9A9AA2]">Risk types</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1D] border border-emerald-400/30">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

     
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-[#1A1A1D] border border-[#262629]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#E6E6E9]">
              Risk Distribution by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={95}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  wrapperStyle={{ color: "#E6E6E9", fontSize: 12 }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border border-[#262629]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#E6E6E9]">
              Risk Level Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-[#FF2D2D]" />
                <span className="text-sm text-[#E6E6E9]">High risk</span>
              </div>
              <span className="text-sm text-[#E6E6E9]">
                {highRiskCount} issues
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-[#F59E0B]" />
                <span className="text-sm text-[#E6E6E9]">Medium risk</span>
              </div>
              <span className="text-sm text-[#E6E6E9]">
                {mediumRiskCount} issues
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-[#FFF176]" />
                <span className="text-sm text-[#E6E6E9]">Low risk</span>
              </div>
              <span className="text-sm text-[#E6E6E9]">
                {lowRiskCount} issues
              </span>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Risk List */}
      <Card className="bg-[#1A1A1D] border border-[#262629]">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold text-[#E6E6E9]">
              Detailed Risk Analysis
            </CardTitle>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
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
                      <span className="text-xs text-[#555565]">
                        {risk.section}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#E6E6E9] mb-1">
                      {risk.title}
                    </h4>
                    <p className="text-xs text-[#9A9AA2] mb-2">
                      {risk.description}
                    </p>

                    {expandedRisk === risk.id && (
                      <div className="mt-3 rounded-lg border border-[#262629] bg-black/70 p-4">
                        <h5 className="text-sm font-semibold text-[#E6E6E9] mb-2">
                          Detailed Analysis
                        </h5>
                        <p className="text-xs text-[#9A9AA2] mb-3">
                          This risk could expose your organization to
                          significant liability. We recommend implementing a cap
                          on liability or adding specific exclusions.
                        </p>
                        <h5 className="text-sm font-semibold text-[#E6E6E9] mb-2">
                          Recommendation
                        </h5>
                        <p className="text-xs text-[#9A9AA2]">
                          Negotiate a liability cap of no more than 2× the
                          contract value, or add specific exclusions for
                          indirect, consequential, and punitive damages.
                        </p>
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
