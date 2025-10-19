import { useState } from 'react';
import { useConfigStore } from '@/store/configStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Trash2, Upload, Search, Edit } from 'lucide-react';
import { ConfigItem, FieldType, ValidationRule, DropdownOption, ScreenContext } from '@/types/config';
import { generateId } from '@/lib/utils';
import { SampleJsonModal } from './SampleJsonModal';

export function FieldEditor() {
  const { selectedPlanType, configs, addField, updateField, deleteField, importConfig } = useConfigStore();
  const currentConfig = configs[selectedPlanType] || [];
  
  const [editingField, setEditingField] = useState<ConfigItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const emptyField: ConfigItem = {
    _id: generateId(),
    type: selectedPlanType,
    subType: 'field',
    module: 'CPQ',
    field: {
      name: '',
      type: 'text',
      ui_config: {
        label: '',
        placeholder: '',
        order: currentConfig.length + 1,
      },
      validation_rules: [],
      options: [],
    },
    screen_contexts: [
      { screen: 'create', section: 'planDetails', order: 1 },
    ],
  };

  const [formData, setFormData] = useState<ConfigItem>(emptyField);

  const handleSave = () => {
    if (editingField) {
      updateField(selectedPlanType, editingField._id, formData);
    } else {
      addField(selectedPlanType, formData);
    }
    resetForm();
  };

  const handleEdit = (field: ConfigItem) => {
    setEditingField(field);
    setFormData(field);
    setShowForm(true);
  };

  const handleDelete = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      deleteField(selectedPlanType, fieldId);
    }
  };

  const resetForm = () => {
    setFormData({ ...emptyField, _id: generateId() });
    setEditingField(null);
    setShowForm(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          importConfig(selectedPlanType, json);
          alert('Config imported successfully!');
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const filteredConfig = currentConfig.filter((item) =>
    item.field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.field.ui_config.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{selectedPlanType} Config Builder</h1>
          <p className="text-muted-foreground mt-1">Manage field configurations for {selectedPlanType.toLowerCase()} plans</p>
        </div>
        <div className="flex gap-2">
          <SampleJsonModal />
          <Button variant="outline" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import JSON
          </Button>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search fields by name or label..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Field Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingField ? 'Edit Field' : 'Add New Field'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="api">API Config</TabsTrigger>
                <TabsTrigger value="screen">Screen Context</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Field Name *</Label>
                    <Input
                      value={formData.field.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        field: { ...formData.field, name: e.target.value }
                      })}
                      placeholder="e.g., carrier"
                    />
                  </div>
                  <div>
                    <Label>Label *</Label>
                    <Input
                      value={formData.field.ui_config.label}
                      onChange={(e) => setFormData({
                        ...formData,
                        field: {
                          ...formData.field,
                          ui_config: { ...formData.field.ui_config, label: e.target.value }
                        }
                      })}
                      placeholder="e.g., Carrier"
                    />
                  </div>
                  <div>
                    <Label>Field Type *</Label>
                    <Select
                      value={formData.field.type}
                      onValueChange={(value: FieldType) => setFormData({
                        ...formData,
                        field: { ...formData.field, type: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="customSelect">Custom Select</SelectItem>
                        <SelectItem value="dynamicSelect">Dynamic Select</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={formData.field.ui_config.order}
                      onChange={(e) => setFormData({
                        ...formData,
                        field: {
                          ...formData.field,
                          ui_config: { ...formData.field.ui_config, order: parseInt(e.target.value) || 0 }
                        }
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Placeholder</Label>
                    <Input
                      value={formData.field.ui_config.placeholder || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        field: {
                          ...formData.field,
                          ui_config: { ...formData.field.ui_config, placeholder: e.target.value }
                        }
                      })}
                      placeholder="e.g., Select carrier"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Help Text</Label>
                    <Input
                      value={formData.field.ui_config.help_text || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        field: {
                          ...formData.field,
                          ui_config: { ...formData.field.ui_config, help_text: e.target.value }
                        }
                      })}
                      placeholder="e.g., Choose the insurance carrier"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.field.ui_config.allow_search || false}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        field: {
                          ...formData.field,
                          ui_config: { ...formData.field.ui_config, allow_search: checked }
                        }
                      })}
                    />
                    <Label>Allow Search</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.field.is_computed || false}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        field: { ...formData.field, is_computed: checked }
                      })}
                    />
                    <Label>Is Computed</Label>
                  </div>
                  {formData.field.is_computed && (
                    <div className="col-span-2">
                      <Label>Formula</Label>
                      <Textarea
                        value={formData.field.formula || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          field: { ...formData.field, formula: e.target.value }
                        })}
                        placeholder="Enter formula..."
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="validation" className="space-y-4">
                <div>
                  <Label>Validation Rules (JSON Array)</Label>
                  <Textarea
                    value={JSON.stringify(formData.field.validation_rules, null, 2)}
                    onChange={(e) => {
                      try {
                        const rules = JSON.parse(e.target.value);
                        setFormData({
                          ...formData,
                          field: { ...formData.field, validation_rules: rules }
                        });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='[{"type": "required", "message": "This field is required"}]'
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="options" className="space-y-4">
                <div>
                  <Label>Dropdown Options (JSON Array)</Label>
                  <Textarea
                    value={JSON.stringify(formData.field.options || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const options = JSON.parse(e.target.value);
                        setFormData({
                          ...formData,
                          field: { ...formData.field, options }
                        });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='[{"label": "Option 1", "value": "opt1"}]'
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <div>
                  <Label>API Configuration (JSON Object)</Label>
                  <Textarea
                    value={JSON.stringify(formData.field.api_config || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const apiConfig = JSON.parse(e.target.value);
                        setFormData({
                          ...formData,
                          field: { ...formData.field, api_config: apiConfig }
                        });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{"url": "/api/endpoint", "method": "GET", "value_key": "id", "label_key": ["name"]}'
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                <div>
                  <Label>Output Transform (JSON Object)</Label>
                  <Textarea
                    value={JSON.stringify(formData.field.output_transform || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const outputTransform = JSON.parse(e.target.value);
                        setFormData({
                          ...formData,
                          field: { ...formData.field, output_transform: outputTransform }
                        });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{"enabled": true, "output_field_path": "fieldId", "transformation_type": "plain_value"}'
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="screen" className="space-y-4">
                <div>
                  <Label>Screen Contexts (JSON Array)</Label>
                  <Textarea
                    value={JSON.stringify(formData.screen_contexts, null, 2)}
                    onChange={(e) => {
                      try {
                        const screenContexts = JSON.parse(e.target.value);
                        setFormData({ ...formData, screen_contexts: screenContexts });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='[{"screen": "create", "section": "planDetails", "order": 1}]'
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                {editingField ? 'Update Field' : 'Save Field'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fields List */}
      <div className="grid gap-4">
        {filteredConfig.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'No fields match your search.' : 'No fields configured yet. Click "Add Field" to get started.'}
            </p>
          </Card>
        ) : (
          filteredConfig.map((field) => (
            <Card key={field._id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{field.field.ui_config.label}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {field.field.type}
                      </span>
                      {field.field.validation_rules.some(r => r.type === 'required') && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Name:</strong> {field.field.name} | <strong>Order:</strong> {field.field.ui_config.order}
                    </p>
                    {field.field.ui_config.help_text && (
                      <p className="text-sm text-muted-foreground mt-1">{field.field.ui_config.help_text}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(field)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(field._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}