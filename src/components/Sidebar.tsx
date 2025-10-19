import { useConfigStore } from '@/store/configStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlanType } from '@/types/config';
import { FileText } from 'lucide-react';

export function Sidebar() {
  const { planTypes, selectedPlanType, setSelectedPlanType, configs } = useConfigStore();

  return (
    <Card className="w-64 h-screen p-4 rounded-none border-r">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary mb-2">Plan Types</h2>
        <p className="text-xs text-muted-foreground">Select a plan to manage its config</p>
      </div>
      
      <div className="space-y-2">
        {planTypes.map((planType) => (
          <Button
            key={planType}
            variant={selectedPlanType === planType ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setSelectedPlanType(planType)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {planType}
            <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded">
              {configs[planType]?.length || 0}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
}