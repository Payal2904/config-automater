import * as XLSX from 'xlsx';
import { parseString } from 'xml2js';
import { ExcelMapping, ValidationRule, CTXFormula, FigmaFieldExtract } from '@/types/upload';

/**
 * Parse Excel file for DB mappings
 */
export const parseExcelMapping = async (file: File): Promise<ExcelMapping[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<any>(firstSheet);
        
        const mappings: ExcelMapping[] = jsonData.map((row) => ({
          fieldName: row.field_name || row.fieldName || row.name || '',
          dbColumn: row.db_column || row.dbColumn || row.column || '',
          dataType: row.data_type || row.dataType || row.type || 'string',
          tableName: row.table_name || row.tableName || row.table,
        }));
        
        resolve(mappings);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parse validation document (Excel or CSV)
 */
export const parseValidationDoc = async (file: File): Promise<ValidationRule[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<any>(firstSheet);
        
        const rules: ValidationRule[] = jsonData.map((row) => ({
          fieldName: row.field_name || row.fieldName || row.field || '',
          type: row.validation_type || row.type || 'required',
          message: row.message || row.error_message || 'Validation failed',
          value: row.value || row.constraint,
        }));
        
        resolve(rules);
      } catch (error) {
        reject(new Error('Failed to parse validation document: ' + error));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parse CTX XML for formulas
 */
export const parseCTXXml = async (file: File): Promise<CTXFormula[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const xmlContent = e.target?.result as string;
      
      parseString(xmlContent, (err, result) => {
        if (err) {
          reject(new Error('Failed to parse XML: ' + err));
          return;
        }
        
        try {
          const formulas: CTXFormula[] = [];
          
          // Navigate through XML structure to find formulas
          // This is a simplified example - adjust based on your actual CTX XML structure
          if (result.root?.field) {
            result.root.field.forEach((field: any) => {
              if (field.formula) {
                formulas.push({
                  fieldName: field.$.name || '',
                  formula: field.formula[0] || '',
                  dependencies: field.dependencies?.[0]?.split(',') || [],
                });
              }
            });
          }
          
          resolve(formulas);
        } catch (error) {
          reject(new Error('Failed to extract formulas from XML: ' + error));
        }
      });
    };
    
    reader.onerror = () => reject(new Error('Failed to read XML file'));
    reader.readAsText(file);
  });
};

/**
 * Fetch and parse Figma data
 */
export const parseFigmaNode = async (
  figmaLink: string,
  nodeId: string,
  accessToken?: string
): Promise<FigmaFieldExtract[]> => {
  // Extract file key from Figma link
  const fileKeyMatch = figmaLink.match(/file\/([a-zA-Z0-9]+)/);
  if (!fileKeyMatch) {
    throw new Error('Invalid Figma link format');
  }
  
  const fileKey = fileKeyMatch[1];
  
  if (!accessToken) {
    // For demo purposes, return mock data
    return mockFigmaExtraction();
  }
  
  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`,
      {
        headers: {
          'X-Figma-Token': accessToken,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Figma data');
    }
    
    const data = await response.json();
    return extractFieldsFromFigmaNode(data.nodes[nodeId]);
  } catch (error) {
    throw new Error('Figma API error: ' + error);
  }
};

/**
 * Extract field information from Figma node
 */
const extractFieldsFromFigmaNode = (node: any): FigmaFieldExtract[] => {
  const fields: FigmaFieldExtract[] = [];
  let order = 1;
  
  const traverse = (currentNode: any, section?: string) => {
    if (currentNode.type === 'TEXT') {
      const text = currentNode.characters || '';
      
      // Heuristic: if it looks like a label (ends with :, or is capitalized)
      if (text.endsWith(':') || /^[A-Z]/.test(text)) {
        fields.push({
          label: text.replace(':', '').trim(),
          type: 'text', // default, can be enhanced
          order: order++,
          section: section || 'default',
        });
      }
    }
    
    if (currentNode.children) {
      currentNode.children.forEach((child: any) => {
        traverse(child, currentNode.name);
      });
    }
  };
  
  traverse(node.document || node);
  return fields;
};

/**
 * Mock Figma data for demo/testing
 */
const mockFigmaExtraction = (): FigmaFieldExtract[] => {
  return [
    {
      label: 'Carrier',
      type: 'dynamicSelect',
      placeholder: 'Select carrier',
      helpText: 'Choose the insurance carrier',
      order: 1,
      section: 'planDetails',
    },
    {
      label: 'Plan Sub-Type',
      type: 'customSelect',
      placeholder: 'Select plan sub-type',
      order: 2,
      section: 'planDetails',
    },
    {
      label: 'Plan Size',
      type: 'customSelect',
      placeholder: 'Select plan size',
      order: 3,
      section: 'planDetails',
    },
  ];
};