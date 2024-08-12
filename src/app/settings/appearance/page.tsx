import { Separator } from '@/components/ui/separator';
import { AppearanceForm } from '../(components)/appearance/appearance-form';
import { Content } from '@/components/layout/content';

export default function Page() {
  return (
    <Content>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Appearance</h3>
          <p className="text-sm text-muted-foreground">Customize the appearance of the app.</p>
        </div>
        <Separator />
        <AppearanceForm />
      </div>
    </Content>
  );
}
