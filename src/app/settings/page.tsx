import { Content } from '@/components/layout/content';
import { Separator } from '@/components/ui/separator';
import { GeneralForm } from './(components)/general/general-form';

export default function Page() {
  return (
    <Content>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">General</h3>
          <p className="text-sm text-muted-foreground">
            Update your general settings.
          </p>
        </div>
        <Separator />
        <GeneralForm />
      </div>
    </Content>
  );
}
