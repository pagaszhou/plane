"use client";

import { useEffect, useRef } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { observer } from "mobx-react";
// components
import { NotAuthorizedView } from "@/components/auth-screens";
import { PageHead } from "@/components/core";
import { ProjectSettingsLabelList } from "@/components/labels";
// hooks
import { useProject, useUser } from "@/hooks/store";

const LabelsSettingsPage = observer(() => {
  // store hooks
  const { currentProjectDetails } = useProject();
  const {
    canPerformProjectMemberActions,
    membership: { currentProjectRole },
  } = useUser();
  const pageTitle = currentProjectDetails?.name ? `${currentProjectDetails?.name} - Labels` : undefined;

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

  // Enable Auto Scroll for Labels list
  useEffect(() => {
    const element = scrollableContainerRef.current;

    if (!element) return;

    return combine(
      autoScrollForElements({
        element,
      })
    );
  }, [scrollableContainerRef?.current]);

  if (currentProjectRole && !canPerformProjectMemberActions) {
    return <NotAuthorizedView section="settings" isProjectView />;
  }

  return (
    <>
      <PageHead title={pageTitle} />
      <div ref={scrollableContainerRef} className="h-full w-full gap-10 overflow-y-auto py-2 pr-9">
        <ProjectSettingsLabelList />
      </div>
    </>
  );
});

export default LabelsSettingsPage;
