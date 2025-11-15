import { useState } from "react";
import { Upload, FileText, Shield, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

interface UploadPageProps {
  onDocumentUploaded: () => void;
}

export function UploadPage({ onDocumentUploaded }: UploadPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onDocumentUploaded();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="relative max-w-5xl mx-auto overflow-hidden rounded-2xl border border-[#262629] bg-[#1A1A1D] px-8 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
        {/* subtle red glow accent */}
        <div className="pointer-events-none absolute -top-40 -right-24 h-80 w-80 rounded-full bg-[#FF2D2D]/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-[#FF4747]/10 blur-3xl" />

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-2xl font-semibold text-[#E6E6E9] mb-3">
            Upload Contract Document
          </h2>
          <p className="text-sm text-[#9A9AA2]">
            Drag &amp; drop your contract or click to browse. RedGuard will
            analyze it securely inside your cluster.
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={`relative mb-8 rounded-xl border-2 border-dashed p-10 transition-all duration-300 ease-out
          ${
            isDragging
              ? "border-[#FF2D2D] bg-[#FF2D2D]/8 shadow-[0_0_40px_rgba(255,45,45,0.45)] scale-[1.01]"
              : "border-[#262629] bg-[#0D0D0F] hover:border-[#FF2D2D]/60 hover:bg-[#0D0D0F]/95"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <HoloScanOverlay active={isUploading} />

          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.txt,.docx"
            onChange={handleFileSelect}
          />

          <label
            htmlFor="file-upload"
            className="relative z-10 flex cursor-pointer flex-col items-center justify-center text-center"
          >
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#1A1A1D] shadow-[0_14px_30px_rgba(0,0,0,0.9)] border border-[#262629]">
              <Upload className="w-10 h-10 text-[#FF3A3A]" />
            </div>

            {file ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FileText className="w-5 h-5 text-[#FF2D2D]" />
                  <span className="text-sm font-medium text-[#E6E6E9]">
                    {file.name}
                  </span>
                </div>
                <p className="text-xs text-[#9A9AA2]">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-medium text-[#E6E6E9] mb-2">
                  Drop your contract here or click to browse
                </h3>
                <p className="text-sm text-[#9A9AA2]">
                  Supported formats: PDF, TXT, DOCX
                </p>
              </>
            )}
          </label>

          {/* Format badges */}
          <div className="relative z-10 mt-6 flex justify-center gap-3">
            {["PDF", "TXT", "DOCX"].map((fmt) => (
              <span
                key={fmt}
                className="px-3 py-1 rounded-full border border-[#262629] bg-[#1A1A1D] text-xs font-medium text-[#E6E6E9] shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Privacy Badge */}
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-[#262629] bg-[#0D0D0F] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#E6E6E9] flex items-center gap-2">
              Processing in memory – no disk storage
              <Check className="w-4 h-4 text-emerald-400" />
            </p>
            <p className="text-xs text-[#9A9AA2]">
              Your data never leaves this OpenShift cluster.
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-xs text-[#E6E6E9]">
              <span>Analyzing document…</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress
              className="h-2 bg-[#0D0D0F] border border-[#262629]"
              value={uploadProgress}
            />
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={!file || isUploading}
            className="px-8 py-3 bg-[#FF2D2D] hover:bg-[#E12626] text-[#E6E6E9] text-sm font-semibold rounded-full shadow-[0_18px_40px_rgba(255,45,45,0.55)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5"
          >
            {isUploading ? "Analyzing..." : "Analyze Contract"}
          </Button>
        </div>
      </div>
    </div>
  );
}
function HoloScanOverlay({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      {/* central red vignette – jak na mockupie */}
      <div
        className="absolute inset-0 opacity-90 mix-blend-screen
                   bg-[radial-gradient(circle_at_center,_rgba(255,45,45,0.55),_rgba(13,13,15,0.4)_55%,_rgba(13,13,15,0.95)_100%)]"
      />

      {/* mocniejszy pionowy laser */}
      <div
        className="holo-scan-line absolute top-0 left-1/2 h-[55%] w-[72%]
                   -translate-x-1/2 rounded-full
                   bg-[radial-gradient(circle_at_center,_rgba(255,71,71,0.9),_rgba(255,45,45,0.1)_60%,_transparent_100%)]"
      />

      {/* główny pierścień wokół ikony */}
      <div
        className="holo-ring absolute left-1/2 top-[44%] h-48 w-48 -translate-x-1/2 rounded-full
                   border border-[#FF2D2D]/70
                   shadow-[0_0_120px_rgba(255,45,45,0.85)]"
      />

      {/* wewnętrzny ring dla głębi */}
      <div
        className="absolute left-1/2 top-[44%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full
                   border border-[#FF7A7A]/50
                   shadow-[0_0_60px_rgba(255,71,71,0.7)] opacity-80"
      />

      {/* bardziej widoczny przepływ danych */}
      <div
        className="holo-data-flow absolute bottom-8 left-8 right-8 h-[2px]
                   bg-gradient-to-r from-transparent via-[#FF2D2D] to-transparent
                   shadow-[0_0_40px_rgba(255,45,45,0.9)]"
      />
    </div>
  );
}
