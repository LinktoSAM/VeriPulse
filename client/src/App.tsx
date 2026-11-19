import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuditInputHub } from './components/AuditInputHub';
import { ProgressStepper } from './components/ProgressStepper';
import { TrustReportView } from './components/TrustReportView';
import { AuditFeed } from './components/AuditFeed';
import { AuditReport, DemoSampleTrigger } from './types/audit';
import { auditText, auditMedia, getAuditReport, runDemoSimulation } from './services/api';
import { AlertCircle } from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<'audit' | 'feed'>('audit');
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check URL query param for shared report permalinks
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('report');
    if (reportId) {
      setIsLoading(true);
      getAuditReport(reportId)
        .then((report) => {
          setCurrentReport(report);
          setActiveView('audit');
        })
        .catch((err) => {
          console.error('Failed to load shared report:', err);
          setErrorMessage('Could not load the requested report. It may have expired or is invalid.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const handleTextSubmit = async (content: string, sourceUrl?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const report = await auditText(content, sourceUrl);
      setCurrentReport(report);
    } catch (err: unknown) {
      console.warn('API submission failed, checking fallback:', err);
      const msg = err instanceof Error ? err.message : 'Audit pipeline failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaSubmit = async (file: File, contextClaim?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const report = await auditMedia(file, contextClaim);
      setCurrentReport(report);
    } catch (err: unknown) {
      console.warn('Media audit failed, checking fallback:', err);
      const msg = err instanceof Error ? err.message : 'Media forensics pipeline failed. Please verify the backend connection.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = async (trigger: DemoSampleTrigger) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentReport(null);

    try {
      const demoReport = await runDemoSimulation(trigger);
      setCurrentReport(demoReport);
    } catch (err) {
      console.error('Failed demo simulation:', err);
      setErrorMessage('Could not load demo simulation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentReport(null);
    setErrorMessage(null);
    // Remove report query param if any
    const url = new URL(window.location.href);
    url.searchParams.delete('report');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100">
      <Navbar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === 'audit' && !currentReport) {
            setErrorMessage(null);
          }
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-slate-200 text-xs font-semibold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Progress Stepper during pipeline execution */}
        <ProgressStepper isLoading={isLoading} />

        {/* View Switching */}
        {!isLoading && (
          <>
            {activeView === 'feed' ? (
              <AuditFeed
                onSelectReport={(selected) => {
                  setCurrentReport(selected);
                  setActiveView('audit');
                }}
              />
            ) : currentReport ? (
              <TrustReportView report={currentReport} onReset={handleReset} />
            ) : (
              <AuditInputHub
                onSubmitText={handleTextSubmit}
                onSubmitMedia={handleMediaSubmit}
                onSelectDemo={handleDemoSelect}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

