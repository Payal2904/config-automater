import { useConfigStore } from '@/store/configStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { downloadJSON } from '@/lib/utils';
import { useState } from 'react';

export function JSONPreview() {
  const { selectedPlanType, exportConfig } = useConfigStore();
  const config = exportConfig(selectedPlanType);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    downloadJSON(config, `${selectedPlanType.toLowerCase()}-config.json`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">JSON Preview</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <pre className="text-xs bg-muted p-4 rounded-md overflow-auto h-full">
          {JSON.stringify(config, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}