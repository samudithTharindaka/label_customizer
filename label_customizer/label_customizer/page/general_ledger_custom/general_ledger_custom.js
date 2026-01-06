frappe.pages['general-ledger-custom'].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'General Ledger',
		single_column: true
	});

	// Add custom CSS - Clean Professional Theme
	const style = document.createElement('style');
	style.textContent = `
		/* Filter Section */
		.gl-filter-section {
			background: #ffffff;
			border: 1px solid #e2e8f0;
			border-radius: 6px;
			padding: 20px;
			margin-bottom: 20px;
		}
		.gl-filter-section .section-title {
			font-size: 14px;
			font-weight: 600;
			color: #1a202c;
			margin-bottom: 16px;
			padding-bottom: 8px;
			border-bottom: 1px solid #e2e8f0;
		}
		.gl-filter-section .form-group {
			margin-bottom: 12px;
		}
		.gl-filter-section label {
			font-weight: 500;
			font-size: 12px;
			color: #4a5568;
			margin-bottom: 4px;
		}
		.gl-filter-section .form-control {
			font-size: 13px;
			border-color: #e2e8f0;
			border-radius: 4px;
		}
		.gl-filter-section .form-control:focus {
			border-color: #3182ce;
			box-shadow: 0 0 0 1px #3182ce;
		}
		
		/* Buttons */
		.gl-btn-primary {
			background: #3182ce;
			border: none;
			color: white;
			padding: 8px 16px;
			font-size: 13px;
			font-weight: 500;
			border-radius: 4px;
			transition: background 0.2s;
		}
		.gl-btn-primary:hover {
			background: #2c5282;
			color: white;
		}
		.gl-btn-secondary {
			background: #edf2f7;
			border: 1px solid #e2e8f0;
			color: #4a5568;
			padding: 8px 16px;
			font-size: 13px;
			font-weight: 500;
			border-radius: 4px;
			transition: all 0.2s;
		}
		.gl-btn-secondary:hover {
			background: #e2e8f0;
			color: #2d3748;
		}
		.gl-btn-success {
			background: #38a169;
			border: none;
			color: white;
			padding: 8px 16px;
			font-size: 13px;
			font-weight: 500;
			border-radius: 4px;
		}
		.gl-btn-success:hover {
			background: #2f855a;
			color: white;
		}
		
		/* Table Styles */
		#report_container table {
			font-size: 12px;
			border-collapse: collapse;
			width: 100%;
		}
		#report_container table th {
			background: #2d3748;
			color: #ffffff;
			font-weight: 600;
			font-size: 11px;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			padding: 10px 12px;
			position: sticky;
			top: 0;
			z-index: 10;
			border: none;
		}
		#report_container table td {
			padding: 10px 12px;
			border-bottom: 1px solid #e2e8f0;
			color: #2d3748;
		}
		#report_container .table-hover tbody tr:hover {
			background-color: #f7fafc;
		}
		#report_container tbody tr.summary-row {
			background-color: #edf2f7;
			font-weight: 600;
		}
		#report_container tbody tr.summary-row td {
			border-top: 2px solid #cbd5e0;
		}
		
		/* Amount Colors */
		.amount-debit {
			color: #c53030;
			font-weight: 500;
			text-align: right;
			font-family: 'SF Mono', 'Monaco', monospace;
		}
		.amount-credit {
			color: #276749;
			font-weight: 500;
			text-align: right;
			font-family: 'SF Mono', 'Monaco', monospace;
		}
		
		/* Party Link Field */
		.party-link-field {
			min-height: 32px;
		}
		.party-link-field .frappe-control {
			margin-bottom: 0;
		}
		.party-link-field .control-input-wrapper {
			margin-bottom: 0;
		}
		
		/* Tab Navigation */
		.gl-tabs {
			display: flex;
			border-bottom: 1px solid #e2e8f0;
			margin-bottom: 20px;
		}
		.gl-tabs .gl-tab {
			padding: 12px 20px;
			font-size: 13px;
			font-weight: 500;
			color: #718096;
			cursor: pointer;
			border-bottom: 2px solid transparent;
			transition: all 0.2s;
			background: none;
			border-top: none;
			border-left: none;
			border-right: none;
		}
		.gl-tabs .gl-tab:hover {
			color: #2d3748;
		}
		.gl-tabs .gl-tab.active {
			color: #3182ce;
			border-bottom-color: #3182ce;
		}
		.gl-tab-content {
			display: none;
		}
		.gl-tab-content.active {
			display: block;
		}
		
		/* Aging Section */
		#aging_report_container {
			background: #fffbeb;
			border: 1px solid #f6e05e;
			border-radius: 6px;
			padding: 20px;
			margin-top: 24px;
		}
		#aging_report_container .aging-section-header {
			margin-bottom: 16px;
			padding-bottom: 12px;
			border-bottom: 1px solid #f6e05e;
		}
		#aging_report_container .aging-section-header h5 {
			margin: 0;
			font-size: 14px;
			font-weight: 600;
			color: #744210;
		}
		#aging_report_container table th {
			background: #d69e2e !important;
			color: white;
		}
		.aging-column-value {
			text-align: right;
			font-family: 'SF Mono', 'Monaco', monospace;
		}
		
		/* Show Aging Checkbox */
		#show_aging_container .checkbox label {
			font-size: 13px;
			color: #744210;
			cursor: pointer;
		}
		
		/* Empty State */
		.gl-empty-state {
			text-align: center;
			padding: 60px 20px;
			color: #a0aec0;
		}
		.gl-empty-state i {
			font-size: 48px;
			margin-bottom: 16px;
			opacity: 0.5;
		}
		.gl-empty-state p {
			font-size: 14px;
			margin: 0;
		}
		
		/* Report Summary */
		.gl-report-summary {
			background: #f7fafc;
			border: 1px solid #e2e8f0;
			border-radius: 4px;
			padding: 12px 16px;
			margin-top: 16px;
			font-size: 13px;
			color: #4a5568;
		}
		.gl-report-summary strong {
			color: #2d3748;
		}
		
		/* Collapsible Filters */
		.gl-filter-row {
			margin-bottom: 12px;
		}
		.gl-advanced-toggle {
			font-size: 12px;
			color: #718096;
			cursor: pointer;
			padding: 8px 0;
			display: inline-block;
		}
		.gl-advanced-toggle:hover {
			color: #3182ce;
		}
		.gl-advanced-filters {
			display: none;
			padding-top: 12px;
			border-top: 1px solid #e2e8f0;
			margin-top: 12px;
		}
		.gl-advanced-filters.show {
			display: block;
		}
		
		/* Scrollable Table Containers */
		.datatable-wrapper {
			max-height: 500px;
			overflow-y: auto;
			overflow-x: auto;
			border: 1px solid #e2e8f0;
			border-radius: 4px;
			background: #fff;
		}
		.datatable-wrapper .dt-scrollable {
			overflow-x: auto !important;
		}
		.datatable-wrapper .frappe-datatable {
			min-width: 100%;
		}
		.datatable-wrapper .dt-header {
			position: sticky;
			top: 0;
			z-index: 10;
		}
		
		/* GL table specific height */
		#gl_datatable_wrapper {
			max-height: 500px;
		}
		
		/* Aging table specific height */
		#aging_datatable_wrapper {
			max-height: 400px;
		}
		
		/* Combined table specific height */
		#combined_datatable_wrapper {
			max-height: 600px;
		}
		
		/* Custom scrollbar styling */
		.datatable-wrapper::-webkit-scrollbar {
			width: 8px;
			height: 8px;
		}
		.datatable-wrapper::-webkit-scrollbar-track {
			background: #f1f1f1;
			border-radius: 4px;
		}
		.datatable-wrapper::-webkit-scrollbar-thumb {
			background: #cbd5e0;
			border-radius: 4px;
		}
		.datatable-wrapper::-webkit-scrollbar-thumb:hover {
			background: #a0aec0;
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
		// Inject HTML content directly
		const html = `
