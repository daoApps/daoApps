# Tasks

- [ ] Task 1: Update all configuration files with new path references
  - [ ] Update `.github/workflows/cd.yml`: replace all `./apps/AgentPit` with `./apps/Flexloop`
  - [ ] Update `.github/workflows/ci.yml`: replace all `./apps/AgentPit` with `./apps/Flexloop`
  - [ ] Update `scripts/deployment/build-app.sh`: update the fallback build output path detection from `apps/AgentPit` to `apps/Flexloop`
  - [ ] Search entire project for any other hardcoded `apps/AgentPit` path references and update them

- [ ] Task 2: Rename the folder from `AgentPit` to `Flexloop` preserving structure
  - [ ] Verify all files are intact in the source folder
  - [ ] Move all content from `apps/AgentPit/` to `apps/Flexloop/`
  - [ ] Verify all files and subfolders were copied correctly
  - [ ] Remove the original `apps/AgentPit` folder after successful move

- [ ] Task 3: Verify project can install dependencies and build
  - [ ] Run `npm install` in the new `apps/Flexloop` directory
  - [ ] Run TypeScript type check to ensure no compilation errors
  - [ ] Run `npm run build` to verify production build succeeds

- [ ] Task 4: Verify development server can start
  - [ ] Run `npm run dev` and verify server starts successfully
  - [ ] Check for any runtime errors in the console

- [ ] Task 5: Run tests to ensure all functionality works
  - [ ] Run unit tests with `npm run test:run`
  - [ ] Verify all tests pass

# Task Dependencies

- Task 2 depends on Task 1 being completed (update references before moving to avoid broken references during move)
- Task 3, 4, 5 all depend on Task 2 being completed
