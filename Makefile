I18N_DIR := scripts/i18n_tools
UV       := uv run --directory $(I18N_DIR)

.PHONY: i18n-setup i18n-check i18n-sort i18n-stats i18n-diff i18n-fix help

help:           ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

i18n-setup:     ## Install Python dependencies for i18n CLI tools
	uv sync --directory $(I18N_DIR)

i18n-check:     ## Check for missing translation keys between zh.json and en.json
	$(UV) python src/cli.py check

i18n-sort:      ## Sort all keys alphabetically in zh.json and en.json
	$(UV) python src/cli.py sort

i18n-stats:     ## Show translation progress statistics
	$(UV) python src/cli.py stats

i18n-diff:      ## Show structural differences between zh.json and en.json
	$(UV) python src/cli.py diff

i18n-fix: i18n-check i18n-sort  ## Run check + sort in one go
