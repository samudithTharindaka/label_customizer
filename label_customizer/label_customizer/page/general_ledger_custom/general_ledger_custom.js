frappe.pages['general-ledger-custom'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'General Ledger Custom',
		single_column: true
	});

	// Add custom CSS
	const style = document.createElement('style');
	style.textContent = `
		.custom-filter-section {
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		.custom-filter-section .form-group {
			margin-bottom: 15px;
		}
		.custom-filter-section label {
			font-weight: 600;
			font-size: 13px;
			color: #333;
		}
		#report_container table {
			font-size: 12px;
		}
		#report_container table th {
			background-color: #2c3e50;
			color: white;
			font-weight: 600;
			position: sticky;
			top: 0;
			z-index: 10;
			padding: 12px 8px;
			border: 1px solid #34495e;
		}
		#report_container table td {
			padding: 8px;
			vertical-align: middle;
		}
		#report_container .table-hover tbody tr:not(.table-info):hover {
			background-color: #f8f9fa;
			cursor: pointer;
		}
		#report_container .table-bordered {
			border: 1px solid #dee2e6;
		}
		#report_container .table-bordered td,
		#report_container .table-bordered th {
			border: 1px solid #dee2e6;
		}
		.amount-debit {
			color: #dc3545;
			font-weight: 500;
			text-align: right;
		}
		.amount-credit {
			color: #28a745;
			font-weight: 500;
			text-align: right;
		}
		#report_container tbody tr.table-info {
			background-color: #e3f2fd !important;
			font-weight: 600;
		}
		#report_container tbody tr.table-info:hover {
			background-color: #bbdefb !important;
		}
		#report_container tbody tr.table-info td {
			border-top: 2px solid #2196f3;
			border-bottom: 2px solid #2196f3;
		}
	`;
	document.head.appendChild(style);

	// Initialize the page
	new GeneralLedgerCustom(page);
}

class GeneralLedgerCustom {
	constructor(page) {
		this.page = page;
		this.wrapper = $(this.page.wrapper);
		this.setup();
	}

	setup() {
		console.log('✅ General Ledger Custom page loaded');
		
		// Inject HTML content directly
		const html = `
<div class="frappe-control" data-fieldtype="HTML" data-fieldname="gl_custom_html">
    <div class="form-message blue" style="margin-bottom: 20px;">
        <div>
            <strong>🎯 General Ledger - Custom View</strong>
            <p class="text-muted" style="margin-top: 5px;">Enhanced General Ledger report with custom filters and features</p>
        </div>
    </div>
    
    <!-- Custom Filter Section -->
    <div class="custom-filter-section" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h5 style="margin-bottom: 15px;">📊 Custom Filters</h5>
        
        <div class="row">
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Company *</label>
                    <select class="form-control" id="custom_company">
                        <option value="">Select Company</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">From Date *</label>
                    <input type="date" class="form-control" id="custom_from_date">
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">To Date *</label>
                    <input type="date" class="form-control" id="custom_to_date">
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Account</label>
                    <input type="text" class="form-control" id="custom_account" placeholder="Search Account">
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Department</label>
                    <select class="form-control" id="custom_department">
                        <option value="">All Departments</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Project</label>
                    <select class="form-control" id="custom_project">
                        <option value="">All Projects</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Cost Center</label>
                    <select class="form-control" id="custom_cost_center">
                        <option value="">All Cost Centers</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Voucher Type</label>
                    <select class="form-control" id="custom_voucher_type">
                        <option value="">All Types</option>
                        <option value="Sales Invoice">Sales Invoice</option>
                        <option value="Purchase Invoice">Purchase Invoice</option>
                        <option value="Payment Entry">Payment Entry</option>
                        <option value="Journal Entry">Journal Entry</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Party Type</label>
                    <select class="form-control" id="custom_party_type">
                        <option value="">All Party Types</option>
                        <option value="Customer">Customer</option>
                        <option value="Supplier">Supplier</option>
                        <option value="Employee">Employee</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Party</label>
                    <input type="text" class="form-control" id="custom_party" placeholder="Enter Party Name">
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Group By</label>
                    <select class="form-control" id="custom_group_by">
                        <option value="">No Grouping</option>
                        <option value="Group by Voucher">Group by Voucher</option>
                        <option value="Group by Account">Group by Account</option>
                        <option value="Group by Party">Group by Party</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Include Dimensions</label>
                    <select class="form-control" id="custom_include_dimensions">
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Show Opening</label>
                    <select class="form-control" id="custom_show_opening">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Show Cancelled Entries</label>
                    <select class="form-control" id="custom_show_cancelled">
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Include Default FB Accounts</label>
                    <select class="form-control" id="custom_include_default_fb">
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Aging Filters Section -->
        <div class="row" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #dee2e6;">
            <div class="col-md-12">
                <h6 style="margin-bottom: 15px; color: #495057;">⏰ Aging Analysis Filters</h6>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label class="control-label">Ageing Based On</label>
                    <select class="form-control" id="custom_ageing_based_on">
                        <option value="">Not Applicable</option>
                        <option value="Posting Date">Posting Date</option>
                        <option value="Due Date">Due Date</option>
                    </select>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="form-group">
                    <label class="control-label">Ageing Range (days)</label>
                    <input type="text" class="form-control" id="custom_ageing_range" placeholder="e.g., 30, 60, 90, 120" value="30, 60, 90, 120">
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-primary btn-sm" id="btn_apply_filters">
                    <i class="fa fa-filter"></i> Apply Filters & View Report
                </button>
                <button class="btn btn-default btn-sm" id="btn_reset_filters">
                    <i class="fa fa-refresh"></i> Reset
                </button>
                <button class="btn btn-success btn-sm" id="btn_export_excel" style="float: right;">
                    <i class="fa fa-download"></i> Export to Excel
                </button>
            </div>
        </div>
    </div>
    
    <!-- Report Container -->
    <div id="report_container" style="min-height: 400px;">
        <div class="text-center text-muted" style="padding: 60px 20px;">
            <i class="fa fa-filter" style="font-size: 48px; opacity: 0.3;"></i>
            <p style="margin-top: 20px; font-size: 16px;">Select filters and click "Apply Filters" to view the report</p>
        </div>
    </div>
</div>
		`;
		$(this.page.body).html(html);
		
		// Load initial data
		this.load_companies();
		this.set_default_dates();
		
		// Bind events
		this.bind_events();
	}

