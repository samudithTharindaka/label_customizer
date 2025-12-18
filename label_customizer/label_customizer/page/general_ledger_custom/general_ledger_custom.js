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
		.party-link-field {
			min-height: 34px;
		}
		.party-link-field .frappe-control {
			margin-bottom: 0;
		}
		.party-link-field .form-control {
			height: 34px;
		}
		.party-link-field .control-input-wrapper {
			margin-bottom: 0;
		}
		.party-link-field .pill-container {
			border: 1px solid #ced4da;
			border-radius: 4px;
			padding: 4px;
			min-height: 34px;
		}
		.receivable-row:hover {
			background-color: #d4edda !important;
		}
		.payable-row:hover {
			background-color: #fff3cd !important;
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
                    <div id="custom_account_container"></div>
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
                    <div id="custom_project_container"></div>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="form-group">
                    <label class="control-label">Cost Center</label>
                    <div id="custom_cost_center_container"></div>
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
                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label">Customer (Receivables)</label>
                        <div id="combined_customer_container"></div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label">Supplier (Payables)</label>
                        <div id="combined_supplier_container"></div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label">Cost Center</label>
                        <select class="form-control" id="combined_cost_center">
                            <option value="">All Cost Centers</option>
                        </select>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="form-group" style="padding-top: 25px;">
                        <button class="btn btn-success btn-sm btn-block" id="btn_combined_report">
                            <i class="fa fa-clock-o"></i> Generate Report
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <button class="btn btn-default btn-sm" id="btn_combined_reset">
                        <i class="fa fa-refresh"></i> Reset Filters
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
		
		// Initialize Account, Project, Cost Center fields
		this.init_account_field();
		this.init_project_field();
		this.init_cost_center_field();
		
		// Bind events
		this.bind_events();
		
		// Setup tabs
		this.setup_tabs();
	}
	
	init_account_field() {
		const me = this;
		const container = this.wrapper.find('#custom_account_container');
		container.empty();
		
		const fieldWrapper = $('<div class="frappe-control party-link-field"></div>');
		container.append(fieldWrapper);
		
		this.account_control = frappe.ui.form.make_control({
			df: {
				fieldtype: 'MultiSelectList',
				fieldname: 'account',
				options: 'Account',
				label: '',
				placeholder: 'Select Account...',
				get_data: function(txt) {
					const company = me.wrapper.find('#custom_company').val();
					const filters = company ? { company: company } : {};
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: 'Account',
								txt: txt || '',
								filters: filters
							},
							callback: function(r) {
								resolve(r.message || []);
							}
						});
					});
				}
			},
			parent: fieldWrapper,
			render_input: true
		});
		this.account_control.refresh();
	}
	
	init_project_field() {
		const me = this;
		const container = this.wrapper.find('#custom_project_container');
		container.empty();
		
		const fieldWrapper = $('<div class="frappe-control party-link-field"></div>');
		container.append(fieldWrapper);
		
		this.project_control = frappe.ui.form.make_control({
			df: {
				fieldtype: 'MultiSelectList',
				fieldname: 'project',
				options: 'Project',
				label: '',
				placeholder: 'Select Project...',
				get_data: function(txt) {
					const company = me.wrapper.find('#custom_company').val();
					const filters = company ? { company: company } : {};
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: 'Project',
								txt: txt || '',
								filters: filters
							},
							callback: function(r) {
								resolve(r.message || []);
							}
						});
					});
				}
			},
			parent: fieldWrapper,
			render_input: true
		});
		this.project_control.refresh();
	}
	
	init_cost_center_field() {
		const me = this;
		const container = this.wrapper.find('#custom_cost_center_container');
		container.empty();
		
		const fieldWrapper = $('<div class="frappe-control party-link-field"></div>');
		container.append(fieldWrapper);
		
		this.cost_center_control = frappe.ui.form.make_control({
			df: {
				fieldtype: 'MultiSelectList',
				fieldname: 'cost_center',
				options: 'Cost Center',
				label: '',
				placeholder: 'Select Cost Center...',
				get_data: function(txt) {
					const company = me.wrapper.find('#custom_company').val();
					const filters = company ? { company: company } : {};
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: 'Cost Center',
								txt: txt || '',
								filters: filters
							},
							callback: function(r) {
								resolve(r.message || []);
							}
						});
					});
				}
			},
			parent: fieldWrapper,
			render_input: true
		});
		this.cost_center_control.refresh();
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
		
		// Initialize combined tab filter fields
		this.init_combined_customer_field();
		this.init_combined_supplier_field();
		
		// Company change event for combined tab
		this.wrapper.find('#combined_company').on('change', function() {
			const company = $(this).val();
			if (company) {
				me.load_combined_cost_centers(company);
			}
		});
	}
	
	init_combined_customer_field() {
		const me = this;
		const container = this.wrapper.find('#combined_customer_container');
		container.empty();
		
		const fieldWrapper = $('<div class="frappe-control party-link-field"></div>');
		container.append(fieldWrapper);
		
		this.combined_customer_control = frappe.ui.form.make_control({
			df: {
				fieldtype: 'MultiSelectList',
				fieldname: 'combined_customer',
				options: 'Customer',
				label: '',
				placeholder: 'Select Customer...',
				get_data: function(txt) {
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: 'Customer',
								txt: txt || '',
								filters: {}
							},
							callback: function(r) {
								resolve(r.message || []);
							}
						});
					});
				}
			},
			parent: fieldWrapper,
			render_input: true
		});
		this.combined_customer_control.refresh();
	}
	
	init_combined_supplier_field() {
		const me = this;
		const container = this.wrapper.find('#combined_supplier_container');
		container.empty();
		
		const fieldWrapper = $('<div class="frappe-control party-link-field"></div>');
		container.append(fieldWrapper);
		
		this.combined_supplier_control = frappe.ui.form.make_control({
			df: {
				fieldtype: 'MultiSelectList',
				fieldname: 'combined_supplier',
				options: 'Supplier',
				label: '',
				placeholder: 'Select Supplier...',
				get_data: function(txt) {
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: 'Supplier',
								txt: txt || '',
								filters: {}
							},
							callback: function(r) {
								resolve(r.message || []);
							}
						});
					});
				}
			},
			parent: fieldWrapper,
			render_input: true
		});
		this.combined_supplier_control.refresh();
	}
	
	load_combined_cost_centers(company) {
		const me = this;
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Cost Center',
				filters: { company: company },
				fields: ['name'],
				limit_page_length: 0,
				order_by: 'name'
			},
			callback: function(r) {
				const $select = me.wrapper.find('#combined_cost_center');
				$select.empty().append('<option value="">All Cost Centers</option>');
				if (r.message) {
					r.message.forEach(function(cc) {
						$select.append(`<option value="${cc.name}">${cc.name}</option>`);
					});
				}
			}
		});
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
				// Clear and refresh Account, Project, Cost Center fields (they filter by company)
				if (me.account_control) {
					me.account_control.set_value([]);
				}
				if (me.project_control) {
					me.project_control.set_value([]);
				}
				if (me.cost_center_control) {
					me.cost_center_control.set_value([]);
				}
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
		
		// Clear existing field and control
		container.empty();
		if (this.party_control) {
			this.party_control = null;
		}
		this.selected_parties = [];
		
		if (!partyType) {
			// Show disabled input when no party type selected
			container.html('<input type="text" class="form-control" disabled placeholder="Select Party Type first">');
			return;
		}
		
		// Create container for Frappe control
		const fieldWrapper = $('<div class="frappe-control party-link-field"></div>');
		container.append(fieldWrapper);
		
		// Create Frappe MultiSelectList field (same as native General Ledger)
		this.party_control = frappe.ui.form.make_control({
			df: {
				fieldtype: 'MultiSelectList',
				fieldname: 'party',
				options: partyType,
				label: '',
				placeholder: `Select ${partyType}...`,
				get_data: function(txt) {
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: partyType,
								txt: txt || '',
								filters: {}
							},
							callback: function(r) {
								resolve(r.message || []);
							}
						});
					});
				}
			},
			parent: fieldWrapper,
			render_input: true
		});
		
		this.party_control.refresh();
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
		// Helper function to get values from MultiSelectList controls
		const getControlValue = (control) => {
			if (!control) return null;
			let value = control.get_value();
			if (value) {
				if (!Array.isArray(value)) {
					value = [value];
				}
				value = value.filter(v => v && (typeof v === 'string' ? v.trim() : v));
				if (value.length === 0) return null;
			}
			return value;
		};
		
		// Get values from MultiSelectList controls
		const partyValue = getControlValue(this.party_control);
		const accountValue = getControlValue(this.account_control);
		const projectValue = getControlValue(this.project_control);
		const costCenterValue = getControlValue(this.cost_center_control);
		
		return {
			company: this.wrapper.find('#custom_company').val(),
			from_date: this.wrapper.find('#custom_from_date').val(),
			to_date: this.wrapper.find('#custom_to_date').val(),
			account: accountValue,
			department: this.wrapper.find('#custom_department').val(),
			project: projectValue,
			cost_center: costCenterValue,
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
		} else if (data.has_aging_columns) {
			modeLabel = `<div class="report-mode-badge mode-standard">
				<i class="fa fa-book"></i> General Ledger with Aging Columns
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
			// Detect and mark aging columns (match patterns like "0-30", "120+", "Above")
			let headerClass = '';
			if (col.label && col.label.match(/^\d+-\d+|^\d+\+|^\d+-Above|Above/i)) {
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
					
					// Mark aging column values (match patterns like "0-30", "120+", "Above")
					if (col.label && col.label.match(/^\d+-\d+|^\d+\+|^\d+-Above|Above/i)) {
						cellClass += ' aging-column-value';
					}
					
					// Format numbers
					if (col.fieldtype === 'Currency' || col.fieldtype === 'Float') {
						const numValue = parseFloat(value) || 0;
						// For aging columns, show empty if null/zero, otherwise format
						if (cellClass.includes('aging-column-value') && (value === null || value === '' || numValue === 0)) {
							value = '';
						} else {
							value = this.format_currency(numValue);
						}
						
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
		this.wrapper.find('#custom_department').val('');
		this.wrapper.find('#custom_voucher_type').val('');
		this.wrapper.find('#custom_party_type').val('');
		
		// Clear MultiSelectList controls
		if (this.account_control) {
			this.account_control.set_value([]);
		}
		if (this.project_control) {
			this.project_control.set_value([]);
		}
		if (this.cost_center_control) {
			this.cost_center_control.set_value([]);
		}
		if (this.party_control) {
			this.party_control.set_value([]);
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
		this.wrapper.find('#combined_cost_center').val('');
		// Clear customer and supplier controls
		if (this.combined_customer_control) {
			this.combined_customer_control.set_value([]);
		}
		if (this.combined_supplier_control) {
			this.combined_supplier_control.set_value([]);
		}
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
		const costCenter = this.wrapper.find('#combined_cost_center').val();
		
		// Get customer and supplier values
		let customerValue = null;
		if (this.combined_customer_control) {
			customerValue = this.combined_customer_control.get_value();
			if (customerValue && !Array.isArray(customerValue)) {
				customerValue = [customerValue];
			}
			if (customerValue && customerValue.length === 0) customerValue = null;
		}
		
		let supplierValue = null;
		if (this.combined_supplier_control) {
			supplierValue = this.combined_supplier_control.get_value();
			if (supplierValue && !Array.isArray(supplierValue)) {
				supplierValue = [supplierValue];
			}
			if (supplierValue && supplierValue.length === 0) supplierValue = null;
		}
		
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
					ageing_range: ageingRange,
					cost_center: costCenter,
					customer: customerValue,
					supplier: supplierValue
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
		
		const recColumns = receivables.columns || [];
		const payColumns = payables.columns || [];
		const recData = receivables.data || [];
		const payData = payables.data || [];
		
		// Use receivables columns as base (both reports have similar structure)
		const columns = recColumns.length > 0 ? recColumns : payColumns;
		
		if (!columns.length && !recData.length && !payData.length) {
			this.wrapper.find('#combined_report_container').html(`
				<div class="alert alert-info">
					<strong>No Data</strong>: No receivables or payables data available for the selected filters.
				</div>
			`);
			return;
		}
		
		let html = `
			<div class="report-mode-badge mode-combined">
				<i class="fa fa-clock-o"></i> Combined Aging Analysis Mode
			</div>
		`;
		
		// Summary cards at top
		html += this.render_combined_summary(receivables, payables);
		
		// Build unified table
		html += '<div class="table-responsive" style="margin-top: 20px;">';
		html += '<table class="table table-bordered table-hover" style="font-size: 12px;">';
		
		// Header - add Type column first
		html += '<thead><tr>';
		html += '<th style="white-space: nowrap; background: #495057; color: white;">Type</th>';
		columns.forEach(col => {
			const isAgingCol = col.fieldname && col.fieldname.match(/range\d+|age_\d+/i);
			const headerClass = isAgingCol ? 'aging-column' : '';
			html += `<th class="${headerClass}" style="white-space: nowrap;">${col.label || col.fieldname}</th>`;
		});
		html += '</tr></thead>';
		
		// Body - combine both datasets
		html += '<tbody>';
		
		// Add receivables rows
		recData.forEach(row => {
			if (typeof row !== 'object' || Array.isArray(row)) return;
			
			html += '<tr class="receivable-row" style="background-color: #f0fff0;">';
			html += '<td style="font-weight: 600; color: #28a745;"><i class="fa fa-arrow-down"></i> Receivable</td>';
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
		
		// Add payables rows
		payData.forEach(row => {
			if (typeof row !== 'object' || Array.isArray(row)) return;
			
			html += '<tr class="payable-row" style="background-color: #fffbf0;">';
			html += '<td style="font-weight: 600; color: #ffc107;"><i class="fa fa-arrow-up"></i> Payable</td>';
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
		html += '</table></div>';
		
		// Entry count summary
		html += `<div class="alert alert-success" style="margin-top: 20px;">
			<strong>✅ Combined Aging Report Generated Successfully</strong><br>
			<span class="badge badge-success">${recData.length} Receivables</span>
			<span class="badge badge-warning">${payData.length} Payables</span>
			<span class="badge badge-info">${recData.length + payData.length} Total Entries</span>
		</div>`;
		
		this.wrapper.find('#combined_report_container').html(html);
	}
	
	render_combined_summary(receivables, payables) {
		// Use totals calculated by backend
		const recTotal = parseFloat(receivables.total) || 0;
		const payTotal = parseFloat(payables.total) || 0;
		
		const netPosition = recTotal - payTotal;
		const netClass = netPosition >= 0 ? 'success' : 'danger';
		const netLabel = netPosition >= 0 ? 'Net Receivable' : 'Net Payable';
		
		return `
			<div class="row" style="margin-top: 10px; margin-bottom: 10px;">
				<div class="col-md-4">
					<div class="card text-white bg-success">
						<div class="card-body text-center" style="padding: 15px;">
							<h6 class="card-title" style="margin-bottom: 5px;">Total Receivables</h6>
							<h4 style="margin: 0;">${this.format_currency(recTotal)}</h4>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-white bg-warning">
						<div class="card-body text-center" style="padding: 15px;">
							<h6 class="card-title" style="margin-bottom: 5px;">Total Payables</h6>
							<h4 style="margin: 0;">${this.format_currency(payTotal)}</h4>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-white bg-${netClass}">
						<div class="card-body text-center" style="padding: 15px;">
							<h6 class="card-title" style="margin-bottom: 5px;">${netLabel}</h6>
							<h4 style="margin: 0;">${this.format_currency(Math.abs(netPosition))}</h4>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}


