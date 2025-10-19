import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadPanelProps {
  title: string;
  description: string;
  acceptedTypes: string;
  icon: React.ReactNode;
  onFileUpload: (file: File) => Promise<void>;
  isUploaded: boolean;
  additionalInput?: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  };
}

export function FileUploadPanel({
  title,
  description,
  acceptedTypes,
  icon,
  onFileUpload,
  isUploaded,
  additionalInput,
}: FileUploadPanelProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setFileName(file.name);

    try {
      await onFileUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {additionalInput && (
          <div>
            <Label>{additionalInput.label}</Label>
            <Input
              placeholder={additionalInput.placeholder}
              value={additionalInput.value}
              onChange={(e) => additionalInput.onChange(e.target.value)}
            />
          </div>
        )}
        
        <div>
          <Label htmlFor={`file-${title}`} className="cursor-pointer">
            <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  Accepts: {acceptedTypes}
                </p>
              </div>
            </div>
          </Label>
          <Input
            id={`file-${title}`}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            Uploading...
          </div>
        )}

        {fileName && !error && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            {fileName}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}