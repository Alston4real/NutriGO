# NutriGO Food Recognition Lab — starter files

## Included
- `ai-lab.html`: standalone browser prototype for image upload, MediaPipe object detection, whole-image classification, bounding boxes and confidence scores.
- `data/food-labels.json`: proposed NutriGO ingredient and Singaporean dish training taxonomy.
- `ml/evaluation-template.csv`: blank template for recording model predictions and ground truth.
- `IMPLEMENTATION-PLAN.md`: staged plan and testing instructions.

## Important: baseline, not custom food AI
The public baseline models are general-purpose models. The detector uses broad COCO object categories; the classifier uses ImageNet categories. They are not trained specifically for NutriGO, Singaporean food or nutrition. Do not use their predictions for nutrition calculations or health decisions.

## Add to the existing GitHub repository
1. Open https://github.com/Alston4real/NutriGO
2. Choose **Add file → Upload files**.
3. Upload `ai-lab.html` to the repository root.
4. Upload the `data` folder and its `food-labels.json` file, preserving the folder path.
5. Commit the changes to `main`.
6. After GitHub Pages publishes, open:
   https://alston4real.github.io/NutriGO/ai-lab.html

This adds a new page. It does not replace `index.html`, `app.js`, `styles.css` or your existing app.

## Test on desktop and mobile
- Open the page on desktop Chrome or Edge.
- Open it on iPhone/iPad Safari.
- Select a food photograph and press **Analyse photograph**.
- The first run downloads the runtime and model files, so an internet connection is required.
- Check whether bounding boxes and labels correspond to visible objects.
- Try several lighting conditions, plate arrangements and camera angles.

## Privacy
The page processes the selected image in the browser. It contains no image upload endpoint, database connection, analytics or API key. The JavaScript runtime and public model files are downloaded from third-party public hosting.

## Development stages
1. Confirm the baseline page loads on target browsers.
2. Build a labelled dataset for ingredient object detection and a separate dataset for dish classification.
3. Train and evaluate custom models using held-out images.
4. Replace the generic baseline model URLs with the exported NutriGO models.
5. Add user correction and persist only confirmed labels.
6. Connect confirmed food identities to verified food-composition records.
7. Add segmentation and calibrated quantity estimation later.

## Evaluation
Report precision, recall, mAP and class-wise confusion for object detection; top-1/top-5 accuracy and a confusion matrix for dish classification. Split data by capture session, source or contributor where possible, rather than randomly splitting near-duplicate photos.
