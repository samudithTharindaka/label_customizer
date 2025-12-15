// Copyright (c) 2024, Label Customizer and contributors
// License: MIT

$(document).ready(function() {
    console.log('General Ledger Custom Page Loaded');
    
    // Handle form submission
    $('#custom-filter-form').on('submit', function(e) {
        e.preventDefault();
        loadReport();
    });
    
    // Handle company change
    $('#company').on('change', function() {
        const company = $(this).val();
        if (company) {
            loadDepartments(company);
            loadProjects(company);
            loadCostCenters(company);
        }
    });
});

function loadReport() {
    const filters = {
        company: $('#company').val(),
        from_date: $('#from_date').val(),
        to_date: $('#to_date').val(),
        custom_department: $('#custom_department').val(),
        custom_project: $('#custom_project').val(),
        custom_cost_center: $('#custom_cost_center').val(),
        custom_status: $('#custom_status').val()
    };
    
    // Validate required fields
    if (!filters.company || !filters.from_date || !filters.to_date) {
        frappe.msgprint(__('Please fill all required fields'));
        return;
    }
    
    // Show loading
    $('#report-content').html('<div class="text-center"><p>Loading report...</p><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>');
    
    // Call API to get report data
    frappe.call({
        method: 'label_customizer.www.reports.general_ledger.index.get_report_data',
        args: {
            filters: filters
        },
        callback: function(r) {
            if (r.message) {
                renderReport(r.message);
            }
        },
        error: function(r) {
            $('#report-content').html(
                '<div class="alert alert-danger">Error loading report. Please try again.</div>'
            );
        }
    });
}

function renderReport(data) {
    const columns = data.columns;
    const rows = data.data;
    
    if (!rows || rows.length === 0) {
        $('#report-content').html(
            '<div class="alert alert-info">No data found for the selected filters.</div>'
        );
        return;
    }
    
    // Build table HTML
    let html = '<div class="table-responsive"><table class="table table-bordered table-hover">';
    
    // Table header
    html += '<thead class="table-light"><tr>';
    columns.forEach(col => {
        html += `<th>${col.label}</th>`;
    });
    html += '</tr></thead>';
    
    // Table body
    html += '<tbody>';
    rows.forEach(row => {
        if (typeof row === 'object' && !Array.isArray(row)) {
            html += '<tr>';
            columns.forEach(col => {
                let value = row[col.fieldname] || '';
                
                // Format numbers
                if (col.fieldtype === 'Currency' || col.fieldtype === 'Float') {
                    value = formatCurrency(value);
                    
                    // Highlight large amounts
                    if (col.fieldname === 'debit' && parseFloat(value.replace(/,/g, '')) > 100000) {
                        value = `<span style="color: red; font-weight: bold;">${value}</span>`;
                    } else if (col.fieldname === 'credit' && parseFloat(value.replace(/,/g, '')) > 100000) {
                        value = `<span style="color: green; font-weight: bold;">${value}</span>`;
                    }
                }
                
                html += `<td>${value}</td>`;
            });
            html += '</tr>';
        }
    });
    html += '</tbody>';
    
    html += '</table></div>';
    
    // Add export button
    html += '<div class="mt-3">';
    html += '<button class="btn btn-primary" onclick="exportReport()">Export to Excel</button>';
    html += '</div>';
    
    $('#report-content').html(html);
}

function formatCurrency(value) {
    if (!value) return '0.00';
    return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function resetFilters() {
    $('#custom-filter-form')[0].reset();
    $('#report-content').html(
        '<p class="text-center text-muted">Select filters and click "Apply Filters" to view the report</p>'
    );
}

function loadDepartments(company) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Department',
            filters: {
                company: company,
                disabled: 0
            },
            fields: ['name'],
            order_by: 'name'
        },
        callback: function(r) {
            if (r.message) {
                updateDropdown('#custom_department', r.message, 'All Departments');
            }
        }
    });
}

function loadProjects(company) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Project',
            filters: {
                company: company,
                status: ['not in', ['Completed', 'Cancelled']]
            },
            fields: ['name'],
            order_by: 'name'
        },
        callback: function(r) {
            if (r.message) {
                updateDropdown('#custom_project', r.message, 'All Projects');
            }
        }
    });
}

function loadCostCenters(company) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Cost Center',
            filters: {
                company: company,
                is_group: 0,
                disabled: 0
            },
            fields: ['name'],
            order_by: 'name'
        },
        callback: function(r) {
            if (r.message) {
                updateDropdown('#custom_cost_center', r.message, 'All Cost Centers');
            }
        }
    });
}

function updateDropdown(selector, data, defaultText) {
    const $select = $(selector);
    $select.empty();
    $select.append(`<option value="">${__(defaultText)}</option>`);
    data.forEach(item => {
        $select.append(`<option value="${item.name}">${item.name}</option>`);
    });
}

function exportReport() {
    const filters = {
        company: $('#company').val(),
        from_date: $('#from_date').val(),
        to_date: $('#to_date').val(),
        custom_department: $('#custom_department').val(),
        custom_project: $('#custom_project').val(),
        custom_cost_center: $('#custom_cost_center').val(),
        custom_status: $('#custom_status').val()
    };
    
    frappe.call({
        method: 'label_customizer.www.reports.general_ledger.index.export_custom_format',
        args: {
            filters: filters
        },
        callback: function(r) {
            if (r.message) {
                frappe.msgprint(__('Export completed successfully'));
            }
        }
    });
}


