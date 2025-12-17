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
        
        if filters.get('party_type'):
            report_filters['party_type'] = filters.get('party_type')
        
        if filters.get('party'):
            report_filters['party'] = filters.get('party')
        
        if filters.get('group_by'):
            report_filters['group_by'] = filters.get('group_by')
        
        if filters.get('include_dimensions'):
            report_filters['include_dimensions'] = int(filters.get('include_dimensions', 0))
        
        if filters.get('show_opening_entries'):
            report_filters['show_opening_entries'] = filters.get('show_opening_entries')
        
        if filters.get('show_cancelled_entries'):
            report_filters['show_cancelled_entries'] = int(filters.get('show_cancelled_entries', 0))
        
        if filters.get('include_default_book_entries'):
            report_filters['include_default_book_entries'] = int(filters.get('include_default_book_entries', 0))
        
        # Add aging filters (Note: General Ledger doesn't natively support aging,
        # but we pass them through for potential custom implementations)
        if filters.get('ageing_based_on'):
            report_filters['ageing_based_on'] = filters.get('ageing_based_on')
        
        if filters.get('calculate_ageing_with'):
            report_filters['report_date'] = filters.get('to_date')  # Use to_date as report_date for aging
        
        if filters.get('ageing_range'):
            report_filters['range'] = filters.get('ageing_range')
        
        # Convert to frappe._dict for attribute-style access
        report_filters = frappe._dict(report_filters)
        
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
        error_message = str(e)
        traceback_str = frappe.get_traceback()
        frappe.log_error(traceback_str, _("General Ledger Custom Page Error"))
        
        # Return detailed error for debugging
        return {
            'columns': [],
            'data': [],
            'error': True,
            'message': error_message,
            'traceback': traceback_str if frappe.conf.developer_mode else None
        }


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


