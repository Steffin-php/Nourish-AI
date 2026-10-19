import React, { useState, useEffect, useRef } from 'react';
import {
  ScanText,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Info,
  Loader2,
  BookOpen
} from 'lucide-react';
import { ExtractedLabelData, LabelExplanationResult } from '../types';
import { generatePredefinedExplanation } from '../utils/nutritionFallback';

// Preset samples for fast 1-click testing
const PRESET_CEREAL: ExtractedLabelData = {
  productName: 'Honey Almond Crunch Granola',
  servingSize: '45g (about 1/2 cup)',
  calories: '210 kcal',
  protein: '4g',
  carbs: '32g',
  totalSugar: '14g',
  totalFat: '7g',
  saturatedFat: '1g',
  sodium: '115mg',
  ingredientList: 'Whole grain rolled oats, sugar, canola oil, almonds, honey, maltodextrin, soy lecithin, salt, natural flavor, tocopherols (antioxidant).',
  allergenStatement: 'Contains: Almonds, Soy. May contain peanuts, wheat, and milk.'
};

const PRESET_SNACK: ExtractedLabelData = {
  productName: 'Savory Herb Rice Crackers',
  servingSize: '30g (16 crackers)',
  calories: '130 kcal',
  protein: '2g',
  carbs: '22g',
  totalSugar: '1g',
  totalFat: '4g',
  saturatedFat: '0.5g',
  sodium: '260mg',
  ingredientList: 'Rice flour, sunflower oil, maltodextrin, sea salt, dried rosemary, garlic powder, onion powder, yeast extract, citric acid.',
  allergenStatement: 'Processed in a facility that also handles soy and sesame.'
};

