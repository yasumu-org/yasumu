import { ComingSoon } from '../alerts/coming-soon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface IProps {
  title: string;
  description: string;
  comingSoon?: boolean;
  action: React.ReactNode;
}

export function GetStartedAction({ action, description, title, comingSoon }: IProps) {
  const comp = (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{action}</CardContent>
    </Card>
  );

  if (!comingSoon) return comp;

  return <ComingSoon name={title}>{comp}</ComingSoon>;
}
