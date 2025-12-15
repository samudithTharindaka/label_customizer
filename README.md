# Label Customizer

A simple Frappe app that customizes labels in ERPNext reports without modifying core files.

## Features

- Changes the "Consider Accounting Dimensions" label to "Include Accounting Dimensions" in the General Ledger report
- Uses hooks to override labels without touching ERPNext core files
- Clean, maintainable approach using JavaScript injection

## Installation

```bash
cd frappe-bench
bench get-app label_customizer
bench --site [your-site] install-app label_customizer
bench build
bench restart
```

## How It Works

The app uses the `app_include_js` hook to inject a JavaScript file that:
1. Waits for the General Ledger report to load
2. Finds the filter with fieldname `include_dimensions`
3. Changes its label from "Consider Accounting Dimensions" to "Include Accounting Dimensions"

## Customization

To change other labels, edit:
- `label_customizer/public/js/general_ledger_label.js`

Then run:
```bash
bench build
bench restart
```

## License

MIT


