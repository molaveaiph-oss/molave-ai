.PHONY: setup dev build clean supabase-start supabase-push supabase-deploy

# 1. Full Initial Setup
setup:
	pnpm install
	@echo "Copy env file if needed:"
	@echo "  cp apps/web/.env.example apps/web/.env"
	@echo "Then run: make supabase-push && make supabase-deploy"

# 2. Development (web only)
dev:
	pnpm dev:web

# 3. Build web app
build:
	pnpm build

# 4. Start local Supabase stack
supabase-start:
	supabase start

# 5. Apply migrations to remote Supabase project
supabase-push:
	supabase db push

# 6. Deploy all Edge Functions
supabase-deploy:
	supabase functions deploy public-book
	supabase functions deploy availability
	supabase functions deploy send-reminder

# 7. Clean up node_modules and build artifacts
clean:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
