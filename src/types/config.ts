export type FieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'dropdown' 
  | 'dynamicSelect' 
  | 'customSelect' 
  | 'checkbox';

export type PlanType = 'MEDICAL' | 'DENTAL' | 'VISION' | 'LIFE' | 'DISABILITY';

export interface ValidationRule {
  type: string;
  message: string;
  value?: any;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface ApiConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  value_key: string;
  label_key: string[];
  label_separator?: string;
  cache_duration?: number;
  timeout?: number;
}

export interface OutputTransform {
  enabled: boolean;
  output_field_path: string;
  transformation_type: string;
}

export interface UiConfig {
  label: string;
  placeholder?: string;
  help_text?: string;
  allow_search?: boolean;
  order: number;
}

export interface ScreenContext {
  screen: string;
  section: string;
  sub_section?: string;
  order: number;
  disabled?: boolean;
}

export interface Field {
  name: string;
  type: FieldType;
  ui_config: UiConfig;
  validation_rules: ValidationRule[];
  options?: DropdownOption[];
  api_config?: ApiConfig;
  output_transform?: OutputTransform;
  formula?: string;
  is_computed?: boolean;
}

export interface ConfigItem {
  _id: string;
  type: PlanType;
  subType: string;
  module: string;
  field: Field;
  screen_contexts: ScreenContext[];
}

export type ConfigJson = ConfigItem[];