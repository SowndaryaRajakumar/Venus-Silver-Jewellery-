# TODO - Category/Subcategory Architecture Fix

- [x] Step 1: Refactor `app/products/create/page.tsx`

  - [ ] Use shared store schema: `categoryId` + `subCategoryId`
  - [ ] Dependent subcategory dropdown updates dynamically based on selected category
  - [ ] Disable subcategory dropdown until category is selected
  - [ ] Remove inline subcategory creation modal
  - [ ] Redirect “Create New Sub Category” to `/subcategories?prefillCategoryId=...`

- [ ] Step 2: Refactor `app/subcategories/page.tsx`
  - [ ] Use shared store (`useAdminStore`) instead of local `useState` seeded from `SUBCATEGORIES_DATA`
  - [ ] Add query-param support: `prefillCategoryId` to open Add modal prefilled

- [ ] Step 3: Ensure `app/categories/page.tsx` uses shared store correctly (already partially done)

- [ ] Step 4: Regression checks
  - [ ] Build / typecheck
  - [ ] Confirm dropdown relationship works after adding categories/subcategories

