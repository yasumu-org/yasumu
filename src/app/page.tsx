import { ComingSoon } from '@/components/alerts/coming-soon';
import { GetStartedAction } from '@/components/cards/get-started-action';
import { Content } from '@/components/layout/content';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <Content>
      <h1 className="text-lg font-medium">Welcome to Yasumu!</h1>
      <p className="text-muted-foreground">Here are some things you can do:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4">
        <GetStartedAction
          title="API Testing"
          description="Get started by testing your REST API"
          action={
            <Link href="/api-testing">
              <Button>Get started</Button>
            </Link>
          }
        />
        <GetStartedAction
          title="SMTP Server"
          description="Spin up a fake SMTP server for testing"
          action={
            <Link href="/smtp">
              <Button>Get started</Button>
            </Link>
          }
        />
      </div>
    </Content>
  );
}
