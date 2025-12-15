// Override General Ledger report label
// This file is loaded AFTER erpnext's general_ledger.js due to app loading order

console.log("Label Customizer: Extending General Ledger report...");

// Extend the existing General Ledger report definition
(function() {
	// Check if the report is already defined
	if (frappe.query_reports && frappe.query_reports["General Ledger"]) {
		console.log("✅ Label Customizer: General Ledger report found, modifying now...");
		
		// Modify the include_dimensions filter label
		let filters = frappe.query_reports["General Ledger"].filters;
		for (let i = 0; i < filters.length; i++) {
			if (filters[i].fieldname === "include_dimensions") {
				console.log("✅ Found include_dimensions filter at index", i);
				console.log("   Old label:", filters[i].label);
				filters[i].label = __("Include Accounting Dimensions");
				console.log("   New label:", filters[i].label);
				break;
			}
		}
		
		// Add a custom test filter
		filters.push({
			fieldname: "custom_test_filter",
			label: __("🎯 Custom Test Filter"),
			fieldtype: "Check",
			default: 0
		});
		console.log("✅ Added custom test filter");
		console.log("✅ Label Customizer: Modifications complete!");
	} else {
		console.log("❌ Label Customizer: General Ledger report not found yet");
	}
})();

