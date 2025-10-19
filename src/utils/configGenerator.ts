import { ConfigJson, ConfigItem, FieldType, PlanType } from '@/types/config';
import { UploadedSources } from '@/types/upload';
import { generateId } from '@/lib/utils';

export const generateConfigFromSources = (
  planType: PlanType,
  sources: UploadedSources
): { config: ConfigJson; warnings: string[] } => {
  const config: ConfigJson = [];
  const warnings: string[] = [];
  
  if (!sources.figma?.fields || sources.figma.fields.length === 0) {
    warnings.push('No Figma fields found. Please upload Figma data.');
    return { config, warnings };
  }
  
  sources.figma.fields.forEach((figmaField) => {
    const fieldName = figmaField.label.toLowerCase().replace(/\s+/g, '_');
    
    // Find DB mapping
    const dbMapping = sources.excel?.find(
      (m) => m.fieldName.toLowerCase() === fieldName
    );
    
    // Find validations
    const validations = sources.validations?.filter(
      (v) => v.fieldName.toLowerCase() === fieldName
    ) || [];
    
    // Find formula
    const formula = sources.ctxXml?.find(
      (f) => f.fieldName.toLowerCase() === fieldName
    );
    
    const configItem: ConfigItem = {
      _id: generateId(),
      type: planType,
      subType: 'field',
      module: 'CPQ',
      field: {
        name: fieldName,
        type: mapFigmaTypeToFieldType(figmaField.type),
        ui_config: {
          label: figmaField.label,
          placeholder: figmaField.placeholder || `Enter ${figmaField.label.toLowerCase()}`,
          help_text: figmaField.helpText,
          order: figmaField.order,
          allow_search: figmaField.type === 'dynamicSelect' || figmaField.type === 'customSelect',
        },
        validation_rules: validations.map((v) => ({
          type: v.type,
          message: v.message,
          value: v.value,
        })),
        options: [],
        is_computed: !!formula,
        formula: formula?.formula,
      },
      screen_contexts: [
        {
          screen: 'create',
          section: figmaField.section || 'planDetails',
          order: figmaField.order,
        },
        {
          screen: 'view',
          section: 'overview',
          sub_section: 'identifiersAndSetup',
          order: figmaField.order,
        },
        {
          screen: 'edit',
          section: 'overview',
          sub_section: 'identifiersAndSetup',
          order: figmaField.order,
          disabled: false,
        },
      ],
    };
    
    // Add DB mapping if available
    if (!dbMapping) {
      warnings.push(`No DB mapping found for field: ${figmaField.label}`);
    }
    
    config.push(configItem);
  });
  
  return { config, warnings };
};

const mapFigmaTypeToFieldType = (figmaType: string): FieldType => {
  const typeMap: Record<string, FieldType> = {
    text: 'text',
    number: 'number',
    date: 'date',
    dropdown: 'dropdown',
    select: 'customSelect',
    dynamicselect: 'dynamicSelect',
    customselect: 'customSelect',
    checkbox: 'checkbox',
  };
  
  return typeMap[figmaType.toLowerCase()] || 'text';
};