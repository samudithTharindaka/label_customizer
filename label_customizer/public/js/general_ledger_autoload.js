// Auto-load General Ledger with all data
console.log("GL Autoload: Initializing...");

(function() {
	if (frappe.query_reports && frappe.query_reports["General Ledger"]) {
		console.log("✅ GL Autoload: Found General Ledger report");
		
		// Store the original onload function
		let original_onload = frappe.query_reports["General Ledger"].onload;
		
		// Override onload to auto-run the report
		frappe.query_reports["General Ledger"].onload = function(report) {
			console.log("✅ GL Autoload: Report onload triggered");
			
			// Call original onload first if it exists
			if (original_onload) {
				original_onload.call(this, report);
			}
			
			// Auto-run the report after a short delay
			setTimeout(function() {
				console.log("✅ GL Autoload: Auto-running report with all data...");
				
				// Set wide date range to get all data
				let today = frappe.datetime.get_today();
				let start_date = "1900-01-01"; // Very old date to get all records
				
				// Set the date filters
				if (report.get_filter('from_date')) {
					report.get_filter('from_date').set_value(start_date);
				}
				if (report.get_filter('to_date')) {
					report.get_filter('to_date').set_value(today);
				}
				
				// Trigger the report refresh
				report.refresh();
				console.log("✅ GL Autoload: Report refreshed with date range:", start_date, "to", today);
			}, 500);
		};
		
		console.log("✅ GL Autoload: Successfully hooked into General Ledger report");
	} else {
		console.log("❌ GL Autoload: General Ledger report not found");
	}
})();


