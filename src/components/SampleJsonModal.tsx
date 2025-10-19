import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileCode } from 'lucide-react';
import { SAMPLE_JSON } from '@/lib/sampleJson';

export function SampleJsonModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileCode className="mr-2 h-4 w-4" />
          View Sample JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Sample JSON Structure Reference</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(SAMPLE_JSON, null, 2)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}