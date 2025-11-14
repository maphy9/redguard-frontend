import {
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Calendar,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const reportData = {
  documentInfo: {
    name: "Service Agreement Contract",
    date: "January 1, 2024",
    parties: ["TechCorp Solutions Inc.", "Client Company LLC"],
    reviewDate: "November 14, 2025",
    analyst: "AI Contract Analyzer",
  },
  executiveSummary: {
    overallRisk: "High",
    riskScore: 72,
    criticalIssues: 3,
    mediumIssues: 2,
    lowIssues: 1,
    recommendation: "Significant revisions recommended before signing",
  },
  strengths: [
    "Clear confidentiality provisions with survival clause",
    "Specific governing law jurisdiction defined",
    "Services scope adequately referenced",
    "Professional and clear formatting",
  ],
  weaknesses: [
    "Unlimited liability exposure without cap or exceptions",
    "Overly broad IP assignment including background IP",
    "Extended payment terms (Net 90) create cash flow risk",
    "Insufficient termination notice period",
    "Missing dispute resolution provisions",
    "No force majeure clause",
  ],
  priorities: [
    {
      id: 1,
      priority: "Critical",
      issue: "Unlimited Liability",
      recommendation:
        "Add liability cap at 2x contract value with specific exceptions",
      impact: "Could result in catastrophic financial exposure",
    },
    {
      id: 2,
      priority: "Critical",
      issue: "Broad IP Assignment",
      recommendation:
        "Limit to foreground IP only, retain background IP rights",
      impact: "Would prevent use of standard tools with other clients",
    },
    {
      id: 3,
      priority: "Critical",
      issue: "Extended Payment Terms",
      recommendation: "Negotiate Net 45 terms with late payment penalties",
      impact: "Significant cash flow and operational risk",
    },
    {
      id: 4,
      priority: "High",
      issue: "Short Termination Notice",
      recommendation: "Extend to 90 days for adequate resource planning",
      impact: "Insufficient time for orderly transition",
    },
    {
      id: 5,
      priority: "Medium",
      issue: "Missing Dispute Resolution",
      recommendation: "Add mediation/arbitration clause",
      impact: "May result in costly litigation",
    },
  ],
  compliance: [
    { item: "Clear identification of parties", status: "pass" },
    { item: "Defined term and termination provisions", status: "pass" },
    { item: "Payment terms specified", status: "warning" },
    { item: "IP ownership addressed", status: "warning" },
    { item: "Liability limitations", status: "fail" },
    { item: "Confidentiality provisions", status: "pass" },
    { item: "Governing law specified", status: "pass" },
    { item: "Force majeure clause", status: "fail" },
    { item: "Dispute resolution mechanism", status: "fail" },
    { item: "Insurance requirements", status: "warning" },
  ],
};

export function AuditReport() {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-[#EF4444] text-white";
      case "high":
        return "bg-[#F59E0B] text-white";
      case "medium":
        return "bg-[#FFF176] text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-white mb-2">Contract Audit Report</h2>
          <p className="text-gray-400">
            Comprehensive analysis and recommendations
          </p>
        </div>
        <Button className="bg-[#EE0000] hover:bg-[#CC0000] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Document Overview */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EE0000]" />
            Document Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Document Name</p>
              <p className="text-white">{reportData.documentInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Effective Date</p>
              <p className="text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#EE0000]" />
                {reportData.documentInfo.date}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Parties</p>
              <div className="space-y-1">
                {reportData.documentInfo.parties.map((party, idx) => (
                  <p
                    key={idx}
                    className="text-white text-sm flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    {party}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Review Date</p>
              <p className="text-white">{reportData.documentInfo.reviewDate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Analyzed By</p>
              <p className="text-white">{reportData.documentInfo.analyst}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card className="bg-[#1a1a1a] border-gray-800 border-2 border-[#EE0000]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#EE0000]" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="text-center">
              <div className="text-white mb-1">
                {reportData.executiveSummary.overallRisk}
              </div>
              <div className="text-gray-400 text-sm">Overall Risk</div>
            </div>
            <div className="text-center">
              <div className="text-white mb-1">
                {reportData.executiveSummary.riskScore}/100
              </div>
              <div className="text-gray-400 text-sm">Risk Score</div>
            </div>
            <div className="text-center">
              <div className="text-[#EF4444] mb-1">
                {reportData.executiveSummary.criticalIssues}
              </div>
              <div className="text-gray-400 text-sm">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-[#F59E0B] mb-1">
                {reportData.executiveSummary.mediumIssues}
              </div>
              <div className="text-gray-400 text-sm">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-[#FFF176] mb-1">
                {reportData.executiveSummary.lowIssues}
              </div>
              <div className="text-gray-400 text-sm">Low</div>
            </div>
          </div>
          <div className="p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg">
            <h4 className="text-white mb-2">Overall Recommendation</h4>
            <p className="text-gray-300">
              {reportData.executiveSummary.recommendation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              What's Working Well
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {reportData.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Areas Needing Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {reportData.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Priority Recommendations */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Priority Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Priority</TableHead>
                <TableHead className="text-gray-400">Issue</TableHead>
                <TableHead className="text-gray-400">Recommendation</TableHead>
                <TableHead className="text-gray-400">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.priorities.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-gray-800 hover:bg-[#0f0f0f]"
                >
                  <TableCell>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{item.issue}</TableCell>
                  <TableCell className="text-gray-300 text-sm">
                    {item.recommendation}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {item.impact}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Legal Compliance Checklist */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            Legal Compliance Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.compliance.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg"
              >
                <span className="text-gray-300 text-sm">{item.item}</span>
                {getComplianceIcon(item.status)}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-gray-300 text-sm">
                  {
                    reportData.compliance.filter((c) => c.status === "pass")
                      .length
                  }{" "}
                  Passed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-gray-300 text-sm">
                  {
                    reportData.compliance.filter((c) => c.status === "warning")
                      .length
                  }{" "}
                  Warnings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-300 text-sm">
                  {
                    reportData.compliance.filter((c) => c.status === "fail")
                      .length
                  }{" "}
                  Failed
                </span>
              </div>
            </div>
            <span className="text-gray-400 text-sm">
              {Math.round(
                (reportData.compliance.filter((c) => c.status === "pass")
                  .length /
                  reportData.compliance.length) *
                  100
              )}
              % Compliant
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white mb-1">
                Ready to improve this contract?
              </h4>
              <p className="text-gray-400 text-sm">
                Apply AI-suggested improvements or export this report
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-[#EE0000] hover:bg-[#CC0000] text-white">
                View Improvements
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
