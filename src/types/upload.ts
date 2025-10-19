import { ConfigJson } from './config';

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  fills?: any[];
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FigmaData {
  link: string;
  nodeId: string;
  fields: FigmaFieldExtract[];
}

export interface FigmaFieldExtract {
  label: string;
  type: string;
  placeholder?: string;
  helpText?: string;
  order: number;
  section?: string;
}

export interface ExcelMapping {
  fieldName: string;
  dbColumn: string;
  dataType: string;
  tableName?: string;
}

export interface ValidationRule {
  fieldName: string;
  type: string;
  message: string;
  value?: any;
}

export interface CTXFormula {
  fieldName: string;
  formula: string;
  dependencies?: string[];
}

export interface UploadedSources {
  figma?: FigmaData;
  excel?: ExcelMapping[];
  validations?: ValidationRule[];
  ctxXml?: CTXFormula[];
}

export interface GenerationStatus {
  status: 'idle' | 'processing' | 'complete' | 'error';
  message?: string;
  config?: ConfigJson;
  warnings?: string[];
}