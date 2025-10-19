import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConfigJson, ConfigItem, PlanType } from '@/types/config';

interface ConfigStore {
  planTypes: PlanType[];
  configs: Record<PlanType, ConfigJson>;
  selectedPlanType: PlanType;
  
  setSelectedPlanType: (planType: PlanType) => void;
  addPlanType: (planType: PlanType) => void;
  
  addField: (planType: PlanType, field: ConfigItem) => void;
  updateField: (planType: PlanType, fieldId: string, field: ConfigItem) => void;
  deleteField: (planType: PlanType, fieldId: string) => void;
  
  importConfig: (planType: PlanType, config: ConfigJson) => void;
  exportConfig: (planType: PlanType) => ConfigJson;
  
  clearConfig: (planType: PlanType) => void;
}

const defaultPlanTypes: PlanType[] = ['MEDICAL', 'DENTAL', 'VISION', 'LIFE', 'DISABILITY'];

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      planTypes: defaultPlanTypes,
      configs: {
        MEDICAL: [],
        DENTAL: [],
        VISION: [],
        LIFE: [],
        DISABILITY: [],
      },
      selectedPlanType: 'MEDICAL',
      
      setSelectedPlanType: (planType) => set({ selectedPlanType: planType }),
      
      addPlanType: (planType) => set((state) => ({
        planTypes: [...state.planTypes, planType],
        configs: { ...state.configs, [planType]: [] },
      })),
      
      addField: (planType, field) => set((state) => ({
        configs: {
          ...state.configs,
          [planType]: [...state.configs[planType], field],
        },
      })),
      
      updateField: (planType, fieldId, field) => set((state) => ({
        configs: {
          ...state.configs,
          [planType]: state.configs[planType].map((f) =>
            f._id === fieldId ? field : f
          ),
        },
      })),
      
      deleteField: (planType, fieldId) => set((state) => ({
        configs: {
          ...state.configs,
          [planType]: state.configs[planType].filter((f) => f._id !== fieldId),
        },
      })),
      
      importConfig: (planType, config) => set((state) => ({
        configs: {
          ...state.configs,
          [planType]: config,
        },
      })),
      
      exportConfig: (planType) => get().configs[planType],
      
      clearConfig: (planType) => set((state) => ({
        configs: {
          ...state.configs,
          [planType]: [],
        },
      })),
    }),
    {
      name: 'config-builder-storage',
    }
  )
);