export const LabelExplainerView: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'manual' | 'photo'>('manual');
  const [aiStatus, setAiStatus] = useState<{ available: boolean; model: string } | null>(null);

  // Form Fields
  const [productName, setProductName] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [totalSugar, setTotalSugar] = useState('');
  const [totalFat, setTotalFat] = useState('');
  const [saturatedFat, setSaturatedFat] = useState('');
  const [sodium, setSodium] = useState('');
  const [ingredientList, setIngredientList] = useState('');
  const [allergenStatement, setAllergenStatement] = useState('');
  const [rawText, setRawText] = useState('');

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isExtractingImage, setIsExtractingImage] = useState(false);
  const [extractionConfidence, setExtractionConfidence] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Explanation Processing State
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationResult, setExplanationResult] = useState<LabelExplanationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showNewAnalysisConfirm, setShowNewAnalysisConfirm] = useState(false);

  // Check AI service status on mount
  useEffect(() => {
    fetch('/api/ai-status')
      .then(res => res.json())
      .then(data => setAiStatus(data))
      .catch(() => setAiStatus({ available: false, model: 'offline' }));
  }, []);

  const handleApplyPreset = (preset: ExtractedLabelData) => {
    setProductName(preset.productName || '');
    setServingSize(preset.servingSize || '');
    setCalories(preset.calories || '');
    setProtein(preset.protein || '');
    setCarbs(preset.carbs || '');
    setTotalSugar(preset.totalSugar || '');
    setTotalFat(preset.totalFat || '');
    setSaturatedFat(preset.saturatedFat || '');
    setSodium(preset.sodium || '');
    setIngredientList(preset.ingredientList || '');
    setAllergenStatement(preset.allergenStatement || '');
    setRawText('');
    setErrorMessage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image file is too large. Please choose a photo under 10MB.');
      return;
    }

    setErrorMessage(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setExtractionConfidence(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // OCR extraction step: sends photo to Gemini vision to extract text into editable form fields
  const handleExtractFromImage = async () => {
    if (!imagePreview) return;
    setIsExtractingImage(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/extract-label-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imageFile?.type || 'image/jpeg'
        })
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.error || 'Failed to extract text from this photo.');
      }

      const extracted: ExtractedLabelData = resJson.data;

      // Populate editable fields with extracted data
      if (extracted.productName) setProductName(extracted.productName);
      if (extracted.servingSize) setServingSize(extracted.servingSize);
      if (extracted.calories) setCalories(extracted.calories);
      if (extracted.protein) setProtein(extracted.protein);
      if (extracted.carbs) setCarbs(extracted.carbs);
      if (extracted.totalSugar) setTotalSugar(extracted.totalSugar);
      if (extracted.totalFat) setTotalFat(extracted.totalFat);
      if (extracted.saturatedFat) setSaturatedFat(extracted.saturatedFat);
      if (extracted.sodium) setSodium(extracted.sodium);
      if (extracted.ingredientList) setIngredientList(extracted.ingredientList);
      if (extracted.allergenStatement) setAllergenStatement(extracted.allergenStatement);
      if (extracted.rawText) setRawText(extracted.rawText);

      setExtractionConfidence(
        extracted.confidenceNote ||
          'Label text was extracted. Please review and confirm the numbers below before generating your explanation.'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Photo processing failed.';
      setErrorMessage(
        `${msg} You can type or paste the visible numbers into the form below instead.`
      );
    } finally {
      setIsExtractingImage(false);
    }
  };

  // Submit label details for AI or Fallback explanation
  const handleExplain = async () => {
    // Basic check: at least something should be entered
    const hasData =
      productName.trim() ||
      servingSize.trim() ||
      calories.trim() ||
      protein.trim() ||
      carbs.trim() ||
      totalSugar.trim() ||
      totalFat.trim() ||
      sodium.trim() ||
      ingredientList.trim() ||
      allergenStatement.trim() ||
      rawText.trim();

    if (!hasData && !imagePreview) {
      setErrorMessage('Please enter at least one nutrition value, ingredient list, or upload a label photo.');
      return;
    }

    setIsExplaining(true);
    setErrorMessage(null);

    const payload: ExtractedLabelData = {
      productName: productName.trim() || undefined,
      servingSize: servingSize.trim() || undefined,
      calories: calories.trim() || undefined,
      protein: protein.trim() || undefined,
      carbs: carbs.trim() || undefined,
      totalSugar: totalSugar.trim() || undefined,
      totalFat: totalFat.trim() || undefined,
      saturatedFat: saturatedFat.trim() || undefined,
      sodium: sodium.trim() || undefined,
      ingredientList: ingredientList.trim() || undefined,
      allergenStatement: allergenStatement.trim() || undefined,
      rawText: rawText.trim() || undefined
    };

    try {
      const response = await fetch('/api/explain-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labelData: payload })
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || 'Server was unable to process the label.');
      }

      setExplanationResult(resJson.data);
    } catch (err: unknown) {
      // Offline fallback
      const fallback = generatePredefinedExplanation(payload);
      setExplanationResult(fallback);
      setErrorMessage('Could not connect to online AI model. Displaying standard reference explanation.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleStartNewAnalysis = () => {
    setExplanationResult(null);
    setErrorMessage(null);
    setExtractionConfidence(null);
    setProductName('');
    setServingSize('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setTotalSugar('');
    setTotalFat('');
    setSaturatedFat('');
    setSodium('');
    setIngredientList('');
    setAllergenStatement('');
    setRawText('');
    setImagePreview(null);
    setImageFile(null);
    setShowNewAnalysisConfirm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#252B27]">
          Understand what's in your food.
        </h1>
        <p className="text-sm text-[#737B74] mt-0.5">
          Enter the information on a food package or upload a clear photo. We'll help explain it in simple English.
        </p>
      </div>

      {/* AI Connection Status Indicator */}
      <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] flex items-center justify-between text-xs text-[#737B74] shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#52765C]" />
          <span>
            {aiStatus?.available ? (
              <span>
                Connected to <strong className="text-[#252B27]">Gemini 3.8 Flash</strong> for label interpretation.
              </span>
            ) : (
              <span>
                Running in <strong className="text-[#252B27]">Standard Reference Guide</strong> mode (predefined dietary breakdown & ingredient glossary).
              </span>
            )}
          </span>
        </div>
        <span className="text-[11px] text-[#737B74] hidden sm:inline">
          {aiStatus?.available ? 'AI Active' : 'Offline Reference Ready'}
        </span>
      </div>

      {/* If explanation is ready, render the full 6-part results */}
      {explanationResult ? (
        <section aria-label="Label Explanation Results" className="space-y-6">
          {/* Top Result Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E9E2]">
              <div>
                <span className="text-xs text-[#737B74]">
                  {explanationResult.isAiGenerated ? 'AI Label Analysis' : 'Predefined Nutritional Reference'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#252B27]">
                  {explanationResult.productName || 'Food Label Breakdown'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExplanationResult(null)}
                  className="min-h-[40px] px-4 py-1.5 text-xs font-semibold text-[#52765C] bg-[#E8F0E6] hover:bg-[#52765C] hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  Change Label Information
                </button>
                <button
                  onClick={() => setShowNewAnalysisConfirm(true)}
                  className="min-h-[40px] px-4 py-1.5 text-xs font-medium text-[#737B74] hover:text-[#252B27] bg-[#FAFAF6] border border-[#E7E9E2] rounded-xl transition-colors cursor-pointer"
                >
                  Start New
                </button>
              </div>
            </div>

            {/* 1. Simple Summary */}
            <div>
              <h3 className="text-xs font-semibold text-[#737B74] uppercase tracking-wider mb-1.5">
                1. Simple Summary
              </h3>
              <p className="text-sm sm:text-base text-[#252B27] leading-relaxed">
                {explanationResult.simpleSummary}
              </p>
            </div>
          </div>

          {/* 2. Nutrition Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[#252B27] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#52765C]" />
              <span>2. Nutrition Breakdown</span>
            </h3>
            <p className="text-xs text-[#737B74]">
              Values explained in context of typical daily dietary benchmarks without inventing missing numbers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {explanationResult.nutritionBreakdown.map((item, idx) => {
                let badgeColor = 'text-[#52765C] bg-[#E8F0E6]';
                if (item.indicator === 'high') badgeColor = 'text-[#B87932] bg-[#F4EBDD] font-semibold';
                if (item.indicator === 'moderate') badgeColor = 'text-[#737B74] bg-[#FAFAF6]';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-[#252B27]">{item.nutrient}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-lg tabular-nums ${badgeColor}`}>
                        {item.amount}
                      </span>
                    </div>
                    <p className="text-xs text-[#737B74] leading-relaxed">
                      {item.context}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Ingredient Guide */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[#252B27] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#52765C]" />
              <span>3. Ingredient Guide</span>
            </h3>
            <p className="text-xs text-[#737B74]">
              Plain-English explanation of food additives, stabilizers, and emulsifiers found on the label.
            </p>

            {explanationResult.ingredientGuide.length > 0 ? (
              <div className="space-y-3 pt-1">
                {explanationResult.ingredientGuide.map((ing, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-[#252B27]">{ing.ingredient}</span>
                      <span className="text-xs text-[#52765C] font-medium">{ing.purpose}</span>
                    </div>
                    <p className="text-xs text-[#737B74] leading-relaxed">{ing.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#737B74] italic">
                No complex industrial additives or ingredients required specialized explanation.
              </p>
            )}
          </div>

          {/* 4. Allergen Information */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-[#252B27] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#B87932]" />
              <span>4. Allergen Information</span>
            </h3>

            {explanationResult.allergenInformation.declared.length > 0 ? (
              <div>
                <p className="text-xs text-[#737B74] mb-2">
                  Explicitly declared allergens identified in the supplied text:
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {explanationResult.allergenInformation.declared.map((allergen, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-[#F4EBDD] text-[#B87932] border border-[#B87932]/30 text-xs font-semibold"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#737B74]">
                No common allergens were explicitly listed in the provided label text.
              </p>
            )}

            <div className="p-3.5 rounded-2xl bg-[#F4EBDD]/50 border border-[#E7E9E2] text-xs text-[#737B74] leading-relaxed">
              <strong className="text-[#252B27] font-semibold block mb-0.5">Allergen Precaution:</strong>
              {explanationResult.allergenInformation.crossContaminationRiskNote}
            </div>
          </div>

          {/* 5. What to Notice */}
          {explanationResult.whatToNotice.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-[#252B27] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#52765C]" />
                <span>5. What to Notice</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {explanationResult.whatToNotice.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] space-y-1.5">
                    <span className="font-semibold text-xs text-[#252B27] block">{item.title}</span>
                    <p className="text-xs text-[#737B74] leading-relaxed">{item.observation}</p>
                    <p className="text-xs text-[#52765C] pt-1 leading-relaxed font-medium">
                      💡 {item.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Information Missing */}
          {explanationResult.missingInformation.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-2">
              <h3 className="text-xs font-semibold text-[#737B74] uppercase tracking-wider">
                6. Information Not Provided or Legible
              </h3>
              <ul className="space-y-1 text-xs text-[#737B74]">
                {explanationResult.missingInformation.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#737B74]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Medical & Nutritional Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] text-xs text-[#737B74] leading-relaxed">
            <strong className="text-[#252B27] font-semibold block mb-0.5">Disclaimer:</strong>
            {explanationResult.disclaimer}
          </div>

          {/* Bottom actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setExplanationResult(null)}
              className="min-h-[44px] px-6 py-2.5 text-xs font-semibold text-[#52765C] bg-[#E8F0E6] hover:bg-[#52765C] hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Change Label Information
            </button>
            <button
              onClick={() => setShowNewAnalysisConfirm(true)}
              className="min-h-[44px] px-6 py-2.5 text-xs font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors cursor-pointer"
            >
              Start New Analysis
            </button>
          </div>
        </section>
      ) : (
        /* Input & Submission Form */
        <div className="space-y-6">
          {/* Method Selection Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#FFFFFF] rounded-2xl border border-[#E7E9E2] max-w-md">
            <button
              onClick={() => setActiveMode('manual')}
              className={`flex-1 min-h-[42px] px-4 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer text-center ${
                activeMode === 'manual'
                  ? 'bg-[#52765C] text-white font-semibold shadow-2xs'
                  : 'text-[#737B74] hover:text-[#252B27]'
              }`}
            >
              Option A: Enter Label Details
            </button>
            <button
              onClick={() => setActiveMode('photo')}
              className={`flex-1 min-h-[42px] px-4 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer text-center ${
                activeMode === 'photo'
                  ? 'bg-[#52765C] text-white font-semibold shadow-2xs'
                  : 'text-[#737B74] hover:text-[#252B27]'
              }`}
            >
              Option B: Upload Label Photo
            </button>
          </div>

          {/* Error Message if present */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-[#B94A48]/10 border border-[#B94A48]/30 text-xs text-[#B94A48] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="flex-1 font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Option B: Photo Upload Dropzone */}
          {activeMode === 'photo' && (
            <section
              aria-label="Food Label Photo Upload"
              className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-4"
            >
              <h2 className="text-base font-bold text-[#252B27] flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#52765C]" />
                <span>Upload Food Label Photo</span>
              </h2>
              <p className="text-xs text-[#737B74]">
                Choose a clear photo showing the ingredient list and nutrition table. Supported formats: JPG, PNG, and WebP (up to 10MB).
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
                id="photo-upload-input"
              />

              {!imagePreview ? (
                <label
                  htmlFor="photo-upload-input"
                  className="border-2 border-dashed border-[#E7E9E2] hover:border-[#52765C]/50 bg-[#FAFAF6] rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors text-center min-h-[200px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F0E6] text-[#52765C] flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#52765C] hover:underline block">
                      Choose a photo or take a picture
                    </span>
                    <span className="text-xs text-[#737B74] mt-1 block">
                      Ensure text is sharply in focus and not washed out by glare
                    </span>
                  </div>
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-[#E7E9E2] max-h-72 bg-[#FAFAF6] flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Selected food label"
                      className="max-h-72 object-contain"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                      title="Remove image"
                      aria-label="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#737B74] hover:text-[#252B27] bg-[#FAFAF6] border border-[#E7E9E2] rounded-xl cursor-pointer"
                    >
                      Replace Photo
                    </button>

                    <button
                      onClick={handleExtractFromImage}
                      disabled={isExtractingImage}
                      className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isExtractingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Reading Label with AI...</span>
                        </>
                      ) : (
                        <>
                          <ScanText className="w-4 h-4" />
                          <span>Extract Text & Fill Form Below</span>
                        </>
                      )}
                    </button>
                  </div>

                  {extractionConfidence && (
                    <div className="p-3.5 rounded-2xl bg-[#E8F0E6] text-xs text-[#52765C] border border-[#52765C]/30 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{extractionConfidence}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Form Fields: Editable input fields */}
          <section
            aria-label="Nutrition & Ingredient Form"
            className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E9E2]">
              <div>
                <h2 className="text-base font-bold text-[#252B27]">
                  Label Information
                </h2>
                <p className="text-xs text-[#737B74] mt-0.5">
                  Enter exactly as printed on the package. You can leave unknown values blank.
                </p>
              </div>

              {/* Sample Presets for quick testing */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#737B74] hidden sm:inline">Try a sample:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(PRESET_CEREAL)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAFAF6] hover:bg-[#E8F0E6] text-[#52765C] border border-[#E7E9E2] cursor-pointer font-medium"
                >
                  Granola Cereal
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(PRESET_SNACK)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAFAF6] hover:bg-[#E8F0E6] text-[#52765C] border border-[#E7E9E2] cursor-pointer font-medium"
                >
                  Rice Crackers
                </button>
              </div>
            </div>

            {/* Product & Serving Size in 2-col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="label-product-name" className="block text-xs font-semibold text-[#252B27] mb-1">
                  Product name <span className="text-[#737B74] font-normal">(optional)</span>
                </label>
                <input
                  id="label-product-name"
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Honey Granola"
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                />
              </div>

              <div>
                <label htmlFor="label-serving-size" className="block text-xs font-semibold text-[#252B27] mb-1">
                  Serving size <span className="text-[#737B74] font-normal">(optional)</span>
                </label>
                <input
                  id="label-serving-size"
                  type="text"
                  value={servingSize}
                  onChange={e => setServingSize(e.target.value)}
                  placeholder="e.g. 30g, 1 cup (240ml), 2 slices"
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                />
              </div>
            </div>

            {/* 7 Nutrition Fields in responsive grid */}
            <div>
              <span className="block text-xs font-semibold text-[#737B74] uppercase tracking-wider mb-2">
                Nutrition Facts (enter values with units, e.g. 150 kcal, 4g, 200mg)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="label-calories" className="block text-xs font-semibold text-[#252B27] mb-1">
                    Calories
                  </label>
                  <input
                    id="label-calories"
                    type="text"
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                  />
                </div>

                <div>
                  <label htmlFor="label-protein" className="block text-xs font-semibold text-[#252B27] mb-1">
                    Protein
                  </label>
                  <input
                    id="label-protein"
                    type="text"
                    value={protein}
                    onChange={e => setProtein(e.target.value)}
                    placeholder="e.g. 5g"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                  />
                </div>

                <div>
                  <label htmlFor="label-carbs" className="block text-xs font-semibold text-[#252B27] mb-1">
                    Carbohydrates
                  </label>
                  <input
                    id="label-carbs"
                    type="text"
                    value={carbs}
                    onChange={e => setCarbs(e.target.value)}
                    placeholder="e.g. 24g"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                  />
                </div>

                <div>
                  <label htmlFor="label-sugar" className="block text-xs font-semibold text-[#252B27] mb-1">
                    Total Sugar
                  </label>
                  <input
                    id="label-sugar"
                    type="text"
                    value={totalSugar}
                    onChange={e => setTotalSugar(e.target.value)}
                    placeholder="e.g. 12g"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                  />
                </div>

                <div>
                  <label htmlFor="label-fat" className="block text-xs font-semibold text-[#252B27] mb-1">
                    Total Fat
                  </label>
                  <input
                    id="label-fat"
                    type="text"
                    value={totalFat}
                    onChange={e => setTotalFat(e.target.value)}
                    placeholder="e.g. 6g"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                  />
                </div>

                <div>
                  <label htmlFor="label-sat-fat" className="block text-xs font-semibold text-[#252B27] mb-1">
                    Saturated Fat
                  </label>
                  <input
                    id="label-sat-fat"
                    type="text"
                    value={saturatedFat}
                    onChange={e => setSaturatedFat(e.target.value)}
                    placeholder="e.g. 1.5g"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="label-sodium" className="block text-xs font-semibold text-[#252B27] mb-1">
                    Sodium or Salt
                  </label>
                  <input
                    id="label-sodium"
                    type="text"
                    value={sodium}
                    onChange={e => setSodium(e.target.value)}
                    placeholder="e.g. 210mg or 0.5g salt"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
                  />
                </div>
              </div>
            </div>

            {/* Ingredient List Text Area */}
            <div>
              <label htmlFor="label-ingredients" className="block text-xs font-semibold text-[#252B27] mb-1">
                Ingredient list <span className="text-[#737B74] font-normal">(paste or type full ingredients)</span>
              </label>
              <textarea
                id="label-ingredients"
                rows={3}
                value={ingredientList}
                onChange={e => setIngredientList(e.target.value)}
                placeholder="e.g. Rolled oats, sugar, canola oil, almonds, maltodextrin, soy lecithin, salt..."
                className="w-full p-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
              />
            </div>

            {/* Allergen Statement */}
            <div>
              <label htmlFor="label-allergens" className="block text-xs font-semibold text-[#252B27] mb-1">
                Declared allergen statement <span className="text-[#737B74] font-normal">(optional)</span>
              </label>
              <input
                id="label-allergens"
                type="text"
                value={allergenStatement}
                onChange={e => setAllergenStatement(e.target.value)}
                placeholder="e.g. Contains: Wheat, Soy. May contain peanuts."
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
              />
            </div>

            {/* Full text paste area */}
            <div>
              <label htmlFor="label-raw-text" className="block text-xs font-semibold text-[#252B27] mb-1">
                Other visible label text or notes <span className="text-[#737B74] font-normal">(optional)</span>
              </label>
              <textarea
                id="label-raw-text"
                rows={2}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Paste any other text printed on the label, packaging claims, or certifications..."
                className="w-full p-3 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#E7E9E2] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#737B74]">
                We only explain what is actually provided and never guess missing numbers.
              </span>
              <button
                type="button"
                onClick={handleExplain}
                disabled={isExplaining}
                className="min-h-[44px] w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExplaining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Food Label...</span>
                  </>
                ) : (
                  <>
                    <ScanText className="w-4 h-4" />
                    <span>Explain My Label</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Start New Analysis Confirmation Modal */}
      {showNewAnalysisConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E7E9E2] rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-[#252B27]">Start New Analysis?</h3>
            <p className="text-xs text-[#737B74] leading-relaxed">
              This will clear the current label details and explanation so you can analyze a different food product.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowNewAnalysisConfirm(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#737B74] hover:text-[#252B27]"
              >
                Cancel
              </button>
              <button
                onClick={handleStartNewAnalysis}
                className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors cursor-pointer"
              >
                Confirm New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
