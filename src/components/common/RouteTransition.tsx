'use client';

import { usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <>
      {children}
      <RouteLoadingOverlay key={pathname} />
    </>
  );
}

function RouteLoadingOverlay() {
  return (
    <div className="route-loading-overlay fixed inset-0 z-[100]">
      <LoadingScreen variant="route" />
    </div>
  );
}
