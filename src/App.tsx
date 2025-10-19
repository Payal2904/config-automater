import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { FieldEditor } from './components/FieldEditor';
import { AutomatedGenerator } from './components/AutomatedGenerator';
import { JSONPreview } from './components/JSONPreview';
import { Button } from './components/ui/button';
import { Wand2, Edit3 } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<'automated' | 'manual'>('automated');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mode Toggle */}
        <div className="border-b p-4 bg-card">
          <div className="flex items-center gap-2">
            <Button
              variant={mode === 'automated' ? 'default' : 'outline'}
              onClick={() => setMode('automated')}
              size="sm"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Automated Generator
            </Button>
            <Button
              variant={mode === 'manual' ? 'default' : 'outline'}
              onClick={() => setMode('manual')}
              size="sm"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Manual Editor
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto">
            {mode === 'automated' ? <AutomatedGenerator /> : <FieldEditor />}
          </div>
          <div className="w-[500px] border-l overflow-hidden">
            <JSONPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;