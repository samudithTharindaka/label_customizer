# Label Customizer - Setup Complete ✅

## What Was Created

A clean, minimal Frappe app that changes the "Consider Accounting Dimensions" label to "Include Accounting Dimensions" in the General Ledger report.

## App Structure

```
label_customizer/
├── label_customizer/
│   ├── __init__.py
│   ├── hooks.py                    # Defines app_include_js hook
│   └── public/
│       └── js/
│           └── general_ledger_label.js  # JavaScript that modifies the label
├── pyproject.toml
└── README.md
```

## How It Works

### 1. Hooks Configuration (`hooks.py`)
```python
app_include_js = "/assets/label_customizer/js/general_ledger_label.js"
```
This tells Frappe to include our JavaScript file on every page.

### 2. JavaScript Override (`general_ledger_label.js`)
```javascript
$(document).on('app_ready', function() {
    setTimeout(function() {
        if (frappe.query_reports && frappe.query_reports["General Ledger"]) {
            let filters = frappe.query_reports["General Ledger"].filters;
            for (let i = 0; i < filters.length; i++) {
                if (filters[i].fieldname === "include_dimensions") {
                    filters[i].label = __("Include Accounting Dimensions");
                    break;
                }
            }
        }
    }, 500);
});
```

The code:
- Waits for the app to be ready
- Finds the General Ledger report filters
- Locates the `include_dimensions` filter
- Changes its label from "Consider Accounting Dimensions" to "Include Accounting Dimensions"

## Testing Instructions

1. **Open your browser** and navigate to your ERPNext site
2. **Open Developer Console** (F12)
3. **Navigate to**: Accounting → Reports → General Ledger
4. **Check the console** for these messages:
   - `Label Customizer: Loading...`
   - `Label Customizer: App ready`
   - `Label Customizer: Found General Ledger report`
   - `✅ Label Customizer: Changed label to 'Include Accounting Dimensions'`
5. **Look at the filters** - The checkbox should now say "Include Accounting Dimensions" instead of "Consider Accounting Dimensions"

## Advantages of This Approach

✅ **No core file modifications** - ERPNext files remain untouched
✅ **Clean separation** - All customizations in one app
✅ **Easy to maintain** - Simple JavaScript file
✅ **Version control friendly** - Can be tracked in Git
✅ **Survives updates** - Won't be overwritten when ERPNext updates
✅ **Easy to remove** - Just uninstall the app

## Troubleshooting

### If the label doesn't change:

1. **Hard refresh** the browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
2. **Check console** for error messages
3. **Verify app is installed**:
   ```bash
   bench --site dcode.com list-apps
   ```
4. **Rebuild and restart**:
   ```bash
   cd /home/samudith/frappe-bench
   bench build
   bench --site dcode.com clear-cache
   bench restart
   ```

## Extending This App

To change other labels or add more customizations:

1. Edit `label_customizer/public/js/general_ledger_label.js`
2. Add more label changes in the same pattern
3. Run `bench build && bench restart`

Example - to change another label:
```javascript
if (filters[i].fieldname === "party") {
    filters[i].label = __("Customer/Supplier");
}
```

## Installation Status

- ✅ App created
- ✅ App installed in bench
- ✅ App installed on site `dcode.com`
- ✅ Assets built and linked
- ✅ Ready to test!

## Next Steps

1. Open the General Ledger report in your browser
2. Verify the label has changed
3. If you want to customize more labels, edit the JavaScript file
4. Enjoy your customized ERPNext! 🎉





