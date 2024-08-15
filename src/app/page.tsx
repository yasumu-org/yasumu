import { Content } from '@/components/layout/content';
import { Separator } from '@/components/ui/separator';
import { YasumuWorkspace } from '@/components/workspaces/workspace';

export default function Page() {
  return (
    <Content>
      <h1 className="text-3xl font-bold">Welcome to Yasumu!</h1>
      <YasumuWorkspace />
    </Content>
  );
}
