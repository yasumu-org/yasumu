import { Separator } from '@/components/ui/separator';
import { Content } from '@/components/layout/content';
import EnvironmentSelector from './(components)/selector';

export default function Page() {
  return (
    <Content>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Environments</h3>
          <p className="text-sm text-muted-foreground">Manage environments of the workspace.</p>
        </div>
        <Separator />
        <EnvironmentSelector />
      </div>
    </Content>
  );
}
