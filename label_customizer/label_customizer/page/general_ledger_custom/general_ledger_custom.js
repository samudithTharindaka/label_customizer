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
			font-size: 13px;
		}
		#report_container table th {
			background-color: #f8f9fa;
			font-weight: 600;
			position: sticky;
			top: 0;
			z-index: 10;
		}
		#report_container .table-hover tbody tr:hover {
			background-color: #f1f5f9;
			cursor: pointer;
		}
		.amount-debit {
			color: #dc3545;
			font-weight: 500;
		}
		.amount-credit {
			color: #28a745;
			font-weight: 500;
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
			voucher_type: this.wrapper.find('#custom_voucher_type').val()
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
			method: 'label_customizer.page.general_ledger_custom.general_ledger_custom.get_report_data',
			args: { filters: filters },
			callback: function(r) {
				if (r.message) {
					me.render_report(r.message);
				}
			},
			error: function(r) {
				me.wrapper.find('#report_container').html(`
					<div class="alert alert-danger">
						<strong>Error!</strong> Failed to load report. Please try again.
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
		rows.forEach(row => {
			if (typeof row === 'object' && !Array.isArray(row)) {
				html += '<tr>';
				columns.forEach(col => {
					let value = row[col.fieldname] || '';
					let cellClass = '';
					
					// Format numbers
					if (col.fieldtype === 'Currency' || col.fieldtype === 'Float') {
						value = this.format_currency(value);
						
						// Add color classes for debit/credit
						if (col.fieldname === 'debit' && parseFloat(value.replace(/,/g, '')) > 0) {
							cellClass = 'amount-debit';
						} else if (col.fieldname === 'credit' && parseFloat(value.replace(/,/g, '')) > 0) {
							cellClass = 'amount-credit';
						}
					}
					
					// Format dates
					if (col.fieldtype === 'Date' && value) {
						value = frappe.datetime.str_to_user(value);
					}
					
					html += `<td class="${cellClass}">${value}</td>`;
				});
				html += '</tr>';
			}
		});
		html += '</tbody>';
		html += '</table></div>';
		
		// Add summary
		html += `<div class="alert alert-success" style="margin-top: 20px;">
			<strong>✅ Report Generated Successfully</strong><br>
			Total Entries: ${rows.length}
		</div>`;
		
		this.wrapper.find('#report_container').html(html);
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


