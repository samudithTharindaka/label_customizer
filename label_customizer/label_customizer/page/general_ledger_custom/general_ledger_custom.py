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


def rename_ar_ap_columns_to_gl_style(columns, party_type):
    """
    Rename and reorder Accounts Receivable/Payable columns to match General Ledger format
    This provides a consistent GL viewing experience for aging analysis
    
    Args:
        columns: List of column dictionaries from AR/AP report
        party_type: 'Customer' or 'Supplier'
    
    Returns:
        Modified columns list with renamed labels and GL-style ordering
    """
    if not columns or not party_type:
        return columns
    
    # Define field label mappings for General Ledger terminology
    if party_type == 'Customer':
        # For Receivables: Invoiced = Debit (increases receivable), Paid = Credit (decreases receivable)
        label_mappings = {
            'Invoiced Amount': 'Debit',
            'Paid Amount': 'Credit',
            'Outstanding Amount': 'Balance',
            'Credit Note': 'Credit',
            'Outstanding': 'Balance'
        }
    else:  # Supplier
        # For Payables: Invoiced = Credit (increases payable), Paid = Debit (decreases payable)
        label_mappings = {
            'Invoiced Amount': 'Credit',
            'Paid Amount': 'Debit',
            'Outstanding Amount': 'Balance',
            'Debit Note': 'Debit',
            'Outstanding': 'Balance'
        }
    
    # First pass: Apply label mappings and create a dictionary for easy lookup
    columns_dict = {}
    aging_columns = []
    
    for col in columns:
        if isinstance(col, dict):
            col_copy = col.copy()
            original_label = col_copy.get('label', '')
            fieldname = col_copy.get('fieldname', '')
            
            # Check if this label should be renamed
            if original_label in label_mappings:
                col_copy['label'] = label_mappings[original_label]
                col_copy['original_label'] = original_label
            
            # Identify aging bucket columns (range1, range2, etc. or labels like "0-30", "31-60")
            is_aging_bucket = (
                fieldname.startswith('range') or 
                (original_label and any(char.isdigit() for char in original_label) and '-' in original_label) or
                original_label.endswith('+') or
                'Above' in original_label
            )
            
            if is_aging_bucket:
                aging_columns.append(col_copy)
            else:
                columns_dict[fieldname] = col_copy
        else:
            # Keep non-dict columns as-is
            columns_dict[str(col)] = col
    
    # Define General Ledger column order
    # Standard GL order: Date, Account, Debit, Credit, Balance, Voucher info, Party, then aging
    gl_column_order = [
        'posting_date',      # Date
        'party',             # Party (Customer/Supplier)
        'voucher_type',      # Voucher Type
        'voucher_no',        # Voucher No
        'invoiced',          # Debit (for Customer) / Credit (for Supplier)
        'paid',              # Credit (for Customer) / Debit (for Supplier)
        'outstanding',       # Balance
        'due_date',          # Due Date
        'age',               # Age (days)
        'account',           # Account
        'cost_center',       # Cost Center
        'remarks',           # Remarks
        'currency',          # Currency
    ]
    
    # Build reordered columns list
    reordered_columns = []
    
    # Add columns in GL order
    for fieldname in gl_column_order:
        if fieldname in columns_dict:
            reordered_columns.append(columns_dict[fieldname])
            # Remove from dict so we don't add it twice
            del columns_dict[fieldname]
    
    # Add any remaining columns that weren't in our predefined order
    for fieldname, col in columns_dict.items():
        if isinstance(col, dict) and fieldname not in gl_column_order:
            reordered_columns.append(col)
    
    # Add aging bucket columns at the end
    reordered_columns.extend(aging_columns)
    
    return reordered_columns


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
    # Returns: columns, data, message, chart, report_summary, skip_total_row
    columns, data, message, chart, report_summary, skip_total_row = execute(report_filters)
    
    # Rename AR/AP column labels to General Ledger terminology
    columns = rename_ar_ap_columns_to_gl_style(columns, party_type)
    
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


