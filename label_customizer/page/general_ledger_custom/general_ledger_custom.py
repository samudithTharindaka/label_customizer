# Copyright (c) 2024, Label Customizer and contributors
# License: MIT

import frappe
from frappe import _
import json


@frappe.whitelist()
def get_report_data(filters):
    """
    Get General Ledger data with custom filters
    """
    # Parse filters if string
    if isinstance(filters, str):
        filters = json.loads(filters)
    
    # Validate permissions
    if not frappe.has_permission('GL Entry', 'read'):
        frappe.throw(_("Insufficient Permission"), frappe.PermissionError)
    
    try:
        # Import original General Ledger report
        from erpnext.accounts.report.general_ledger.general_ledger import execute
        
        # Build filter dict for the standard report
        report_filters = {
            'company': filters.get('company'),
            'from_date': filters.get('from_date'),
            'to_date': filters.get('to_date'),
        }
        
        # Add optional filters
        if filters.get('account'):
            report_filters['account'] = filters.get('account')
        
        if filters.get('department'):
            report_filters['department'] = filters.get('department')
        
        if filters.get('project'):
            report_filters['project'] = filters.get('project')
        
        if filters.get('cost_center'):
            report_filters['cost_center'] = filters.get('cost_center')
        
        if filters.get('voucher_type'):
            report_filters['voucher_type'] = filters.get('voucher_type')
        
        # Execute the standard General Ledger report
        columns, data = execute(report_filters)
        
        # Return formatted response
        return {
            'columns': columns,
            'data': data,
            'message': _('Report generated successfully'),
            'filters_applied': report_filters
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("General Ledger Custom Page Error"))
        frappe.throw(_("Error generating report: {0}").format(str(e)))


@frappe.whitelist()
def export_to_excel(filters):
    """
    Export General Ledger data to Excel
    """
    # Parse filters if string
    if isinstance(filters, str):
        filters = json.loads(filters)
    
    # Validate permissions
    if not frappe.has_permission('GL Entry', 'read'):
        frappe.throw(_("Insufficient Permission"), frappe.PermissionError)
    
    try:
        from frappe.utils.xlsxutils import make_xlsx
        
        # Get report data
        result = get_report_data(filters)
        columns = result['columns']
        data = result['data']
        
        # Prepare data for Excel
        xlsx_data = []
        
        # Add headers
        headers = [col['label'] for col in columns]
        xlsx_data.append(headers)
        
        # Add rows
        for row in data:
            if isinstance(row, dict):
                row_data = [row.get(col['fieldname'], '') for col in columns]
                xlsx_data.append(row_data)
        
        # Create Excel file
        xlsx_file = make_xlsx(xlsx_data, "General Ledger Custom")
        
        # Set response
        frappe.response['filename'] = 'general_ledger_custom.xlsx'
        frappe.response['filecontent'] = xlsx_file.getvalue()
        frappe.response['type'] = 'binary'
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("General Ledger Export Error"))
        frappe.throw(_("Error exporting report: {0}").format(str(e)))


