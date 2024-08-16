'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComingSoon } from '../alerts/coming-soon';
import { useWorkspaceStore } from '@/stores/application/workspace.store';
import { WorkspaceRequired } from '../alerts/workspace-needed';

interface IProps {
  link?: string;
  icon: React.ReactNode;
  name: string;
  active?: boolean;
  comingSoon?: boolean;
  unchecked?: boolean;
}

function LinkWrapper({
  link,
  children,
  className,
  comingSoon,
  title,
  alertWorkspace,
}: {
  link?: string;
  children: React.ReactNode;
  className: string;
  comingSoon?: string;
  title: string;
  alertWorkspace?: boolean;
}) {
  if (alertWorkspace || comingSoon || !link) {
    const el = (
      <button className={className} title={title}>
        {children}
      </button>
    );

    if (alertWorkspace) return <WorkspaceRequired name={title}>{el}</WorkspaceRequired>;

    if (!comingSoon) return el;

    return <ComingSoon name={comingSoon}>{el}</ComingSoon>;
  }

  return (
    <Link href={link} className={className} title={title}>
      {children}
    </Link>
  );
}

export function SideNavMenu({ icon, name, link, active, comingSoon, unchecked }: IProps) {
  const { currentWorkspace } = useWorkspaceStore();
  const pathname = usePathname();
  const isActive = active ?? pathname === link;

  return (
    // <Tooltip delayDuration={0}>
    //   <TooltipTrigger asChild>
    <LinkWrapper
      link={link}
      alertWorkspace={!unchecked && !currentWorkspace}
      comingSoon={comingSoon ? name : undefined}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-white md:h-8 md:w-8',
        isActive && 'bg-accent text-accent-foreground',
      )}
      title={name}
    >
      {icon}
      <span className="sr-only">{name}</span>
    </LinkWrapper>
    //   </TooltipTrigger>
    //   <TooltipContent side="right">{name}</TooltipContent>
    // </Tooltip>
  );
}
