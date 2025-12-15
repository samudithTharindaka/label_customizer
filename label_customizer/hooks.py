from . import __version__ as app_version

app_name = "label_customizer"
app_title = "Label Customizer"
app_publisher = "Infoney"
app_description = "Customize labels and auto-load data in ERPNext reports"
app_email = "info@infoney.com"
app_license = "MIT"

# Required apps
required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/label_customizer/css/label_customizer.css"
# app_include_js = "/assets/label_customizer/js/label_customizer.js"

# include js, css files in header of web template
# web_include_css = "/assets/label_customizer/css/label_customizer.css"
# web_include_js = "/assets/label_customizer/js/label_customizer.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "label_customizer.utils.jinja_methods",
# 	"filters": "label_customizer.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "label_customizer.install.before_install"
# after_install = "label_customizer.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "label_customizer.uninstall.before_uninstall"
# after_uninstall = "label_customizer.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "label_customizer.utils.before_app_install"
# after_app_install = "label_customizer.utils.after_app_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "label_customizer.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"label_customizer.tasks.all"
# 	],
# 	"daily": [
# 		"label_customizer.tasks.daily"
# 	],
# 	"hourly": [
# 		"label_customizer.tasks.hourly"
# 	],
# 	"weekly": [
# 		"label_customizer.tasks.weekly"
# 	],
# 	"monthly": [
# 		"label_customizer.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "label_customizer.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "label_customizer.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "label_customizer.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["label_customizer.utils.before_request"]
# after_request = ["label_customizer.utils.after_request"]

# Job Events
# ----------
# before_job = ["label_customizer.utils.before_job"]
# after_job = ["label_customizer.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"label_customizer.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

