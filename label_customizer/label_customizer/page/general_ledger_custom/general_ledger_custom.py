# Copyright (c) 2024, Label Customizer and contributors
# License: MIT

import frappe
from frappe import _
import json


@frappe.whitelist()
def get_report_data(filters):
    """
    Get General Ledger data with custom filters and optional aging support
    """
    # Parse filters if string
    if isinstance(filters, str):
        filters = json.loads(filters)
    
    # Validate permissions
    if not frappe.has_permission('GL Entry', 'read'):
        frappe.throw(_("Insufficient Permission"), frappe.PermissionError)
    
    try:
        # Detect if aging mode should be activated
        use_aging_mode = should_use_aging_mode(filters)
        
        if use_aging_mode:
            # Use aging report
            return get_aged_receivable_payable_report(filters)
        else:
            # Use standard GL report (no changes to this path)
            return get_standard_gl_report(filters)
            
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


def should_use_aging_mode(filters):
    """
    Determine if aging mode should be activated based on filters
    Returns True if:
    1. Aging filters are provided (ageing_based_on or ageing_range)
    2. AND account is specified
    3. AND account is Receivable or Payable type
    """
    # Check if aging filters exist
    has_aging_filters = bool(filters.get('ageing_based_on') or filters.get('ageing_range'))
    
    if not has_aging_filters:
        return False
    
    # Check if account filter exists
    account = filters.get('account')
    if not account:
        return False
    
    # Check account type
    try:
        account_type = frappe.db.get_value('Account', account, 'account_type')
        return account_type in ['Receivable', 'Payable']
    except:
        return False


def get_aged_receivable_payable_report(filters):
    """
    Get report with aging columns for receivable/payable accounts
    """
    # Determine account type
    account = filters.get('account')
    account_type = frappe.db.get_value('Account', account, 'account_type')
    
    # Import appropriate report
    if account_type == 'Receivable':
        from erpnext.accounts.report.accounts_receivable.accounts_receivable import execute
        default_party_type = 'Customer'
    else:  # Payable
        from erpnext.accounts.report.accounts_payable.accounts_payable import execute
        default_party_type = 'Supplier'
    
    # Build filter dict for AR/AP report
    report_filters = frappe._dict({
        'company': filters.get('company'),
        'report_date': filters.get('to_date'),
        'ageing_based_on': filters.get('ageing_based_on', 'Due Date'),
        'range': filters.get('ageing_range', '30, 60, 90, 120'),
        'party_type': filters.get('party_type') or default_party_type,
        'account_type': account_type,
    })
    
    # Add optional filters
    if filters.get('party'):
        report_filters['party'] = [filters.get('party')] if isinstance(filters.get('party'), str) else filters.get('party')
    
    if filters.get('cost_center'):
        report_filters['cost_center'] = filters.get('cost_center')
    
    if filters.get('party_account'):
        report_filters['party_account'] = filters.get('party_account')
    else:
        report_filters['party_account'] = account
    
    if filters.get('calculate_ageing_with'):
        report_filters['calculate_ageing_with'] = filters.get('calculate_ageing_with')
    
    # Execute AR/AP report
    columns, data = execute(report_filters)
    
    return {
        'columns': columns,
        'data': data,
        'message': _('Aged report generated successfully'),
        'report_mode': 'aging',
        'filters_applied': report_filters
    }


def get_standard_gl_report(filters):
    """
    Get standard General Ledger report (existing logic preserved)
    """
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
        report_filters['categorize_by'] = filters.get('group_by')
    
    if filters.get('include_dimensions'):
        report_filters['include_dimensions'] = int(filters.get('include_dimensions', 0))
    
    if filters.get('show_opening_entries'):
        report_filters['show_opening_entries'] = filters.get('show_opening_entries')
    
    if filters.get('show_cancelled_entries'):
        report_filters['show_cancelled_entries'] = int(filters.get('show_cancelled_entries', 0))
    
    if filters.get('include_default_book_entries'):
        report_filters['include_default_book_entries'] = int(filters.get('include_default_book_entries', 0))
    
    # Convert to frappe._dict for attribute-style access
    report_filters = frappe._dict(report_filters)
    
    # Execute the standard General Ledger report
    columns, data = execute(report_filters)
    
    # Return formatted response
    return {
        'columns': columns,
        'data': data,
        'message': _('Report generated successfully'),
        'report_mode': 'standard',
        'filters_applied': report_filters
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