def add_aging_columns_to_gl(columns, data, filters):
    """
    Add aging bucket columns to General Ledger data when aging filters are present
    """
    party_type = filters.get('party_type')
    
    # Fetch aging data
    aging_data_map = get_aging_data_map(filters)
    
    if not aging_data_map:
        return columns, data
    
    # Parse aging range to get bucket labels
    ageing_range = filters.get('ageing_range', '30, 60, 90, 120')
    ranges = [int(x.strip()) for x in ageing_range.split(',')]
    
    # Build aging column headers
    aging_columns = []
    previous = 0
    for r in ranges:
        aging_columns.append({
            'label': f'{previous}-{r}',
            'fieldname': f'age_{previous}_{r}',
            'fieldtype': 'Currency',
            'width': 100
        })
        previous = r
    # Add 120+ column
    aging_columns.append({
        'label': f'{previous}+',
        'fieldname': f'age_{previous}_plus',
        'fieldtype': 'Currency',
        'width': 100
    })
    
    # Add aging columns after Balance column
    balance_idx = None
    for idx, col in enumerate(columns):
        if col.get('fieldname') == 'balance':
            balance_idx = idx
            break
    
    if balance_idx is not None:
        # Insert aging columns after balance
        columns = columns[:balance_idx + 1] + aging_columns + columns[balance_idx + 1:]
    else:
        # Append at the end if balance column not found
        columns.extend(aging_columns)
    
    # Enrich data rows with aging values
    enriched_data = []
    for row in data:
        if isinstance(row, dict):
            # Try to match this GL entry with aging data
            voucher_no = row.get('voucher_no')
            party = row.get('party')
            
            # Create a unique key for matching
            match_key = f"{party}_{voucher_no}" if party and voucher_no else None
            
            if match_key and match_key in aging_data_map:
                aging_values = aging_data_map[match_key]
                # Add aging bucket values to the row
                for col in aging_columns:
                    row[col['fieldname']] = aging_values.get(col['fieldname'], 0)
            else:
                # No aging data for this row, set to None
                for col in aging_columns:
                    row[col['fieldname']] = None
        
        enriched_data.append(row)
    
    return columns, enriched_data


def get_aging_data_map(filters):
    """
    Fetch aging data and create a mapping of voucher_no -> aging buckets
    """
    try:
        party_type = filters.get('party_type')
        
        if party_type == 'Customer':
            from erpnext.accounts.report.accounts_receivable.accounts_receivable import execute
            account_type = 'Receivable'
        elif party_type == 'Supplier':
            from erpnext.accounts.report.accounts_payable.accounts_payable import execute
            account_type = 'Payable'
        else:
            return {}
        
        # Build aging report filters
        aging_filters = frappe._dict({
            'company': filters.get('company'),
            'report_date': filters.get('to_date'),  # Use to_date as report_date
            'ageing_based_on': filters.get('ageing_based_on', 'Due Date'),
            'range': filters.get('ageing_range', '30, 60, 90, 120'),
            'party_type': party_type,
            'account_type': account_type
        })
        
        # Add optional filters
        if filters.get('party'):
            aging_filters['party'] = filters.get('party')
        if filters.get('cost_center'):
            aging_filters['cost_center'] = filters.get('cost_center')
        
        # Execute aging report
        columns, data, message, chart, report_summary, skip_total_row = execute(aging_filters)
        
        # Parse aging range
        ageing_range = filters.get('ageing_range', '30, 60, 90, 120')
        ranges = [int(x.strip()) for x in ageing_range.split(',')]
        
        # Build mapping: party_voucher -> aging bucket values
        aging_map = {}
        
        for row in data:
            if isinstance(row, dict) and row.get('voucher_no'):
                party = row.get('party')
                voucher_no = row.get('voucher_no')
                match_key = f"{party}_{voucher_no}"
                
                # Extract aging bucket values
                aging_values = {}
                previous = 0
                col_idx = 0
                for r in ranges:
                    fieldname = f'age_{previous}_{r}'
                    # Try common field patterns from AR/AP reports
                    value = row.get(f'range{col_idx + 1}') or row.get(f'{previous}-{r}') or 0
                    aging_values[fieldname] = value
                    previous = r
                    col_idx += 1
                
                # Add 120+ column
                aging_values[f'age_{previous}_plus'] = row.get(f'range{col_idx + 1}') or row.get(f'{previous}+') or 0
                
                aging_map[match_key] = aging_values
        
        return aging_map
        
    except Exception as e:
        frappe.log_error(str(e), "Get Aging Data Map Error")
        return {}


