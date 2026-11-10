# NutriGO food recognition: technical implementation plan

## Decision
Support both ingredient recognition and Singaporean dish recognition, and target both mobile devices and computers. Build the ingredient detector first because ingredient-level outputs are needed downstream for portion and nutrition calculations. Add dish classification as a parallel, separate task.

## Architecture
- Existing PWA (`index.html`, `app.js`, `styles.css`): retain as the main user experience.
- First lab page (`ai-lab.html`): isolated prototype for validating image input and browser inference without destabilising the current app.
- Inference: MediaPipe Tasks Vision in the browser for the first proof of concept.
- Training: Python/PyTorch workflow for custom models once a labelled dataset exists.
- Model outputs: ingredient object detections (class, confidence, bounding box) and whole-image dish classification (class probabilities).
- Later stages: segmentation, camera tracking, calibrated volume estimation, mass estimation and verified nutrition calculations.

## Why two recognition tasks?
A whole dish label such as `chicken_rice` does not tell us how much chicken, rice, sauce or oil is present. Ingredient detection and dish classification therefore need distinct labels, training targets and evaluation.

## Phase 1 — Browser inference proof of concept
1. Upload a photograph in `ai-lab.html`.
2. Run a public general-purpose object detector and image classifier locally in the browser.
3. Display bounding boxes and confidence scores.
4. Test on desktop and iPhone/iPad.
5. Record unsupported cases and runtime issues.

The included public models are baselines only, not NutriGO food models. Their predictions must not feed the nutrition engine.

## Phase 2 — Dataset and custom model
Start with a manageable set of ingredient classes from `data/food-labels.json`. Collect diverse, permissioned photographs across devices, lighting, backgrounds, plate types, food preparation states and mixed dishes. Annotate each visible ingredient instance with a bounding box. Separately label each image with its dish category.

Keep training, validation and test sets separated by capture session/source/contributor where possible. Avoid near-duplicate images across splits. Record annotation rules and ambiguous examples.

## Phase 3 — Evaluation
Ingredient detector: precision, recall, mAP@50 and preferably mAP@50:95, per-class AP, false positives and missed detections.
Dish classifier: top-1/top-5 accuracy, per-class precision/recall and confusion matrix.
Device testing: load time, model download size, inference latency, memory use and thermal/battery impact on target devices.

Do not claim an accuracy target until the held-out evaluation has been run.

## Phase 4 — Integration
Replace the generic baseline model with a custom model compatible with the chosen inference runtime. Add a review interface so users can correct labels. Only confirmed food identities should be sent to the nutrition matching layer.

## Explicit limitations
- A 2D photograph alone cannot reliably determine food depth or mass.
- Bounding boxes are not segmentation masks.
- A dish classifier cannot infer all hidden ingredients or recipe quantities.
- Model confidence is not the same as calibrated probability or correctness.
- Do not calculate nutrition from unverified labels or guessed weights.
