# NutriGO integrated ecosystem — starter v0.1

This is a working, static-first Progressive Web App starter intended to consolidate the NutriGO recipe, nutrition, guided cooking and recommendation concepts into one mobile-friendly application.

## Included now

- Responsive single-page app with navigation for Home, Recipes, Nutrition, Cooking and AI Ideas.
- Recipe discovery and guided cooking steps.
- Optional camera preview (permission requested only after the user taps Start camera).
- Ingredient calculator and local browser storage.
- Transparent rule-based meal recommendations.
- PWA manifest and service worker for installability/offline shell.
- Project video link supplied by the team.

## Important prototype limitations

1. All recipe and ingredient nutrition figures currently in `app.js` are illustrative placeholders. They are not verified dietary data and must not be used for real health decisions.
2. The recommendation feature is rule-based, not a trained AI model.
3. User data is stored in the current browser only. It does not synchronise between devices.
4. Camera preview does not identify food, recognise cooking actions, or create spatial AR overlays.
5. No clinical, disease-specific or medical dietary recommendations are made.

## Run locally

Use a local web server (camera and PWA features require localhost or HTTPS):

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Publish free with GitHub Pages

1. Create a GitHub repository, e.g. `nutrigo`.
2. Upload the contents of this folder to the repository root.
3. In repository Settings → Pages, choose Deploy from a branch.
4. Select `main` and `/ (root)`, then Save.
5. Wait for the HTTPS Pages URL to appear.
6. Test on iPhone Safari and Android Chrome.

GitHub Pages is static hosting. This version needs no server or API key. Do not put secret keys in frontend JavaScript.

## iPhone / Android installation

- Android: open the HTTPS site in Chrome and use Install app / Add to Home screen.
- iPhone/iPad: open the HTTPS site in Safari → Share → Add to Home Screen.
- Camera access requires HTTPS (or localhost) and user permission.

## Data strategy

Use Singapore-relevant, verified food-composition data before public release. The Singapore Health Promotion Board's SG FoodID provides nutritional composition information for foods and beverages commonly found in Singapore:
https://www.hpb.gov.sg/healthy-living/food-and-beverage/sgfoodid/

Record the source, food description, edible portion, preparation state, units and date checked for every imported food record. Avoid mixing raw and cooked values.

## Suggested next backend step

When multi-device accounts and shared data are needed, create a Supabase project and add tables for:
- profiles
- ingredients
- recipes
- recipe_ingredients
- nutrition_facts
- meal_logs
- preferences
- recommendation_feedback

Keep Supabase Row Level Security enabled for user-owned records. Never expose the service-role key in browser code.

## Machine-learning plan

Do not train on invented or synthetic rows and describe the result as a validated model. First collect a representative dataset with consent and a clear purpose. Decide on a measurable target, e.g. user-rated recipe suitability, and record input features and outcome labels. Split data by user or time where appropriate to avoid leakage. Compare a simple baseline with a tree-based model and report held-out performance, class balance and limitations.

See `ml/train_model.py` for a starter training pipeline that expects a real CSV dataset.