def get_standard_gl_report(filters):
    """
    Get standard General Ledger report with optional aging columns
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
    
    # Check if aging columns should be added
    has_aging_filters = filters.get('ageing_based_on') or filters.get('ageing_range')
    party_type = filters.get('party_type')
    
    if has_aging_filters and party_type in ['Customer', 'Supplier']:
        # Enrich GL data with aging columns
        columns, data = add_aging_columns_to_gl(columns, data, filters)
    
    # Return formatted response
    return {
        'columns': columns,
        'data': data,
        'message': _('Report generated successfully'),
        'report_mode': 'standard',
        'filters_applied': report_filters,
        'has_aging_columns': has_aging_filters and party_type in ['Customer', 'Supplier']
    }


@frappe.whitelist()
def get_combined_aging_report(filters):
    """
    Get combined aging report showing both Receivables and Payables
    """
    # Parse filters if string
    if isinstance(filters, str):
        filters = json.loads(filters)
    
    # Validate permissions
    if not frappe.has_permission('GL Entry', 'read'):
        frappe.throw(_("Insufficient Permission"), frappe.PermissionError)
    
    try:
        from erpnext.accounts.report.accounts_receivable.accounts_receivable import execute as execute_receivable
        from erpnext.accounts.report.accounts_payable.accounts_payable import execute as execute_payable
        
        company = filters.get('company')
        report_date = filters.get('report_date')
        ageing_based_on = filters.get('ageing_based_on', 'Due Date')
        ageing_range = filters.get('ageing_range', '30, 60, 90, 120')
        
        # Build common filter dict
        base_filters = frappe._dict({
            'company': company,
            'report_date': report_date,
            'ageing_based_on': ageing_based_on,
            'range': ageing_range,
        })
        
        # Add optional filters
        if filters.get('cost_center'):
            base_filters['cost_center'] = filters.get('cost_center')
        
        # Initialize results
        rec_columns, rec_data, rec_summary = [], [], []
        pay_columns, pay_data, pay_summary = [], [], []
        rec_total = 0
        pay_total = 0
        
        # Get Receivables (Customer)
        receivable_filters = frappe._dict(base_filters.copy())
        receivable_filters['party_type'] = 'Customer'
        receivable_filters['account_type'] = 'Receivable'
        
        # Add customer filter if provided
        if filters.get('customer'):
            customer_list = filters.get('customer')
            if isinstance(customer_list, str):
                customer_list = [customer_list]
            receivable_filters['party'] = customer_list
        
        try:
            result = execute_receivable(receivable_filters)
            rec_columns = result[0] if len(result) > 0 else []
            rec_data = result[1] if len(result) > 1 else []
            rec_summary = result[4] if len(result) > 4 else []
            
            # Rename AR column labels to General Ledger terminology
            rec_columns = rename_ar_ap_columns_to_gl_style(rec_columns, 'Customer')
            
            # Calculate total from data (outstanding_amount field)
            for row in rec_data:
                if isinstance(row, dict) and row.get('outstanding'):
                    rec_total += float(row.get('outstanding') or 0)
        except Exception as e:
            frappe.log_error(str(e), "Combined Aging - Receivables Error")
        
        # Get Payables (Supplier)
        payable_filters = frappe._dict(base_filters.copy())
        payable_filters['party_type'] = 'Supplier'
        payable_filters['account_type'] = 'Payable'
        
        # Add supplier filter if provided
        if filters.get('supplier'):
            supplier_list = filters.get('supplier')
            if isinstance(supplier_list, str):
                supplier_list = [supplier_list]
            payable_filters['party'] = supplier_list
        
        try:
            result = execute_payable(payable_filters)
            pay_columns = result[0] if len(result) > 0 else []
            pay_data = result[1] if len(result) > 1 else []
            pay_summary = result[4] if len(result) > 4 else []
            
            # Rename AP column labels to General Ledger terminology
            pay_columns = rename_ar_ap_columns_to_gl_style(pay_columns, 'Supplier')
            
            # Calculate total from data (outstanding_amount field)
            for row in pay_data:
                if isinstance(row, dict) and row.get('outstanding'):
                    pay_total += float(row.get('outstanding') or 0)
        except Exception as e:
            frappe.log_error(str(e), "Combined Aging - Payables Error")
        
        return {
            'receivables': {
                'columns': rec_columns,
                'data': rec_data,
                'report_summary': rec_summary,
                'total': rec_total
            },
            'payables': {
                'columns': pay_columns,
                'data': pay_data,
                'report_summary': pay_summary,
                'total': pay_total
            },
            'message': _('Combined aging report generated successfully'),
            'report_mode': 'combined'
        }
        
    except Exception as e:
        error_message = str(e)
        traceback_str = frappe.get_traceback()
        frappe.log_error(traceback_str, _("Combined Aging Report Error"))
        
        return {
            'receivables': {'columns': [], 'data': [], 'report_summary': [], 'total': 0},
            'payables': {'columns': [], 'data': [], 'report_summary': [], 'total': 0},
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
