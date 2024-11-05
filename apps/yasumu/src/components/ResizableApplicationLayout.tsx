'use client';
import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { useLayout } from '@/stores/AppLayout';
import { YasumuLayout } from '@/lib/constants/layout';

export function ResizableApplicationLayout({
  bottom,
  left,
  right,
  id,
}: {
  id: string;
  left: React.ReactNode;
  right: React.ReactNode;
  bottom: React.ReactNode;
}) {
  const appLayout = useLayout();
  const direction = appLayout === YasumuLayout.Classic ? 'vertical' : 'horizontal';

  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId={`${id}:1`}>
      <ResizablePanel defaultSize={17} minSize={10}>
        {left}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ResizablePanelGroup direction={direction} autoSaveId={`${id}:2`}>
          <ResizablePanel>{right}</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>{bottom}</ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
