import { ConfigJson } from '@/types/config';

export const SAMPLE_JSON: ConfigJson = [
  {
    "_id": "68cadd4e51ce067e4a996adb",
    "type": "MEDICAL",
    "subType": "field",
    "module": "CPQ",
    "field": {
      "name": "carrier",
      "type": "dynamicSelect",
      "ui_config": {
        "label": "Carrier",
        "placeholder": "Select carrier",
        "help_text": "Choose the insurance carrier",
        "allow_search": true,
        "order": 2
      },
      "validation_rules": [
        {"type": "required", "message": "Carrier selection is required"}
      ],
      "options": [],
      "api_config": {
        "url": "/broker/carrier/v1/tenant/{tenantId}/carrier",
        "method": "GET",
        "headers": {
          "Authorization": "Bearer {token}",
          "Content-Type" : "application/json"
        },
        "params": {"benefitPlanType": "medical"},
        "value_key": "carrierId",
        "label_key": ["carrierName"],
        "label_separator": "",
        "cache_duration": 300,
        "timeout": 10
      },
      "output_transform": {
        "enabled": true,
        "output_field_path": "carrierId",
        "transformation_type": "plain_value"
      }
    },
    "screen_contexts": [
      {"screen": "create", "section": "planDetails", "order": 2},
      {"screen": "view", "section": "overview", "sub_section": "identifiersAndSetup", "order": 1},
      {"screen": "edit", "section": "overview", "order": 1, "disabled": true, "sub_section": "identifiersAndSetup"}
    ]
  },
  {
    "_id": "68cadd9651ce067e4a996adc",
    "type": "MEDICAL",
    "subType": "field",
    "module": "CPQ",
    "field": {
      "name": "planSubType",
      "type": "customSelect",
      "ui_config": {
        "label": "Plan Sub-Type",
        "placeholder": "Select plan sub-type",
        "order": 3
      },
      "validation_rules": [
        {"type": "required", "message": "Plan sub-type is required"}
      ],
      "options": [
        {"label": "HMO",  "value": "HMO" },
        {"label": "PPO",  "value": "PPO" },
        {"label": "HSA",  "value": "HSA" },
        {"label": "EPO",  "value": "EPO" },
        {"label": "POS",  "value": "POS" },
        {"label": "HDHP", "value": "HDHP"}
      ],
      "output_transform": {
        "enabled": true,
        "output_field_path": "type",
        "transformation_type": "plain_value"
      }
    },
    "screen_contexts": [
      {"screen": "create", "section": "planDetails", "order": 3},
      {"screen": "view", "section": "overview", "sub_section": "identifiersAndSetup", "order": 5},
      {"screen": "edit", "section": "overview", "order": 5, "disabled": true, "sub_section": "identifiersAndSetup"}
    ]
  },
  {
    "_id": "68caddf651ce067e4a996add",
    "type": "MEDICAL",
    "subType": "field",
    "module": "CPQ",
    "field": {
      "name": "planSize",
      "type": "customSelect",
      "ui_config": {
        "label": "Plan Size",
        "placeholder": "Select plan size",
        "order": 4
      },
      "validation_rules": [
        {"type": "required", "message": "Plan size is required"}
      ],
      "options": [
        {"label": "Large Group",            "value": "LARGE_GROUP"           },
        {"label": "Small Group Metal Tier", "value": "SMALL_GROUP_METAL_TIER"},
        {"label": "Small Group GM/GF",      "value": "SMALL_GROUP_GM_GF"     }
      ],
      "output_transform": {
        "enabled": true,
        "output_field_path": "planSize",
        "transformation_type": "plain_value"
      }
    },
    "screen_contexts": [
      {"screen": "create", "section": "planDetails", "order": 4},
      {"screen": "view", "section": "overview", "sub_section": "identifiersAndSetup", "order": 8},
      {"screen": "edit", "section": "overview", "order": 8, "disabled": false, "sub_section": "identifiersAndSetup"}
    ]
  }
];