<div class="frappe-control" data-fieldtype="HTML" data-fieldname="gl_custom_html">
    
    <!-- Tab Navigation -->
    <div class="gl-tabs" id="reportTabs">
        <button class="gl-tab active" data-tab="gl">General Ledger</button>
        <button class="gl-tab" data-tab="combined">Combined Aging</button>
    </div>
    
    <!-- Tab 1: General Ledger -->
    <div class="gl-tab-content active" id="gl-content">
    
    <!-- Filter Section -->
    <div class="gl-filter-section">
        <div class="section-title">Filters</div>
        
        <!-- Primary Filters -->
        <div class="row gl-filter-row">
            <div class="col-md-3">
                <div class="form-group">
                    <label>Company <span style="color:#c53030">*</span></label>
                    <select class="form-control" id="custom_company">
                        <option value="">Select Company</option>
                    </select>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label>From Date <span style="color:#c53030">*</span></label>
                    <input type="date" class="form-control" id="custom_from_date">
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label>To Date <span style="color:#c53030">*</span></label>
                    <input type="date" class="form-control" id="custom_to_date">
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label>Party Type</label>
                    <select class="form-control" id="custom_party_type">
                        <option value="">All</option>
                        <option value="Customer">Customer</option>
                        <option value="Supplier">Supplier</option>
                        <option value="Employee">Employee</option>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label>Party</label>
                    <div id="custom_party_container"></div>
                </div>
            </div>
        </div>
        
        <!-- Toggle Advanced Filters -->
        <span class="gl-advanced-toggle" id="toggle_advanced">
            <i class="fa fa-chevron-down"></i> More Filters
        </span>
        
        <!-- Advanced Filters (Hidden by default) -->
        <div class="gl-advanced-filters" id="advanced_filters">
            <div class="row gl-filter-row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Account</label>
                        <div id="custom_account_container"></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Cost Center</label>
                        <div id="custom_cost_center_container"></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Project</label>
                        <div id="custom_project_container"></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Voucher Type</label>
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
            
            <div class="row gl-filter-row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Department</label>
                        <select class="form-control" id="custom_department">
                            <option value="">All Departments</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label>Group By</label>
                        <select class="form-control" id="custom_group_by">
                            <option value="">None</option>
                            <option value="Group by Voucher">Voucher</option>
                            <option value="Group by Account">Account</option>
                            <option value="Group by Party">Party</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label>Show Opening</label>
                        <select class="form-control" id="custom_show_opening">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label>Include Dimensions</label>
                        <select class="form-control" id="custom_include_dimensions">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Show Cancelled</label>
                        <select class="form-control" id="custom_show_cancelled">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Hidden field for Include Default FB -->
            <input type="hidden" id="custom_include_default_fb" value="0">
        </div>
        
        <!-- Aging Analysis (shown when Customer/Supplier selected) -->
        <div id="show_aging_container" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
            <div class="row">
                <div class="col-md-3">
                    <div class="form-group">
                        <div class="checkbox" style="margin-top: 24px;">
                            <label>
                                <input type="checkbox" id="custom_show_aging"> Show Aging Analysis
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Ageing Based On</label>
                        <select class="form-control" id="custom_ageing_based_on">
                            <option value="">Not Applicable</option>
                            <option value="Posting Date">Posting Date</option>
                            <option value="Due Date">Due Date</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Ageing Range (days)</label>
                        <input type="text" class="form-control" id="custom_ageing_range" value="30, 60, 90, 120">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <button class="gl-btn-primary" id="btn_apply_filters">
                <i class="fa fa-search"></i> Run Report
            </button>
            <button class="gl-btn-secondary" id="btn_reset_filters" style="margin-left: 8px;">
                <i class="fa fa-refresh"></i> Reset
            </button>
            <button class="gl-btn-success" id="btn_export_excel" style="float: right;">
                <i class="fa fa-download"></i> Export
            </button>
        </div>
    </div>
    
    <!-- Report Container -->
    <div id="report_container">
        <div class="gl-empty-state">
            <i class="fa fa-table"></i>
            <p>Select filters and click "Run Report" to view data</p>
        </div>
    </div>
    
    <!-- Aging Report Container -->
    <div id="aging_report_container" style="display: none;">
    </div>
    
    </div><!-- End Tab 1 -->
    
    <!-- Tab 2: Combined Aging -->
    <div class="gl-tab-content" id="combined-content">
        <div class="gl-filter-section">
            <div class="section-title">Combined Aging Report</div>
            <p style="color: #718096; font-size: 13px; margin-bottom: 16px;">View receivables and payables aging in a single report</p>
            
            <div class="row gl-filter-row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Company <span style="color:#c53030">*</span></label>
                        <select class="form-control" id="combined_company">
                            <option value="">Select Company</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label>As of Date <span style="color:#c53030">*</span></label>
                        <input type="date" class="form-control" id="combined_report_date">
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label>Ageing Based On</label>
                        <select class="form-control" id="combined_ageing_based_on">
                            <option value="Due Date">Due Date</option>
                            <option value="Posting Date">Posting Date</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label>Range (days)</label>
                        <input type="text" class="form-control" id="combined_ageing_range" value="30, 60, 90, 120">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Cost Center</label>
                        <select class="form-control" id="combined_cost_center">
                            <option value="">All</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="row gl-filter-row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Customer</label>
                        <div id="combined_customer_container"></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>Supplier</label>
                        <div id="combined_supplier_container"></div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <button class="gl-btn-primary" id="btn_combined_report">
                    <i class="fa fa-search"></i> Generate Report
                </button>
                <button class="gl-btn-secondary" id="btn_combined_reset" style="margin-left: 8px;">
                    <i class="fa fa-refresh"></i> Reset
                </button>
            </div>
        </div>
        
        <!-- Combined Report Container -->
        <div id="combined_report_container">
            <div class="gl-empty-state">
                <i class="fa fa-pie-chart"></i>
                <p>Click "Generate Report" to view aging analysis</p>
            </div>
        </div>
    </div><!-- End Tab 2 -->
    
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
				get_data: function (txt) {
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
							callback: function (r) {
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
				get_data: function (txt) {
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
							callback: function (r) {
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
				get_data: function (txt) {
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
							callback: function (r) {
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
		this.wrapper.find('.gl-tabs .gl-tab').on('click', function (e) {
			e.preventDefault();
			const tabId = $(this).data('tab');

			// Update tab states
			me.wrapper.find('.gl-tabs .gl-tab').removeClass('active');
			$(this).addClass('active');

			// Update content visibility
			me.wrapper.find('.gl-tab-content').removeClass('active');
			me.wrapper.find(`#${tabId}-content`).addClass('active');
		});

		// Advanced filters toggle
		this.wrapper.find('#toggle_advanced').on('click', function () {
			const advancedFilters = me.wrapper.find('#advanced_filters');
			const icon = $(this).find('i');
			
			if (advancedFilters.hasClass('show')) {
				advancedFilters.removeClass('show');
				icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
				$(this).html('<i class="fa fa-chevron-down"></i> More Filters');
			} else {
				advancedFilters.addClass('show');
				icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
				$(this).html('<i class="fa fa-chevron-up"></i> Less Filters');
			}
		});

		// Load companies for combined tab
		this.load_combined_companies();
		this.set_combined_default_date();

		// Initialize combined tab filter fields
		this.init_combined_customer_field();
		this.init_combined_supplier_field();

		// Company change event for combined tab
		this.wrapper.find('#combined_company').on('change', function () {
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
				get_data: function (txt) {
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: 'Customer',
								txt: txt || '',
								filters: {}
							},
							callback: function (r) {
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
				get_data: function (txt) {
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: 'Supplier',
								txt: txt || '',
								filters: {}
							},
							callback: function (r) {
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
			callback: function (r) {
				const $select = me.wrapper.find('#combined_cost_center');
				$select.empty().append('<option value="">All Cost Centers</option>');
				if (r.message) {
					r.message.forEach(function (cc) {
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
			callback: function (r) {
				if (r.message) {
					const select = me.wrapper.find('#combined_company');
					r.message.forEach(function (company) {
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
		this.wrapper.find('#btn_apply_filters').on('click', function () {
			me.load_report();
		});

		// Reset button
		this.wrapper.find('#btn_reset_filters').on('click', function () {
			me.reset_filters();
		});

		// Export button
		this.wrapper.find('#btn_export_excel').on('click', function () {
			me.export_to_excel();
		});

		// Company change event
		this.wrapper.find('#custom_company').on('change', function () {
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

		// Party type change event - refresh party field and toggle aging checkbox visibility
		this.wrapper.find('#custom_party_type').on('change', function () {
			me.init_party_field();
			me.toggle_aging_checkbox_visibility();
		});

		// Combined aging report button
		this.wrapper.find('#btn_combined_report').on('click', function () {
			me.load_combined_aging_report();
		});

		// Combined reset button
		this.wrapper.find('#btn_combined_reset').on('click', function () {
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
				get_data: function (txt) {
					return new Promise((resolve) => {
						frappe.call({
							method: 'frappe.desk.search.search_link',
							args: {
								doctype: partyType,
								txt: txt || '',
								filters: {}
							},
							callback: function (r) {
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

	toggle_aging_checkbox_visibility() {
		const partyType = this.wrapper.find('#custom_party_type').val();
		const agingCheckboxContainer = this.wrapper.find('#show_aging_container');
		
		// Show checkbox only for Customer or Supplier party types
		if (partyType === 'Customer' || partyType === 'Supplier') {
			agingCheckboxContainer.show();
		} else {
			agingCheckboxContainer.hide();
			// Uncheck the checkbox when hidden
			this.wrapper.find('#custom_show_aging').prop('checked', false);
		}
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
			callback: function (r) {
				if (r.message) {
					const $select = me.wrapper.find('#custom_company');
					$select.empty().append('<option value="">Select Company</option>');
					r.message.forEach(function (company) {
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
			callback: function (r) {
				if (r.message) {
					const $select = me.wrapper.find('#custom_department');
					$select.empty().append('<option value="">All Departments</option>');
					r.message.forEach(function (dept) {
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
			callback: function (r) {
				if (r.message) {
					const $select = me.wrapper.find('#custom_project');
					$select.empty().append('<option value="">All Projects</option>');
					r.message.forEach(function (project) {
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
			callback: function (r) {
				if (r.message) {
					const $select = me.wrapper.find('#custom_cost_center');
					$select.empty().append('<option value="">All Cost Centers</option>');
					r.message.forEach(function (cc) {
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
			ageing_range: this.wrapper.find('#custom_ageing_range').val(),
			// Show aging in separate table
			show_aging: this.wrapper.find('#custom_show_aging').is(':checked')
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
			<div class="gl-empty-state">
				<i class="fa fa-spinner fa-spin"></i>
				<p>Loading report...</p>
			</div>
		`);

		// Also show loading in aging container if show_aging is checked
		if (filters.show_aging) {
			this.wrapper.find('#aging_report_container').html(`
				<div class="gl-empty-state" style="padding: 30px;">
					<i class="fa fa-spinner fa-spin"></i>
					<p>Loading aging analysis...</p>
				</div>
			`).show();
		}

		// Call backend to get report data
		frappe.call({
			method: 'label_customizer.label_customizer.page.general_ledger_custom.general_ledger_custom.get_report_data',
			args: { filters: filters },
			callback: function (r) {
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
			error: function (r) {
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
					} catch (e) {
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

		if (!rows || rows.length === 0) {
			this.wrapper.find('#report_container').html(`
				<div class="gl-empty-state">
					<i class="fa fa-inbox"></i>
					<p>No data found for the selected filters</p>
				</div>
			`);
			return;
		}

		// Remove duplicate rows (especially summary rows)
		rows = this.remove_duplicate_rows(rows, columns);

		// Prepare columns for DataTable
		const dtColumns = columns.map(col => ({
			name: col.label || col.fieldname,
			id: col.fieldname,
			fieldtype: col.fieldtype,
			width: col.width || 120,
			editable: false,
			sortable: true,
			focusable: true,
			format: (value, row, column, data) => {
				if (value === null || value === undefined) return '';
				
				// Handle summary labels
				if (typeof value === 'string' && value.match(/^'(Opening|Total|Closing)/)) {
					return `<strong>${value.replace(/'/g, '')}</strong>`;
				}
				
				// Format currency
				if (col.fieldtype === 'Currency' || col.fieldtype === 'Float') {
					const numValue = parseFloat(value) || 0;
					const formatted = this.format_currency(numValue);
					
					// Color for debit/credit
					if (col.fieldname === 'debit' && numValue > 0) {
						return `<span style="color: #c53030;">${formatted}</span>`;
					} else if (col.fieldname === 'credit' && numValue > 0) {
						return `<span style="color: #276749;">${formatted}</span>`;
					}
					return formatted;
				}
				
				// Format dates
				if (col.fieldtype === 'Date' && value) {
					return frappe.datetime.str_to_user(value);
				}
				
				// Link for voucher_no
				if (col.fieldname === 'voucher_no' && value && data.voucher_type) {
					return `<a href="/app/${frappe.router.slug(data.voucher_type)}/${value}" target="_blank">${value}</a>`;
				}
				
				return value;
			}
		}));

		// Prepare data for DataTable
		const dtData = rows.filter(row => {
			if (typeof row !== 'object' || Array.isArray(row)) return false;
			return !this.is_empty_row(row, columns);
		}).map(row => {
			const rowData = {};
			columns.forEach(col => {
				rowData[col.fieldname] = row[col.fieldname];
			});
			return rowData;
		});

		// Count data rows (exclude summary rows)
		const dataRowCount = dtData.filter(row => !this.is_summary_row(row, columns)).length;

		// Clear container and create DataTable wrapper with scrollable container
		this.wrapper.find('#report_container').html(`
			<div id="gl_datatable_wrapper" class="datatable-wrapper">
				<div id="gl_datatable"></div>
			</div>
			<div class="gl-report-summary">
				<strong>${dataRowCount}</strong> entries found
			</div>
		`);

		// Destroy existing datatable if any
		if (this.datatable) {
			this.datatable.destroy();
		}

		// Create new DataTable with fixed layout for horizontal scrolling
		this.datatable = new frappe.DataTable('#gl_datatable', {
			columns: dtColumns,
			data: dtData,
			serialNoColumn: false,
			checkboxColumn: false,
			cellHeight: 35,
			layout: 'fixed',
			noDataMessage: 'No data found',
			getEditor: () => null // Disable editing
		});

		// Add row click handler for summary rows styling
		setTimeout(() => {
			const datatableBody = this.wrapper.find('#gl_datatable .dt-scrollable');
			datatableBody.find('.dt-row').each((idx, rowEl) => {
				const rowData = dtData[idx];
				if (rowData && this.is_summary_row(rowData, columns)) {
					$(rowEl).css({
						'background-color': '#f7fafc',
						'font-weight': '600'
					});
				}
			});
		}, 100);
		
		// Handle aging data if present (render in separate container)
		if (data.aging_data) {
			this.render_aging_table(data.aging_data);
		} else {
			// Hide aging container if no aging data
			this.wrapper.find('#aging_report_container').hide().empty();
		}
	}

	render_aging_table(agingData) {
		const agingContainer = this.wrapper.find('#aging_report_container');
		
		// Check for errors
		if (agingData.error) {
			agingContainer.html(`
				<div style="padding: 16px; background: #fed7d7; border-radius: 4px; color: #c53030;">
					<strong>Error:</strong> ${agingData.message || 'Failed to load aging data'}
				</div>
			`).show();
			return;
		}
		
		const allColumns = agingData.columns || [];
		let rows = agingData.data || [];
		const partyType = agingData.party_type || 'Customer';
		
		if (!rows || rows.length === 0) {
			agingContainer.html(`
				<div class="aging-section-header">
					<h5>Aging Analysis - ${partyType === 'Customer' ? 'Receivables' : 'Payables'}</h5>
				</div>
				<div class="gl-empty-state" style="padding: 30px;">
					<i class="fa fa-inbox"></i>
					<p>No aging data found</p>
				</div>
			`).show();
			return;
		}
		
		// Filter to only show aging-related columns
		const agingColumns = allColumns.filter(col => {
			const fieldname = (col.fieldname || '').toLowerCase();
			const label = (col.label || '').toLowerCase();
			
			if (fieldname === 'party' || fieldname === 'party_name') return true;
			if (fieldname === 'outstanding' || fieldname === 'outstanding_amount' || 
			    fieldname === 'balance' || label.includes('outstanding') || label.includes('balance')) return true;
			if (fieldname.startsWith('range') || fieldname.match(/^age_\d+/)) return true;
			if (label.match(/^\d+-\d+|^\d+\+|above/i)) return true;
			
			return false;
		});
		
		if (agingColumns.length === 0) {
			agingContainer.html(`
				<div class="aging-section-header">
					<h5>Aging Analysis - ${partyType === 'Customer' ? 'Receivables' : 'Payables'}</h5>
				</div>
				<div class="gl-empty-state" style="padding: 30px;">
					<i class="fa fa-exclamation-triangle"></i>
					<p>No aging columns found</p>
				</div>
			`).show();
			return;
		}
		
		// Filter rows with aging data
		const filteredRows = rows.filter(row => {
			if (typeof row !== 'object' || Array.isArray(row)) return false;
			return agingColumns.some(col => {
				const fieldname = (col.fieldname || '').toLowerCase();
				if (fieldname === 'party' || fieldname === 'party_name') return false;
				const value = row[col.fieldname];
				return value && parseFloat(value) !== 0;
			});
		});

		// Prepare columns for DataTable
		const dtColumns = agingColumns.map(col => ({
			name: col.label || col.fieldname,
			id: col.fieldname,
			fieldtype: col.fieldtype,
			width: col.width || 100,
			editable: false,
			sortable: true,
			format: (value) => {
				if (value === null || value === undefined) return '';
				if (col.fieldtype === 'Currency' || col.fieldtype === 'Float') {
					const numValue = parseFloat(value) || 0;
					return numValue === 0 ? '-' : this.format_currency(numValue);
				}
				return value;
			}
		}));

		// Prepare data
		const dtData = filteredRows.map(row => {
			const rowData = {};
			agingColumns.forEach(col => {
				rowData[col.fieldname] = row[col.fieldname];
			});
			return rowData;
		});

		// Render with scrollable wrapper
		agingContainer.html(`
			<div class="aging-section-header">
				<h5>Aging Analysis - ${partyType === 'Customer' ? 'Receivables' : 'Payables'}</h5>
			</div>
			<div id="aging_datatable_wrapper" class="datatable-wrapper">
				<div id="aging_datatable"></div>
			</div>
			<div class="gl-report-summary" style="margin-top: 12px;">
				<strong>${filteredRows.length}</strong> parties with outstanding
			</div>
		`).show();

		// Destroy existing aging datatable
		if (this.aging_datatable) {
			this.aging_datatable.destroy();
		}

		// Create DataTable with fixed layout for horizontal scrolling
		this.aging_datatable = new frappe.DataTable('#aging_datatable', {
			columns: dtColumns,
			data: dtData,
			serialNoColumn: false,
			checkboxColumn: false,
			cellHeight: 35,
			layout: 'fixed',
			noDataMessage: 'No aging data',
			getEditor: () => null
		});
	}

	remove_duplicate_rows(rows, columns) {
		// Remove intermediate summary rows - keep only data rows and the LAST Total/Closing rows
		const dataRows = [];
		const accountCol = columns.find(c => c.fieldname === 'account');

		let lastOpeningRow = null;
		let lastTotalRow = null;
		let lastClosingRow = null;
		let summaryRowsSkipped = 0;
		let emptyRowsSkipped = 0;

		rows.forEach((row, index) => {
			if (typeof row === 'object' && !Array.isArray(row)) {
				// Skip completely empty rows (rows with null/empty values in key fields)
				const glEntry = row['gl_entry'];
				const account = row['account'];
				const isEmptyRow = !glEntry && (!account || account === null);
				
				if (isEmptyRow) {
					emptyRowsSkipped++;
					return; // Skip empty separator rows
				}

				const isSummaryRow = this.is_summary_row(row, columns);

				if (isSummaryRow) {
					// Track the LAST occurrence of each summary type
					const accountValue = String(row[accountCol ? accountCol.fieldname : ''] || '').trim().toLowerCase().replace(/'/g, '');
					
					if (accountValue.includes('opening') && !accountValue.includes('closing') && !accountValue.includes('total')) {
						lastOpeningRow = row;
					} else if (accountValue.includes('closing')) {
						// "Closing (Opening + Total)" contains 'closing'
						lastClosingRow = row;
					} else if (accountValue.includes('total') && !accountValue.includes('closing')) {
						// Only 'Total' rows, not 'Closing (Opening + Total)'
						lastTotalRow = row;
					}
					summaryRowsSkipped++;
				} else {
					// Include all data rows (non-summary rows)
					dataRows.push(row);
				}
			}
		});

		// Add only the LAST summary rows at the end (Opening first, then Total, then Closing)
		const finalRows = [...dataRows];
		if (lastOpeningRow) {
			// Only add opening if it has meaningful values (not all zeros)
			const hasValues = parseFloat(lastOpeningRow['debit'] || 0) !== 0 || 
			                  parseFloat(lastOpeningRow['credit'] || 0) !== 0 ||
			                  parseFloat(lastOpeningRow['balance'] || 0) !== 0;
			if (hasValues) {
				finalRows.unshift(lastOpeningRow); // Add at beginning
			}
		}
		if (lastTotalRow) {
			finalRows.push(lastTotalRow);
		}
		if (lastClosingRow) {
			finalRows.push(lastClosingRow);
		}

		return finalRows;
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
		// Check multiple columns for summary keywords (ERPNext puts summary labels in 'account' column, not first column)
		// Check: first column, account column, and any column with summary-like values
		const columnsToCheck = [
			columns[0],
			columns.find(c => c.fieldname === 'account'),
			columns.find(c => c.fieldname === 'voucher_type')
		].filter(Boolean);

		for (const col of columnsToCheck) {
			const value = row[col.fieldname];
			if (typeof value === 'string') {
				const cleanValue = value.replace(/'/g, '').toLowerCase();
				if (cleanValue.includes('opening') ||
					cleanValue.includes('total') ||
					cleanValue.includes('closing')) {
					return true;
				}
			}
		}

		// Also check if gl_entry is null/empty but account has a value starting with quote (ERPNext pattern)
		const glEntry = row['gl_entry'];
		const account = row['account'];
		if (!glEntry && typeof account === 'string' && account.startsWith("'")) {
			return true;
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
		// Reset show aging checkbox and hide container
		this.wrapper.find('#custom_show_aging').prop('checked', false);
		this.wrapper.find('#show_aging_container').hide();
		this.wrapper.find('#aging_report_container').hide().empty();
		this.set_default_dates();

		this.wrapper.find('#report_container').html(`
			<div class="gl-empty-state">
				<i class="fa fa-table"></i>
				<p>Select filters and click "Run Report" to view data</p>
			</div>
		`);
	}

	export_to_excel() {
		const filters = this.get_filters();

		if (!filters.company || !filters.from_date || !filters.to_date) {
			frappe.msgprint(__('Please apply filters first before exporting'));
			return;
		}

		const method = 'label_customizer.label_customizer.page.general_ledger_custom.general_ledger_custom.export_to_excel';
		open_url_post('/api/method/' + method, { filters: JSON.stringify(filters) });
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
			<div class="gl-empty-state">
				<i class="fa fa-pie-chart"></i>
				<p>Click "Generate Report" to view aging analysis</p>
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
			callback: function (r) {
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
			error: function (r) {
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

		// Use receivables columns as base
		const columns = recColumns.length > 0 ? recColumns : payColumns;

		if (!columns.length && !recData.length && !payData.length) {
			this.wrapper.find('#combined_report_container').html(`
				<div class="gl-empty-state">
					<i class="fa fa-inbox"></i>
					<p>No receivables or payables data found</p>
				</div>
			`);
			return;
		}

		// Calculate totals
		const recTotal = parseFloat(receivables.total) || 0;
		const payTotal = parseFloat(payables.total) || 0;
		const netPosition = recTotal - payTotal;

		// Prepare combined data with type column
		const combinedData = [];
		
		recData.forEach(row => {
			if (typeof row === 'object' && !Array.isArray(row)) {
				combinedData.push({ ...row, _type: 'Receivable' });
			}
		});
		
		payData.forEach(row => {
			if (typeof row === 'object' && !Array.isArray(row)) {
				combinedData.push({ ...row, _type: 'Payable' });
			}
		});

		// Prepare columns for DataTable (add Type column first)
		const dtColumns = [
			{
				name: 'Type',
				id: '_type',
				width: 100,
				editable: false,
				sortable: true,
				format: (value) => {
					if (value === 'Receivable') {
						return `<span style="color: #276749; font-weight: 500;">Receivable</span>`;
					} else {
						return `<span style="color: #c05621; font-weight: 500;">Payable</span>`;
					}
				}
			},
			...columns.map(col => ({
				name: col.label || col.fieldname,
				id: col.fieldname,
				fieldtype: col.fieldtype,
				width: col.width || 100,
				editable: false,
				sortable: true,
				format: (value) => {
					if (value === null || value === undefined) return '';
					if (col.fieldtype === 'Currency' || col.fieldtype === 'Float') {
						const numValue = parseFloat(value) || 0;
						return numValue === 0 ? '-' : this.format_currency(numValue);
					}
					if (col.fieldtype === 'Date' && value) {
						return frappe.datetime.str_to_user(value);
					}
					return value;
				}
			}))
		];

		// Render HTML with scrollable wrapper
		this.wrapper.find('#combined_report_container').html(`
			<div class="row" style="margin-bottom: 20px;">
				<div class="col-md-4">
					<div style="background: #c6f6d5; padding: 16px; border-radius: 6px; text-align: center;">
						<div style="font-size: 12px; color: #276749; margin-bottom: 4px;">Total Receivables</div>
						<div style="font-size: 20px; font-weight: 600; color: #22543d;">${this.format_currency(recTotal)}</div>
					</div>
				</div>
				<div class="col-md-4">
					<div style="background: #feebc8; padding: 16px; border-radius: 6px; text-align: center;">
						<div style="font-size: 12px; color: #c05621; margin-bottom: 4px;">Total Payables</div>
						<div style="font-size: 20px; font-weight: 600; color: #7b341e;">${this.format_currency(payTotal)}</div>
					</div>
				</div>
				<div class="col-md-4">
					<div style="background: ${netPosition >= 0 ? '#c6f6d5' : '#fed7d7'}; padding: 16px; border-radius: 6px; text-align: center;">
						<div style="font-size: 12px; color: ${netPosition >= 0 ? '#276749' : '#c53030'}; margin-bottom: 4px;">${netPosition >= 0 ? 'Net Receivable' : 'Net Payable'}</div>
						<div style="font-size: 20px; font-weight: 600; color: ${netPosition >= 0 ? '#22543d' : '#9b2c2c'};">${this.format_currency(Math.abs(netPosition))}</div>
					</div>
				</div>
			</div>
			<div id="combined_datatable_wrapper" class="datatable-wrapper">
				<div id="combined_datatable"></div>
			</div>
			<div class="gl-report-summary" style="margin-top: 12px;">
				<strong>${recData.length}</strong> receivables, <strong>${payData.length}</strong> payables
			</div>
		`);

		// Destroy existing combined datatable
		if (this.combined_datatable) {
			this.combined_datatable.destroy();
		}

		// Create DataTable with fixed layout for horizontal scrolling
		this.combined_datatable = new frappe.DataTable('#combined_datatable', {
			columns: dtColumns,
			data: combinedData,
			serialNoColumn: false,
			checkboxColumn: false,
			cellHeight: 35,
			layout: 'fixed',
			noDataMessage: 'No data',
			getEditor: () => null
		});
	}
}



