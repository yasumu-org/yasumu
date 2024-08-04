import { Content } from '@/components/layout/content';
import { YasumuWorkspace } from '@/components/workspaces/workspace';

export default function Page() {
  return (
    <Content>
      <h1 className="text-lg font-medium">Welcome to Yasumu!</h1>
      <YasumuWorkspace />
    </Content>
  );
}
