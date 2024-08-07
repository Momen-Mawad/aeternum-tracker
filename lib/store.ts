import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Activity, activities } from "./activities";
import { createWithEqualityFn } from 'zustand/traditional';

export const useActivitiesStore = create(
  persist<{
    customActivities: Activity[];
    addCustomActivity: (activity: Activity) => void;
    removeCustomActivity: (title: string) => void;
    restoreDefaultActivities: () => void;
    progress: Record<string, number>;
    resetProgress: (frequently: Activity["frequently"]) => void;
    setProgress: (activity: string, progress: number) => void;
    openCategories: string[];
    setOpenCategories: (categories: string[]) => void;
    characterName: string;
    setCharacterName: (name: string) => void;
  }>(
    (set, get) => ({
      customActivities: activities,
      addCustomActivity: (activity) =>
        set({
          customActivities: [...get().customActivities, activity],
        }),
      removeCustomActivity: (title) =>
        set({
          customActivities: get().customActivities.filter(
            (a) => a.title !== title
          ),
        }),
      restoreDefaultActivities: () =>
        set({
          customActivities: activities,
          openCategories: [
            ...new Set(activities.map((activity) => activity.category)),
          ],
        }),
      progress: {},
      resetProgress: (frequently) =>
        set({
          progress: Object.fromEntries(
            Object.entries(get().progress).map(([activity, progress]) => [
              activity,
              [...activities, ...get().customActivities].find(
                (a) => a.title === activity
              )?.frequently === frequently
                ? 0
                : progress,
            ])
          ),
        }),
      setProgress: (activity, progress) =>
        set({
          progress: {
            ...get().progress,
            [activity]: progress,
          },
        }),
      openCategories: [
        ...new Set(activities.map((activity) => activity.category)),
      ],
      setOpenCategories: (categories) =>
        set({
          openCategories: categories,
        }),
      characterName: "",
      setCharacterName: (name) =>
        set({
          characterName: name,
        }),
    }),
    {
      name: "activities-storage",
    }
  )
);

export const useSettingsStore = create(
  persist<{
    hiddenCategories: string[];
    toggleHiddenCategory: (category: string) => void;
  }>(
    (set, get) => ({
      hiddenCategories: [],
      toggleHiddenCategory: (category) =>
        set({
          hiddenCategories: get().hiddenCategories.includes(category)
            ? get().hiddenCategories.filter((c) => c !== category)
            : [...get().hiddenCategories, category],
        }),
    }),
    {
      name: "settings-storage",
    }
  )
);
