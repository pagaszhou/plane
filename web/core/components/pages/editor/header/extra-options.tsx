"use client";

import { observer } from "mobx-react";
import { CircleAlert } from "lucide-react";
// editor
import { EditorReadOnlyRefApi, EditorRefApi } from "@plane/editor";
// ui
import { ArchiveIcon, FavoriteStar, setToast, TOAST_TYPE, Tooltip } from "@plane/ui";
// components
import { LockedComponent } from "@/components/icons/locked-component";
import { PageInfoPopover, PageOptionsDropdown } from "@/components/pages";
// helpers
import { renderFormattedDate } from "@/helpers/date-time.helper";
// hooks
import useOnlineStatus from "@/hooks/use-online-status";
// store
import { IPage } from "@/store/pages/page";

type Props = {
  editorRef: React.RefObject<EditorRefApi>;
  handleDuplicatePage: () => void;
  hasConnectionFailed: boolean;
  page: IPage;
  readOnlyEditorRef: React.RefObject<EditorReadOnlyRefApi>;
};

export const PageExtraOptions: React.FC<Props> = observer((props) => {
  const { editorRef, handleDuplicatePage, hasConnectionFailed, page, readOnlyEditorRef } = props;
  // derived values
  const {
    archived_at,
    isContentEditable,
    is_favorite,
    is_locked,
    canCurrentUserFavoritePage,
    addToFavorites,
    removePageFromFavorites,
  } = page;
  // use online status
  const { isOnline } = useOnlineStatus();
  // favorite handler
  const handleFavorite = () => {
    if (is_favorite) {
      removePageFromFavorites().then(() =>
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Success!",
          message: "Page removed from favorites.",
        })
      );
    } else {
      addToFavorites().then(() =>
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Success!",
          message: "Page added to favorites.",
        })
      );
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      {is_locked && <LockedComponent />}
      {archived_at && (
        <div className="flex h-7 items-center gap-2 rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-medium text-blue-500">
          <ArchiveIcon className="flex-shrink-0 size-3" />
          <span>Archived at {renderFormattedDate(archived_at)}</span>
        </div>
      )}
      {isContentEditable && !isOnline && (
        <Tooltip
          tooltipHeading="You are offline"
          tooltipContent="All changes made will be saved locally and will be synced when the internet connection is re-established."
        >
          <div className="flex h-7 items-center gap-2 rounded-full bg-custom-background-80 px-3 py-0.5 text-xs font-medium text-custom-text-300">
            <span className="flex-shrink-0 size-1.5 rounded-full bg-custom-text-300" />
            <span>Offline</span>
          </div>
        </Tooltip>
      )}
      {hasConnectionFailed && isOnline && (
        <Tooltip
          tooltipHeading="Connection failed"
          tooltipContent="All changes made will be saved locally and will be synced when the connection is re-established."
        >
          <div className="flex h-7 items-center gap-2 rounded-full bg-red-500/20 px-3 py-0.5 text-xs font-medium text-red-500">
            <CircleAlert className="flex-shrink-0 size-3" />
            <span>Server error</span>
          </div>
        </Tooltip>
      )}
      {canCurrentUserFavoritePage && (
        <FavoriteStar selected={is_favorite} onClick={handleFavorite} iconClassName="text-custom-text-100" />
      )}
      <PageInfoPopover editorRef={isContentEditable ? editorRef.current : readOnlyEditorRef.current} />
      <PageOptionsDropdown
        editorRef={isContentEditable ? editorRef.current : readOnlyEditorRef.current}
        handleDuplicatePage={handleDuplicatePage}
        page={page}
      />
    </div>
  );
});
