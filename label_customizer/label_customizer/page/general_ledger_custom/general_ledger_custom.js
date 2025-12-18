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
		.party-multiselect {
			min-height: 80px;
			max-height: 150px;
		}
		.party-multiselect option:checked {
			background: linear-gradient(0deg, #007bff 0%, #007bff 100%);
			color: white;
		}
		#custom_party_container small {
			display: block;
			margin-top: 4px;
			font-size: 11px;
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
		#report_container th.aging-column {
			background-color: #fff3cd !important;
			color: #856404;
			font-weight: 700;
			border-left: 2px solid #ffc107;
		}
		#report_container td.aging-column-value {
			background-color: #fffbf0;
			font-weight: 500;
			text-align: right;
		}
		.report-mode-badge {
			display: inline-block;
			padding: 5px 12px;
			border-radius: 4px;
			font-size: 12px;
			font-weight: 600;
			margin-bottom: 15px;
		}
		.mode-standard {
			background-color: #e3f2fd;
			color: #1976d2;
		}
		.mode-aging {
			background-color: #fff3cd;
			color: #856404;
		}
		.mode-combined {
			background-color: #d4edda;
			color: #155724;
		}
		.nav-tabs-custom {
			border-bottom: 2px solid #dee2e6;
			margin-bottom: 20px;
		}
		.nav-tabs-custom .nav-link {
			border: none;
			border-bottom: 3px solid transparent;
			padding: 12px 24px;
			font-weight: 600;
			color: #6c757d;
			cursor: pointer;
			background: none;
		}
		.nav-tabs-custom .nav-link:hover {
			color: #495057;
			border-bottom-color: #dee2e6;
		}
		.nav-tabs-custom .nav-link.active {
			color: #007bff;
			border-bottom-color: #007bff;
			background: none;
		}
		.tab-content-custom {
			display: none;
		}
		.tab-content-custom.active {
			display: block;
		}
		.combined-section {
			background: linear-gradient(135deg, #e8f5e9 0%, #fff3e0 100%);
			border: 1px solid #c8e6c9;
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
    
    <!-- Tab Navigation -->
    <ul class="nav nav-tabs nav-tabs-custom" id="reportTabs">
        <li class="nav-item">
            <a class="nav-link active" id="gl-tab" data-tab="gl">
                <i class="fa fa-book"></i> General Ledger
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="combined-tab" data-tab="combined">
                <i class="fa fa-clock-o"></i> Combined Aging
            </a>
        </li>
    </ul>
    
    <!-- Tab 1: General Ledger -->
    <div class="tab-content-custom active" id="gl-content">
    
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
                    <div id="custom_party_container"></div>
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
    
    </div><!-- End Tab 1: GL Content -->
    
    <!-- Tab 2: Combined Aging -->
    <div class="tab-content-custom" id="combined-content">
        <div class="custom-filter-section combined-section" style="padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h5 style="margin-bottom: 15px;">📊 Combined Aging Report</h5>
            <p class="text-muted">View both Receivables and Payables aging in a single report</p>
            
            <div class="row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label">Company *</label>
                        <select class="form-control" id="combined_company">
                            <option value="">Select Company</option>
                        </select>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label">As of Date *</label>
                        <input type="date" class="form-control" id="combined_report_date">
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label">Ageing Based On</label>
                        <select class="form-control" id="combined_ageing_based_on">
                            <option value="Due Date">Due Date</option>
                            <option value="Posting Date">Posting Date</option>
                        </select>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label">Ageing Range (days)</label>
                        <input type="text" class="form-control" id="combined_ageing_range" value="30, 60, 90, 120">
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <button class="btn btn-success btn-sm" id="btn_combined_report">
                        <i class="fa fa-clock-o"></i> Generate Combined Aging Report
                    </button>
                    <button class="btn btn-default btn-sm" id="btn_combined_reset">
                        <i class="fa fa-refresh"></i> Reset
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Combined Report Container -->
        <div id="combined_report_container" style="min-height: 400px;">
            <div class="text-center text-muted" style="padding: 60px 20px;">
                <i class="fa fa-clock-o" style="font-size: 48px; opacity: 0.3;"></i>
                <p style="margin-top: 20px; font-size: 16px;">Click "Generate Combined Aging Report" to view both Receivables and Payables aging</p>
            </div>
        </div>
    </div><!-- End Tab 2: Combined Content -->
    
</div>
		`;
		$(this.page.body).html(html);
		
		// Load initial data
		this.load_companies();
		this.set_default_dates();
		
		// Initialize party field
		this.init_party_field();
		
		// Bind events
		this.bind_events();
		
		// Setup tabs
		this.setup_tabs();
	}

	setup_tabs() {
		const me = this;
		
		// Tab click handlers
		this.wrapper.find('.nav-tabs-custom .nav-link').on('click', function(e) {
			e.preventDefault();
			const tabId = $(this).data('tab');
			
			// Update tab states
			me.wrapper.find('.nav-tabs-custom .nav-link').removeClass('active');
			$(this).addClass('active');
			
			// Update content visibility
			me.wrapper.find('.tab-content-custom').removeClass('active');
			me.wrapper.find(`#${tabId}-content`).addClass('active');
		});
		
		// Load companies for combined tab
		this.load_combined_companies();
		this.set_combined_default_date();
	}
	
	load_combined_companies() {
		const me = this;
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Company',
				fields: ['name'],
				limit_page_length: 0
			},
			async: false,
			callback: function(r) {
				if (r.message) {
					const select = me.wrapper.find('#combined_company');
					r.message.forEach(function(company) {
						select.append(`<option value="${company.name}">${company.name}</option>`);
					});
					// Set default company
					if (r.message.length > 0) {
						select.val(r.message[0].name);
					}
				}
			}
		});
	}
	
	set_combined_default_date() {
		const today = frappe.datetime.get_today();
		this.wrapper.find('#combined_report_date').val(today);
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
		
		// Party type change event - refresh party field
		this.wrapper.find('#custom_party_type').on('change', function() {
			me.init_party_field();
		});
		
		// Combined aging report button
		this.wrapper.find('#btn_combined_report').on('click', function() {
			me.load_combined_aging_report();
		});
		
		// Combined reset button
		this.wrapper.find('#btn_combined_reset').on('click', function() {
			me.reset_combined_filters();
		});
	}
	
	init_party_field() {
		const me = this;
		const partyType = this.wrapper.find('#custom_party_type').val();
		const container = this.wrapper.find('#custom_party_container');
		
		// Clear existing field
		container.empty();
		
		if (!partyType) {
			// Show disabled select when no party type selected
			container.html('<select class="form-control" id="custom_party" disabled><option value="">Select Party Type first</option></select>');
			this.party_field = null;
			return;
		}
		
		// Create multi-select dropdown with multiple attribute
		const select = $('<select class="form-control party-multiselect" id="custom_party" multiple></select>');
		container.append(select);
		
		// Add helpful text
		container.append('<small class="text-muted">Hold Ctrl/Cmd to select multiple</small>');
		
		// Load parties for this party type
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: partyType,
				fields: ['name'],
				limit_page_length: 0,
				order_by: 'name'
			},
			callback: function(r) {
				if (r.message) {
					r.message.forEach(function(party) {
						select.append($('<option></option>').attr('value', party.name).text(party.name));
					});
				}
			}
		});
		
		// Store reference
		this.party_field = select;
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
		// Get party values - could be array from multi-select
		let partyValue = this.party_field ? this.party_field.val() : this.wrapper.find('#custom_party').val();
		// Ensure it's an array, filter empty values
		if (partyValue) {
			if (!Array.isArray(partyValue)) {
				partyValue = [partyValue];
			}
			partyValue = partyValue.filter(v => v && v.trim());
			if (partyValue.length === 0) partyValue = null;
		}
		
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
			party: partyValue,
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
		let rows = data.data;
		const reportMode = data.report_mode || 'standard';
		
		if (!rows || rows.length === 0) {
			this.wrapper.find('#report_container').html(`
				<div class="alert alert-info">
					<i class="fa fa-info-circle"></i> No data found for the selected filters.
				</div>
			`);
			return;
		}
		
		// Remove duplicate rows (especially summary rows)
		rows = this.remove_duplicate_rows(rows, columns);
		
		// Add mode indicator
		let modeLabel = '';
		if (reportMode === 'aging') {
			modeLabel = `<div class="report-mode-badge mode-aging">
				<i class="fa fa-clock-o"></i> Aging Analysis Mode - Showing aging buckets
			</div>`;
		} else {
			modeLabel = `<div class="report-mode-badge mode-standard">
				<i class="fa fa-book"></i> Standard General Ledger Mode
			</div>`;
		}
		
		// Add aging note if present
		let agingNote = '';
		if (data.aging_note) {
			agingNote = `<div class="alert alert-warning" style="margin-bottom: 15px;">
				<i class="fa fa-info-circle"></i> ${data.aging_note}
			</div>`;
		}
		
		// Build table HTML
		let html = modeLabel + agingNote;
		html += '<div class="table-responsive"><table class="table table-bordered table-hover table-sm">';
		
		// Table header
		html += '<thead><tr>';
		columns.forEach(col => {
			// Detect and mark aging columns
			let headerClass = '';
			if (col.label && col.label.match(/^\d+-\d+|^\d+-Above|Above/i)) {
				headerClass = 'aging-column';
			}
			html += `<th class="${headerClass}">${col.label}</th>`;
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
					
					// For summary rows
					if (isSummaryRow && idx === 0) {
						cellClass = 'font-weight-bold';
						cellStyle = 'background-color: #e3f2fd; font-weight: 600;';
					} else if (isSummaryRow) {
						cellStyle = 'background-color: #e3f2fd; font-weight: 600;';
					}
					
					// Mark aging column values
					if (col.label && col.label.match(/^\d+-\d+|^\d+-Above|Above/i)) {
						cellClass += ' aging-column-value';
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
		let summaryBadge = reportMode === 'aging' ? 'badge-warning' : 'badge-success';
		html += `<div class="alert alert-success" style="margin-top: 20px;">
			<strong>✅ Report Generated Successfully</strong><br>
			<span class="badge ${summaryBadge}">${reportMode === 'aging' ? 'Aging Mode' : 'Standard Mode'}</span>
			Data Entries: ${dataRowCount}
		</div>`;
		
		this.wrapper.find('#report_container').html(html);
	}
	
	remove_duplicate_rows(rows, columns) {
		// Remove duplicate summary rows (Opening, Total, Closing)
		const seenSummaries = new Map(); // Track all summary rows by type and values
		const filteredRows = [];
		const firstCol = columns[0];
		const debitCol = columns.find(c => c.fieldname && c.fieldname.toLowerCase() === 'debit');
		const creditCol = columns.find(c => c.fieldname && c.fieldname.toLowerCase() === 'credit');
		const balanceCol = columns.find(c => c.fieldname && c.fieldname.toLowerCase().includes('balance'));
		
		rows.forEach((row, index) => {
			if (typeof row === 'object' && !Array.isArray(row)) {
				const firstValue = String(row[firstCol.fieldname] || '').trim();
				const isSummaryRow = this.is_summary_row(row, columns);
				
				if (isSummaryRow && firstValue) {
					// Create a unique key based on summary type and key values
					const summaryType = firstValue.toLowerCase().replace(/'/g, '');
					const debit = parseFloat(row[debitCol ? debitCol.fieldname : ''] || 0).toFixed(2);
					const credit = parseFloat(row[creditCol ? creditCol.fieldname : ''] || 0).toFixed(2);
					const balance = parseFloat(row[balanceCol ? balanceCol.fieldname : ''] || 0).toFixed(2);
					
					// Key combines type and values
					const key = `${summaryType}|${debit}|${credit}|${balance}`;
					
					// Check if we've seen this exact summary before
					if (seenSummaries.has(key)) {
						return; // Skip this duplicate
					}
					
					// Mark as seen and include
					seenSummaries.set(key, true);
					filteredRows.push(row);
				} else {
					// Always include non-summary rows
					filteredRows.push(row);
				}
			} else {
				// Include non-object rows as-is
				filteredRows.push(row);
			}
		});
		
		return filteredRows;
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
		if (this.party_field) {
			this.party_field.val('');
		} else {
			this.wrapper.find('#custom_party').val('');
		}
		this.init_party_field(); // Reinitialize to show placeholder
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
	
	reset_combined_filters() {
		this.wrapper.find('#combined_company').val(this.wrapper.find('#combined_company option:first').next().val());
		this.wrapper.find('#combined_ageing_based_on').val('Due Date');
		this.wrapper.find('#combined_ageing_range').val('30, 60, 90, 120');
		this.set_combined_default_date();
		
		this.wrapper.find('#combined_report_container').html(`
			<div class="text-center text-muted" style="padding: 60px 20px;">
				<i class="fa fa-clock-o" style="font-size: 48px; opacity: 0.3;"></i>
				<p style="margin-top: 20px; font-size: 16px;">Click "Generate Combined Aging Report" to view both Receivables and Payables aging</p>
			</div>
		`);
	}
	
	load_combined_aging_report() {
		const me = this;
		
		const company = this.wrapper.find('#combined_company').val();
		const reportDate = this.wrapper.find('#combined_report_date').val();
		const ageingBasedOn = this.wrapper.find('#combined_ageing_based_on').val();
		const ageingRange = this.wrapper.find('#combined_ageing_range').val();
		
		if (!company) {
			frappe.msgprint(__('Please select a Company'));
			return;
		}
		
		if (!reportDate) {
			frappe.msgprint(__('Please select a Report Date'));
			return;
		}
		
		// Show loading
		this.wrapper.find('#combined_report_container').html(`
			<div class="text-center" style="padding: 60px 20px;">
				<i class="fa fa-spinner fa-spin" style="font-size: 48px; color: #5e64ff;"></i>
				<p style="margin-top: 20px; font-size: 16px;">Loading Combined Aging Report...</p>
			</div>
		`);
		
		frappe.call({
			method: 'label_customizer.label_customizer.page.general_ledger_custom.general_ledger_custom.get_combined_aging_report',
			args: {
				filters: {
					company: company,
					report_date: reportDate,
					ageing_based_on: ageingBasedOn,
					ageing_range: ageingRange
				}
			},
			callback: function(r) {
				if (r.message) {
					me.render_combined_report(r.message);
				} else {
					me.wrapper.find('#combined_report_container').html(`
						<div class="text-center text-danger" style="padding: 60px 20px;">
							<i class="fa fa-exclamation-triangle" style="font-size: 48px;"></i>
							<p style="margin-top: 20px; font-size: 16px;">No data returned</p>
						</div>
					`);
				}
			},
			error: function(r) {
				me.wrapper.find('#combined_report_container').html(`
					<div class="text-center text-danger" style="padding: 60px 20px;">
						<i class="fa fa-exclamation-triangle" style="font-size: 48px;"></i>
						<p style="margin-top: 20px; font-size: 16px;">Error loading report</p>
					</div>
				`);
			}
		});
	}
	
	render_combined_report(data) {
		const receivables = data.receivables || {};
		const payables = data.payables || {};
		
		let html = `
			<div class="report-mode-badge mode-combined">
				<i class="fa fa-clock-o"></i> Combined Aging Analysis Mode
			</div>
		`;
		
		// Receivables Section
		html += this.render_aging_section('Accounts Receivable (Customer)', receivables, 'success');
		
		// Payables Section  
		html += this.render_aging_section('Accounts Payable (Supplier)', payables, 'warning');
		
		// Summary Section
		html += this.render_combined_summary(receivables, payables);
		
		this.wrapper.find('#combined_report_container').html(html);
	}
	
	render_aging_section(title, reportData, colorClass) {
		const columns = reportData.columns || [];
		const data = reportData.data || [];
		const summary = reportData.report_summary || [];
		
		if (!columns.length) {
			return `
				<div class="alert alert-info" style="margin-bottom: 20px;">
					<strong>${title}</strong>: No data available
				</div>
			`;
		}
		
		let html = `
			<div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--${colorClass === 'success' ? 'green' : 'yellow'}-500, #28a745);">
				<div class="card-header" style="background: ${colorClass === 'success' ? '#d4edda' : '#fff3cd'}; padding: 12px 20px;">
					<h6 style="margin: 0; font-weight: 600;">
						<i class="fa fa-${colorClass === 'success' ? 'arrow-down' : 'arrow-up'}"></i> ${title}
						<span class="badge badge-${colorClass}" style="margin-left: 10px;">${data.length} entries</span>
					</h6>
				</div>
				<div class="card-body" style="padding: 0; overflow-x: auto;">
		`;
		
		// Build table
		html += '<table class="table table-bordered table-hover" style="margin-bottom: 0; font-size: 12px;">';
		
		// Header
		html += '<thead><tr>';
		columns.forEach(col => {
			const isAgingCol = col.fieldname && col.fieldname.match(/range\d+|age_\d+/i);
			const headerClass = isAgingCol ? 'aging-column' : '';
			html += `<th class="${headerClass}" style="white-space: nowrap;">${col.label || col.fieldname}</th>`;
		});
		html += '</tr></thead>';
		
		// Body
		html += '<tbody>';
		data.forEach(row => {
			if (typeof row !== 'object' || Array.isArray(row)) return;
			
			html += '<tr>';
			columns.forEach(col => {
				let value = row[col.fieldname] || '';
				const isAgingCol = col.fieldname && col.fieldname.match(/range\d+|age_\d+/i);
				let cellClass = isAgingCol ? 'aging-column-value' : '';
				
				// Format currency
				if (col.fieldtype === 'Currency' && value) {
					value = this.format_currency(value);
				}
				
				html += `<td class="${cellClass}">${value}</td>`;
			});
			html += '</tr>';
		});
		html += '</tbody>';
		html += '</table>';
		
		html += '</div></div>';
		
		return html;
	}
	
	render_combined_summary(receivables, payables) {
		const recSummary = receivables.report_summary || [];
		const paySummary = payables.report_summary || [];
		
		// Extract totals
		let recTotal = 0, payTotal = 0;
		recSummary.forEach(s => {
			if (s.label && s.label.toLowerCase().includes('total outstanding')) {
				recTotal = parseFloat(s.value) || 0;
			}
		});
		paySummary.forEach(s => {
			if (s.label && s.label.toLowerCase().includes('total outstanding')) {
				payTotal = parseFloat(s.value) || 0;
			}
		});
		
		const netPosition = recTotal - payTotal;
		const netClass = netPosition >= 0 ? 'success' : 'danger';
		const netLabel = netPosition >= 0 ? 'Net Receivable' : 'Net Payable';
		
		return `
			<div class="row" style="margin-top: 20px;">
				<div class="col-md-4">
					<div class="card text-white bg-success">
						<div class="card-body text-center">
							<h6 class="card-title">Total Receivables</h6>
							<h4>${this.format_currency(recTotal)}</h4>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-white bg-warning">
						<div class="card-body text-center">
							<h6 class="card-title">Total Payables</h6>
							<h4>${this.format_currency(payTotal)}</h4>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-white bg-${netClass}">
						<div class="card-body text-center">
							<h6 class="card-title">${netLabel}</h6>
							<h4>${this.format_currency(Math.abs(netPosition))}</h4>
						</div>
					</div>
				</div>
			</div>
			
			<div class="alert alert-success" style="margin-top: 20px;">
				<strong>✅ Combined Aging Report Generated Successfully</strong>
			</div>
		`;
	}
}


