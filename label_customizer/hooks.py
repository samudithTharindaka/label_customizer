from . import __version__ as app_version

app_name = "label_customizer"
app_title = "Label Customizer"
app_publisher = "Infoney"
app_description = "Customize labels and auto-load data in ERPNext reports"
app_email = "info@infoney.com"
app_license = "MIT"

# Required apps
required_apps = ["erpnext"]

# Report overrides - load our JS after the report's JS
report_js = {
	"General Ledger": "public/js/general_ledger_autoload.js"
}

# Website route rules
website_route_rules = [
	{"from_route": "/general-ledger", "to_route": "reports/general-ledger"},
]

# Web include js
web_include_js = "/assets/label_customizer/js/general_ledger_custom.js"

