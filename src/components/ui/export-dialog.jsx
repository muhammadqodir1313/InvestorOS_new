import { useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Download, FileText, Table, FileSpreadsheet, Loader2 } from 'lucide-react';
import { exportToPDF, exportToCSV, exportToExcel, exportPipelineDeals } from '@/lib/export-utils';
import { useToast } from '@/hooks/use-toast';

export function ExportDialog({ data, title = 'Export Data', children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      
      switch (format) {
        case 'pdf':
          await exportToPDF('export-content', title.toLowerCase().replace(/\s+/g, '-'), title);
          break;
        case 'csv':
          exportToCSV(data, title.toLowerCase().replace(/\s+/g, '-'));
          break;
        case 'excel':
          exportToExcel(data, title.toLowerCase().replace(/\s+/g, '-'));
          break;
        default:
          throw new Error('Unsupported format');
      }
      
      toast({
        title: 'Export Successful',
        description: `Data exported as ${format.toUpperCase()} successfully`,
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose the format you want to export your data in.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* PDF Export */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">PDF Document</h3>
                <p className="text-sm text-muted-foreground">
                  Export as formatted PDF document
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* CSV Export */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Table className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">CSV File</h3>
                <p className="text-sm text-muted-foreground">
                  Export as comma-separated values
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Excel Export */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Excel Spreadsheet</h3>
                <p className="text-sm text-muted-foreground">
                  Export as Excel workbook
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Pipeline uchun maxsus export komponenti
 */
export function PipelineExportDialog({ deals, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handlePipelineExport = async (format) => {
    try {
      setIsExporting(true);
      await exportPipelineDeals(deals, format);
      
      toast({
        title: 'Pipeline Exported',
        description: `Pipeline deals exported as ${format.toUpperCase()} successfully`,
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Pipeline
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Pipeline</DialogTitle>
          <DialogDescription>
            Export your pipeline deals in the desired format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* PDF Export */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">PDF Report</h3>
                <p className="text-sm text-muted-foreground">
                  Export pipeline as formatted PDF report
                </p>
              </div>
            </div>
            <Button
              onClick={() => handlePipelineExport('pdf')}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* CSV Export */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Table className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">CSV Data</h3>
                <p className="text-sm text-muted-foreground">
                  Export pipeline data as CSV file
                </p>
              </div>
            </div>
            <Button
              onClick={() => handlePipelineExport('csv')}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Excel Export */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Excel Workbook</h3>
                <p className="text-sm text-muted-foreground">
                  Export pipeline as Excel spreadsheet
                </p>
              </div>
            </div>
            <Button
              onClick={() => handlePipelineExport('excel')}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
