# Variables
NODE = node
NPM = npm
PROJECT_NAME = sprout-design-tokens
BUILD_DIR = light/build
DARK_BUILD_DIR = dark/build
SCRIPTS_DIR = scripts
CONFIG_FILE = sd.config.js

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
MAGENTA = \033[0;35m
CYAN = \033[0;36m
NC = \033[0m # No Color
BOLD = \033[1m

help:
	@echo "$(BOLD)$(CYAN)🌱 Sprout Design Tokens - Available Commands$(NC)"
	@echo "$(CYAN)=============================================$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(BLUE)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(BOLD)Examples:$(NC)"
	@echo "  make install          # Install dependencies"
	@echo "  make build            # Build all tokens"
	@echo "  make watch            # Start development mode"
	@echo "  make validate         # Validate token structure"
	@echo "  make clean-all        # Clean everything and rebuild"


check: validate analyze

validate: ## Validate token structure and DTCG compliance
	@echo "$(BOLD)$(CYAN)🔍 Validating design tokens...$(NC)"
	$(NODE) $(SCRIPTS_DIR)/validate-tokens.js

analyze: ## Analyze token distribution and provide insights
	@echo "$(BOLD)$(CYAN)📊 Analyzing design tokens...$(NC)"
	$(NODE) $(SCRIPTS_DIR)/analyze-tokens.js

build: 
	npm run build ## Build all tokens
	@echo "$(BOLD)$(GREEN)🚀 Building design tokens

demo:
	open demo.html