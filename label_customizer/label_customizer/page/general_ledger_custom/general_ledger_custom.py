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
            result = get_standard_gl_report(filters)
            
            # Add helpful message if aging filters are set but aging mode didn't activate
            if filters.get('ageing_based_on') or filters.get('ageing_range'):
                if not filters.get('party_type'):
                    result['aging_note'] = _('Note: Aging filters are set but no Party Type is selected. Please select "Customer" for receivable aging or "Supplier" for payable aging.')
                elif filters.get('party_type') not in ['Customer', 'Supplier']:
                    result['aging_note'] = _('Note: Aging analysis is only available for Customer (receivable) or Supplier (payable) party types.')
                elif filters.get('account'):
                    result['aging_note'] = _('Note: The selected account is not a Receivable or Payable account. Aging analysis requires a Receivable or Payable account, or remove the account filter to show all.')
            
            return result
            
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
    2. AND Party Type is set (Customer or Supplier)
    
    Account filter is optional - if provided, will use that specific account
    If not provided, will show aging for all receivables (Customer) or payables (Supplier)
    """
    # Check if aging filters exist
    has_aging_filters = bool(filters.get('ageing_based_on') or filters.get('ageing_range'))
    
    if not has_aging_filters:
        return False
    
    # Check if Party Type is set (this determines receivable vs payable)
    party_type = filters.get('party_type')
    if not party_type or party_type not in ['Customer', 'Supplier']:
        return False
    
    # If account is provided, verify it's the right type
    account = filters.get('account')
    if account:
        # Parse account if it's a JSON string
        try:
            if isinstance(account, str) and account.startswith('['):
                account_list = json.loads(account)
                account = account_list[0] if account_list else None
            elif isinstance(account, list):
                account = account[0] if account else None
        except:
            pass
        
        if account:
            # Verify account type matches party type
            try:
                account_type = frappe.db.get_value('Account', account, 'account_type')
                expected_type = 'Receivable' if party_type == 'Customer' else 'Payable'
                return account_type == expected_type
            except:
                return False
    
    # No account specified but party type is valid - allow aging mode
    return True


def get_aged_receivable_payable_report(filters):
    """
    Get report with aging columns for receivable/payable accounts
    Works with or without specific account - uses Party Type to determine report type
    """
    # Determine party type
    party_type = filters.get('party_type')
    
    # Import appropriate report based on party type
    if party_type == 'Customer':
        from erpnext.accounts.report.accounts_receivable.accounts_receivable import execute
        account_type = 'Receivable'
    else:  # Supplier
        from erpnext.accounts.report.accounts_payable.accounts_payable import execute
        account_type = 'Payable'
    
    # Build filter dict for AR/AP report
    report_filters = frappe._dict({
        'company': filters.get('company'),
        'report_date': filters.get('to_date'),
        'ageing_based_on': filters.get('ageing_based_on', 'Due Date'),
        'range': filters.get('ageing_range', '30, 60, 90, 120'),
        'party_type': party_type,
        'account_type': account_type,
    })
    
    # Add optional filters
    if filters.get('party'):
        report_filters['party'] = [filters.get('party')] if isinstance(filters.get('party'), str) else filters.get('party')
    
    if filters.get('cost_center'):
        report_filters['cost_center'] = filters.get('cost_center')
    
    # Only add party_account if specific account is provided
    account = filters.get('account')
    if account:
        # Parse account if it's a JSON string
        try:
            if isinstance(account, str) and account.startswith('['):
                account_list = json.loads(account)
                account = account_list[0] if account_list else None
            elif isinstance(account, list):
                account = account[0] if account else None
        except:
            pass
        
        if account:
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


def convert_to_json_array(value):
    """
    Helper function to convert single values to JSON array format
    General Ledger report expects certain filters as JSON arrays
    """
    if not value:
        return None
    
    if isinstance(value, str):
        # If it's a string, convert to JSON array string
        return json.dumps([value])
    elif isinstance(value, list):
        # If it's already a list, convert to JSON string
        return json.dumps(value)
    else:
        return value


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
    
    # Add optional filters (convert to JSON arrays where needed)
    if filters.get('account'):
        report_filters['account'] = convert_to_json_array(filters.get('account'))
    
    if filters.get('department'):
        report_filters['department'] = filters.get('department')
    
    if filters.get('project'):
        report_filters['project'] = convert_to_json_array(filters.get('project'))
    
    if filters.get('cost_center'):
        report_filters['cost_center'] = convert_to_json_array(filters.get('cost_center'))
    
    if filters.get('voucher_type'):
        report_filters['voucher_type'] = filters.get('voucher_type')
    
    if filters.get('party_type'):
        report_filters['party_type'] = filters.get('party_type')
    
    if filters.get('party'):
        # Convert party string to JSON array format (General Ledger expects JSON array)
        report_filters['party'] = convert_to_json_array(filters.get('party'))
    
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