	bind_events() {
		const me = this;
		
		// Apply filters button
		this.wrapper.find('#btn_apply_filters').on('click', function() {
			me.load_report();
		});
		
		// Reset button
		this.wrapper.find('#btn_reset_filters').on('click', function() {
			me.reset_filters();
		});
		
		// Export button
		this.wrapper.find('#btn_export_excel').on('click', function() {
			me.export_to_excel();
		});
		
		// Company change event
		this.wrapper.find('#custom_company').on('change', function() {
			const company = $(this).val();
			if (company) {
				me.load_departments(company);
				me.load_projects(company);
				me.load_cost_centers(company);
			}
		});
	}

	set_default_dates() {
		const today = frappe.datetime.get_today();
		const from_date = frappe.datetime.add_months(today, -1);
		
		this.wrapper.find('#custom_from_date').val(from_date);
		this.wrapper.find('#custom_to_date').val(today);
	}

	load_companies() {
		const me = this;
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Company',
				fields: ['name'],
				order_by: 'name'
			},
			callback: function(r) {
				if (r.message) {
					const $select = me.wrapper.find('#custom_company');
					$select.empty().append('<option value="">Select Company</option>');
					r.message.forEach(function(company) {
						$select.append(`<option value="${company.name}">${company.name}</option>`);
					});
					
					// Set default company if only one exists
					if (r.message.length === 1) {
						$select.val(r.message[0].name).trigger('change');
					}
				}
			}
		});
	}

	load_departments(company) {
		const me = this;
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Department',
				filters: { company: company, disabled: 0 },
				fields: ['name'],
				order_by: 'name'
			},
			callback: function(r) {
				if (r.message) {
					const $select = me.wrapper.find('#custom_department');
					$select.empty().append('<option value="">All Departments</option>');
					r.message.forEach(function(dept) {
						$select.append(`<option value="${dept.name}">${dept.name}</option>`);
					});
				}
			}
		});
	}

	load_projects(company) {
		const me = this;
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
					const $select = me.wrapper.find('#custom_project');
					$select.empty().append('<option value="">All Projects</option>');
					r.message.forEach(function(project) {
						$select.append(`<option value="${project.name}">${project.name}</option>`);
					});
				}
			}
		});
	}

	load_cost_centers(company) {
		const me = this;
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
					const $select = me.wrapper.find('#custom_cost_center');
					$select.empty().append('<option value="">All Cost Centers</option>');
					r.message.forEach(function(cc) {
						$select.append(`<option value="${cc.name}">${cc.name}</option>`);
					});
				}
			}
		});
	}

	get_filters() {
		return {
			company: this.wrapper.find('#custom_company').val(),
			from_date: this.wrapper.find('#custom_from_date').val(),
			to_date: this.wrapper.find('#custom_to_date').val(),
			account: this.wrapper.find('#custom_account').val(),
			department: this.wrapper.find('#custom_department').val(),
			project: this.wrapper.find('#custom_project').val(),
			cost_center: this.wrapper.find('#custom_cost_center').val(),
			voucher_type: this.wrapper.find('#custom_voucher_type').val(),
			party_type: this.wrapper.find('#custom_party_type').val(),
			party: this.wrapper.find('#custom_party').val(),
			group_by: this.wrapper.find('#custom_group_by').val(),
			include_dimensions: this.wrapper.find('#custom_include_dimensions').val(),
			show_opening_entries: this.wrapper.find('#custom_show_opening').val(),
			show_cancelled_entries: this.wrapper.find('#custom_show_cancelled').val(),
			include_default_book_entries: this.wrapper.find('#custom_include_default_fb').val(),
			// Aging filters
			ageing_based_on: this.wrapper.find('#custom_ageing_based_on').val(),
			ageing_range: this.wrapper.find('#custom_ageing_range').val()
		};
	}

	load_report() {
		const me = this;
		const filters = this.get_filters();
		
		// Validate required fields
		if (!filters.company || !filters.from_date || !filters.to_date) {
			frappe.msgprint(__('Please fill all required fields (Company, From Date, To Date)'));
			return;
		}
		
		// Show loading
		this.wrapper.find('#report_container').html(`
			<div class="text-center" style="padding: 60px 20px;">
				<div class="spinner-border text-primary" role="status">
					<span class="sr-only">Loading...</span>
				</div>
				<p class="text-muted" style="margin-top: 20px;">Loading report data...</p>
			</div>
		`);
		
		// Call backend to get report data
		frappe.call({
			method: 'label_customizer.label_customizer.page.general_ledger_custom.general_ledger_custom.get_report_data',
			args: { filters: filters },
			callback: function(r) {
				if (r.message) {
					if (r.message.error) {
						// Show error message from backend
						me.wrapper.find('#report_container').html(`
							<div class="alert alert-danger">
								<strong>Error!</strong> ${r.message.message || 'Failed to load report'}
								${r.message.traceback ? '<pre style="margin-top: 10px; font-size: 11px;">' + r.message.traceback + '</pre>' : ''}
							</div>
						`);
					} else {
						me.render_report(r.message);
					}
				}
			},
			error: function(r) {
				let error_msg = 'Failed to load report. Please try again.';
				if (r.message) {
					error_msg = r.message;
				} else if (r._server_messages) {
					try {
						const messages = JSON.parse(r._server_messages);
						if (messages && messages.length > 0) {
							const msg = JSON.parse(messages[0]);
							error_msg = msg.message || error_msg;
						}
					} catch(e) {
						console.error('Error parsing server messages:', e);
					}
				}
				me.wrapper.find('#report_container').html(`
					<div class="alert alert-danger">
						<strong>Error!</strong> ${error_msg}
					</div>
				`);
			}
		});
	}

	render_report(data) {
		const columns = data.columns;
		const rows = data.data;
		
		if (!rows || rows.length === 0) {
			this.wrapper.find('#report_container').html(`
				<div class="alert alert-info">
					<i class="fa fa-info-circle"></i> No data found for the selected filters.
				</div>
			`);
			return;
		}
		
		// Build table HTML
		let html = '<div class="table-responsive"><table class="table table-bordered table-hover table-sm">';
		
		// Table header
		html += '<thead><tr>';
		columns.forEach(col => {
			html += `<th>${col.label}</th>`;
		});
		html += '</tr></thead>';
		
		// Table body
		html += '<tbody>';
		let dataRowCount = 0;
		
		rows.forEach(row => {
			// Skip completely empty rows
			if (this.is_empty_row(row, columns)) {
				return;
			}
			
			if (typeof row === 'object' && !Array.isArray(row)) {
				// Check if this is a summary row
				const isSummaryRow = this.is_summary_row(row, columns);
				const rowClass = isSummaryRow ? 'table-info font-weight-bold' : '';
				
				if (!isSummaryRow) {
					dataRowCount++;
				}
				
				html += `<tr class="${rowClass}">`;
				columns.forEach((col, idx) => {
					let value = row[col.fieldname] || '';
					let cellClass = '';
					let cellStyle = '';
					
					// For summary rows, check if first column contains the label
					if (isSummaryRow && idx === 0) {
						cellClass = 'font-weight-bold';
						cellStyle = 'background-color: #e3f2fd; font-weight: 600;';
					} else if (isSummaryRow) {
						cellStyle = 'background-color: #e3f2fd; font-weight: 600;';
					}
					
					// Format numbers
					if (col.fieldtype === 'Currency' || col.fieldtype === 'Float') {
						const numValue = parseFloat(value) || 0;
						value = this.format_currency(numValue);
						
						// Add color classes for debit/credit (only for data rows)
						if (!isSummaryRow) {
							if (col.fieldname === 'debit' && numValue > 0) {
								cellClass += ' amount-debit';
							} else if (col.fieldname === 'credit' && numValue > 0) {
								cellClass += ' amount-credit';
							}
						}
					}
					
					// Format dates
					if (col.fieldtype === 'Date' && value) {
						value = frappe.datetime.str_to_user(value);
					}
					
					// Handle string values that might be summary labels
					if (typeof value === 'string' && value.match(/^'(Opening|Total|Closing)/)) {
						value = value.replace(/'/g, '');
						cellClass += ' font-weight-bold';
					}
					
					html += `<td class="${cellClass}" style="${cellStyle}">${value}</td>`;
				});
				html += '</tr>';
			}
		});
		html += '</tbody>';
		html += '</table></div>';
		
		// Add summary
		html += `<div class="alert alert-success" style="margin-top: 20px;">
			<strong>✅ Report Generated Successfully</strong><br>
			Data Entries: ${dataRowCount}
		</div>`;
		
		this.wrapper.find('#report_container').html(html);
	}
	
	is_empty_row(row, columns) {
		// Check if all values in the row are empty or zero
		for (let col of columns) {
			const value = row[col.fieldname];
			if (value && value !== '' && value !== 0 && value !== '0' && value !== '0.00') {
				return false;
			}
		}
		return true;
	}
	
	is_summary_row(row, columns) {
		// Check if first column contains summary keywords
		const firstCol = columns[0];
		const firstValue = row[firstCol.fieldname];
		
		if (typeof firstValue === 'string') {
			const cleanValue = firstValue.replace(/'/g, '').toLowerCase();
			return cleanValue.includes('opening') || 
			       cleanValue.includes('total') || 
			       cleanValue.includes('closing');
		}
		
		return false;
	}

	format_currency(value) {
		if (!value) return '0.00';
		return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
	}

	reset_filters() {
		this.wrapper.find('#custom_company').val('');
		this.wrapper.find('#custom_account').val('');
		this.wrapper.find('#custom_department').val('');
		this.wrapper.find('#custom_project').val('');
		this.wrapper.find('#custom_cost_center').val('');
		this.wrapper.find('#custom_voucher_type').val('');
		this.wrapper.find('#custom_party_type').val('');
		this.wrapper.find('#custom_party').val('');
		this.wrapper.find('#custom_group_by').val('');
		this.wrapper.find('#custom_include_dimensions').val('0');
		this.wrapper.find('#custom_show_opening').val('Yes');
		this.wrapper.find('#custom_show_cancelled').val('0');
		this.wrapper.find('#custom_include_default_fb').val('0');
		// Reset aging filters
		this.wrapper.find('#custom_ageing_based_on').val('');
		this.wrapper.find('#custom_ageing_range').val('30, 60, 90, 120');
		this.set_default_dates();
		
		this.wrapper.find('#report_container').html(`
			<div class="text-center text-muted" style="padding: 60px 20px;">
				<i class="fa fa-filter" style="font-size: 48px; opacity: 0.3;"></i>
				<p style="margin-top: 20px; font-size: 16px;">Select filters and click "Apply Filters" to view the report</p>
			</div>
		`);
	}

	export_to_excel() {
		const filters = this.get_filters();
		
		if (!filters.company || !filters.from_date || !filters.to_date) {
			frappe.msgprint(__('Please apply filters first before exporting'));
			return;
		}
		
		frappe.msgprint(__('Export functionality will be implemented soon'));
	}
}


