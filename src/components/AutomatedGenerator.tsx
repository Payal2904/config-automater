import { useState } from 'react';
import { useConfigStore } from '@/store/configStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploadPanel } from './FileUploadPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  FileSpreadsheet, 
  FileCheck, 
  FileCode2, 
  Figma,
  Wand2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { parseExcelMapping, parseValidationDoc, parseCTXXml, parseFigmaNode } from '@/utils/parsers';
import { generateConfigFromSources } from '@/utils/configGenerator';
import { UploadedSources } from '@/types/upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AutomatedGenerator() {
  const { selectedPlanType, importConfig } = useConfigStore();
  
  const [sources, setSources] = useState<UploadedSources>({});
  const [figmaLink, setFigmaLink] = useState('');
  const [figmaNodeId, setFigmaNodeId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<any>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleFigmaExtract = async () => {
    if (!figmaLink || !figmaNodeId) {
      alert('Please provide both Figma link and node ID');
      return;
    }

    try {
      const fields = await parseFigmaNode(figmaLink, figmaNodeId);
      setSources((prev) => ({
        ...prev,
        figma: { link: figmaLink, nodeId: figmaNodeId, fields },
      }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to extract Figma data');
    }
  };

  const handleExcelUpload = async (file: File) => {
    const mappings = await parseExcelMapping(file);
    setSources((prev) => ({ ...prev, excel: mappings }));
  };

  const handleValidationUpload = async (file: File) => {
    const validations = await parseValidationDoc(file);
    setSources((prev) => ({ ...prev, validations }));
  };

  const handleCTXUpload = async (file: File) => {
    const formulas = await parseCTXXml(file);
    setSources((prev) => ({ ...prev, ctxXml: formulas }));
  };

  const handleGenerateConfig = () => {
    setGenerating(true);
    
    try {
      const { config, warnings: genWarnings } = generateConfigFromSources(selectedPlanType, sources);
      setGeneratedConfig(config);
      setWarnings(genWarnings);
      
      if (config.length > 0) {
        importConfig(selectedPlanType, config);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate config');
    } finally {
      setGenerating(false);
    }
  };

  const uploadStatus = {
    figma: !!sources.figma?.fields && sources.figma.fields.length > 0,
    excel: !!sources.excel && sources.excel.length > 0,
    validations: !!sources.validations && sources.validations.length > 0,
    ctxXml: !!sources.ctxXml && sources.ctxXml.length > 0,
  };

  const canGenerate = uploadStatus.figma;

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Automated Config Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload Figma, Excel, Validation docs, and CTX XML to auto-generate {selectedPlanType} config
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Sources</TabsTrigger>
          <TabsTrigger value="preview">Preview & Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Figma Upload */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Figma className="h-5 w-5 text-purple-600" />
                  <div>
                    <CardTitle className="text-lg">Figma Design</CardTitle>
                    <p className="text-sm text-muted-foreground">Extract field structure from Figma</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Figma File Link</Label>
                  <Input
                    placeholder="https://www.figma.com/file/..."
                    value={figmaLink}
                    onChange={(e) => setFigmaLink(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Node ID</Label>
                  <Input
                    placeholder="123:456"
                    value={figmaNodeId}
                    onChange={(e) => setFigmaNodeId(e.target.value)}
                  />
                </div>
                <Button onClick={handleFigmaExtract} className="w-full">
                  <Figma className="mr-2 h-4 w-4" />
                  Extract from Figma
                </Button>
                {uploadStatus.figma && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    {sources.figma?.fields.length} fields extracted
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Excel Upload */}
            <FileUploadPanel
              title="DB Mapping (Excel)"
              description="Upload Excel with field-to-database mappings"
              acceptedTypes=".xlsx,.xls,.csv"
              icon={<FileSpreadsheet className="h-5 w-5 text-green-600" />}
              onFileUpload={handleExcelUpload}
              isUploaded={uploadStatus.excel}
            />

            {/* Validation Upload */}
            <FileUploadPanel
              title="Validation Rules"
              description="Upload validation rules document"
              acceptedTypes=".xlsx,.xls,.csv,.pdf"
              icon={<FileCheck className="h-5 w-5 text-blue-600" />}
              onFileUpload={handleValidationUpload}
              isUploaded={uploadStatus.validations}
            />

            {/* CTX XML Upload */}
            <FileUploadPanel
              title="CTX XML (Formulas)"
              description="Upload CTX XML with computed field formulas"
              acceptedTypes=".xml"
              icon={<FileCode2 className="h-5 w-5 text-orange-600" />}
              onFileUpload={handleCTXUpload}
              isUploaded={uploadStatus.ctxXml}
            />
          </div>

          {/* Upload Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${uploadStatus.figma ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Figma: {uploadStatus.figma ? sources.figma?.fields.length : 0} fields</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${uploadStatus.excel ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Excel: {uploadStatus.excel ? sources.excel?.length : 0} mappings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${uploadStatus.validations ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Validations: {uploadStatus.validations ? sources.validations?.length : 0} rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${uploadStatus.ctxXml ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">CTX XML: {uploadStatus.ctxXml ? sources.ctxXml?.length : 0} formulas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {/* Generation Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGenerateConfig} 
                disabled={!canGenerate || generating}
                size="lg"
                className="w-full"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                {generating ? 'Generating...' : 'Generate Config JSON'}
              </Button>

              {!canGenerate && (
                <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <span>Please upload at least Figma data to generate config</span>
                </div>
              )}

              {warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Warnings ({warnings.length})
                  </h4>
                  <ul className="text-sm space-y-1">
                    {warnings.map((warning, idx) => (
                      <li key={idx} className="text-amber-600">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedConfig && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Successfully generated {generatedConfig.length} fields and imported to {selectedPlanType} config!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Panel */}
          {generatedConfig && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Config Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-[600px]">
                  {JSON.stringify(generatedConfig, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}