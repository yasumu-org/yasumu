export function Content({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col sm:py-4 sm:pl-14 min-h-screen">
      {children}
    </div>
  );
}
