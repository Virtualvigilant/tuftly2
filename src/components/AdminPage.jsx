import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  ImagePlus,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { BRAND_CONFIG, CATEGORIES, formatKES } from '../data/tuftlyConfig';
import {
  CATEGORY_LABELS,
  compressImageFile,
  isAdminSessionUnlocked,
  setAdminSessionUnlocked,
} from '../data/productStore';

const STUDIO_SAMPLE_IMAGES = [
  { label: 'Savanna Rug', path: '/images/rug-savanna-contour.jpg' },
  { label: 'Blush Arch Rug', path: '/images/rug-rose-atelier.jpg' },
  { label: 'Dune Ripple Rug', path: '/images/rug-boucle-dune.jpg' },
  { label: 'Moss Wall Relief', path: '/images/wallart-botanical-relief.jpg' },
  { label: 'Rose Horizon Tondo', path: '/images/wallart-rose-horizon.jpg' },
  { label: 'Rose Cloud Tote', path: '/images/bag-rose-cloud.jpg' },
  { label: 'Olive Shoulder Bag', path: '/images/bag-olive-atelier.jpg' },
];

function createEmptyForm() {
  return {
    id: null,
    name: '',
    category: 'rugs',
    badge: 'New Arrival',
    image: '/images/rug-savanna-contour.jpg',
    leadTime: '10 – 14 days',
    pile: '18mm Hand-Carved Cut Pile',
    materials: 'Premium wool-acrylic blend, natural monk’s cloth, non-slip cotton backing',
    description: '',
    palette: ['#F7F2E8', '#C57D82', '#5D6632'],
    sizes: [
      { label: 'Accent · 80 × 120 cm', price: 10500 },
      { label: 'Studio · 120 × 180 cm', price: 19500 },
    ],
  };
}

export default function AdminPage({
  products,
  onSaveProducts,
  onResetProducts,
  onExitAdmin,
}) {
  const [unlocked, setUnlocked] = useState(() => isAdminSessionUnlocked());
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');

  const [filterCat, setFilterCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState(createEmptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    window.clearTimeout(window.__tuftlyToastTimer);
    window.__tuftlyToastTimer = window.setTimeout(() => setToast(null), 4000);
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcodeInput.trim() === BRAND_CONFIG.adminPasscode) {
      setAdminSessionUnlocked(true);
      setUnlocked(true);
      setAuthError('');
      setPasscodeInput('');
    } else {
      setAuthError('Incorrect studio passcode. Please try again.');
    }
  };

  const handleSignOut = () => {
    setAdminSessionUnlocked(false);
    setUnlocked(false);
  };

  const stats = useMemo(
    () => ({
      total: products.length,
      rugs: products.filter((p) => p.category === 'rugs').length,
      wallArt: products.filter((p) => p.category === 'wall-art').length,
      handbags: products.filter((p) => p.category === 'handbags').length,
    }),
    [products]
  );

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const catMatch = filterCat === 'all' || p.category === filterCat;
      const textMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.badge || '').toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [products, filterCat, searchQuery]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const compressed = await compressImageFile(file);
      setForm((prev) => ({ ...prev, image: compressed }));
      showToast('Photo uploaded and optimized for fast loading.');
    } catch (err) {
      showToast(err.message || 'Could not process image.', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSizeChange = (idx, field, value) => {
    setForm((prev) => {
      const next = prev.sizes.map((row, i) =>
        i === idx
          ? { ...row, [field]: field === 'price' ? Number(value) || 0 : value }
          : row
      );
      return { ...prev, sizes: next };
    });
  };

  const handleAddSizeRow = () => {
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { label: '', price: 12000 }],
    }));
  };

  const handleRemoveSizeRow = (idx) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.length > 1 ? prev.sizes.filter((_, i) => i !== idx) : prev.sizes,
    }));
  };

  const handleSwatchChange = (idx, hex) => {
    setForm((prev) => {
      const next = [...prev.palette];
      next[idx] = hex;
      return { ...prev, palette: next };
    });
  };

  const handleEditProduct = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      badge: product.badge || '',
      image: product.image,
      leadTime: product.leadTime || '7 – 14 days',
      pile: product.pile || '',
      materials: product.materials || '',
      description: product.description || '',
      palette:
        product.palette?.length === 3
          ? [...product.palette]
          : ['#F7F2E8', '#C57D82', '#5D6632'],
      sizes: product.sizes?.length
        ? product.sizes.map((s) => ({ ...s }))
        : [{ label: 'Standard', price: 10000 }],
    });
    const formEl = document.getElementById('admin-product-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      showToast('Please enter a piece name.', 'error');
      return;
    }

    const validSizes = form.sizes
      .map((s) => ({ label: s.label.trim(), price: Number(s.price) }))
      .filter((s) => s.label && s.price > 0);

    if (validSizes.length === 0) {
      showToast('Add at least one size option with a valid KSh price.', 'error');
      return;
    }

    const newRecord = {
      id:
        form.id ||
        `${trimmedName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`,
      name: trimmedName,
      category: form.category,
      categoryLabel: CATEGORY_LABELS[form.category] || 'Tuftly Piece',
      badge: form.badge.trim() || 'Made to Order',
      image: form.image.trim() || '/images/rug-savanna-contour.jpg',
      leadTime: form.leadTime.trim() || '7 – 14 days',
      pile: form.pile.trim() || 'Hand-Tufted Wool Pile',
      materials: form.materials.trim() || 'Hand-tufted yarn, natural canvas backing',
      description:
        form.description.trim() ||
        'Bespoke hand-tufted creation crafted to order in the Tuftly studio.',
      palette: form.palette,
      sizes: validSizes,
    };

    const nextProducts = form.id
      ? products.map((item) => (item.id === form.id ? newRecord : item))
      : [newRecord, ...products];

    const result = onSaveProducts(nextProducts);
    if (result?.ok === false) {
      showToast(result.error, 'error');
      return;
    }

    showToast(
      form.id
        ? `"${newRecord.name}" updated on the storefront.`
        : `"${newRecord.name}" added to your live storefront!`
    );
    setForm(createEmptyForm());
  };

  const handleConfirmRemove = (product) => {
    const nextProducts = products.filter((p) => p.id !== product.id);
    onSaveProducts(nextProducts);
    setConfirmDeleteId(null);
    if (form.id === product.id) {
      setForm(createEmptyForm());
    }
    showToast(`Removed "${product.name}" from your storefront.`);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tuftly-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Catalog backup downloaded as JSON.');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) throw new Error('Invalid format');
        const res = onSaveProducts(parsed);
        if (res?.ok === false) {
          showToast(res.error, 'error');
        } else {
          showToast(`Imported ${parsed.length} pieces into your catalog.`);
        }
      } catch {
        showToast('Could not import file — please select a valid Tuftly JSON export.', 'error');
      } finally {
        if (importInputRef.current) importInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleCopyConfigSnippet = async () => {
    const snippet = `export const PRODUCTS = ${JSON.stringify(products, null, 2)};`;
    try {
      await navigator.clipboard.writeText(snippet);
      showToast('Copied PRODUCTS code — paste into src/data/tuftlyConfig.js to publish permanently.');
    } catch {
      showToast('Could not access clipboard. Use Export JSON instead.', 'error');
    }
  };

  if (!unlocked) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-card">
          <img
            src="/images/tuftly-logo.jpg"
            alt="Tuftly emblem"
            className="admin-auth-logo"
          />
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Private Studio Access
          </span>
          <h1 className="serif-display" style={{ fontSize: '2.3rem', margin: '0.6rem 0 0.5rem' }}>
            Tuftly Catalog Admin
          </h1>
          <p style={{ color: 'var(--ink-secondary)', fontSize: '0.92rem', margin: '0 0 1.65rem' }}>
            Enter your studio passcode to add, edit, or remove rugs, wall art, and handbags.
          </p>

          <form onSubmit={handleUnlock} className="admin-auth-form">
            <div className="admin-input-wrap">
              <Lock size={16} className="admin-input-icon" />
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  if (authError) setAuthError('');
                }}
                placeholder="Enter studio passcode"
                className="admin-input has-icon"
                autoFocus
              />
              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowPasscode((v) => !v)}
                aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
              >
                {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {authError && <div className="admin-error-text">{authError}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Unlock Studio Admin
            </button>
          </form>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ marginTop: '1.25rem' }}
            onClick={onExitAdmin}
          >
            <ArrowLeft size={15} />
            Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Admin Top Header */}
      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <div className="brand-lockup">
            <img
              src="/images/tuftly-logo.jpg"
              alt="Tuftly emblem"
              className="brand-emblem"
            />
            <div className="brand-text">
              <span className="brand-name">TUFTLY</span>
              <span className="brand-sub">Studio Catalog Admin</span>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onExitAdmin}
            >
              <ArrowLeft size={15} />
              View Live Storefront
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleSignOut}
              title="Lock Studio Admin"
            >
              <LogOut size={15} />
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="container admin-main">
        {toast && (
          <div className={`admin-toast ${toast.tone}`} role="status">
            <Check size={16} />
            <span>{toast.message}</span>
            <button
              type="button"
              className="admin-toast-close"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Studio Overview Metrics */}
        <section className="admin-stats-grid" aria-label="Catalog overview">
          <div className="admin-stat-card">
            <span>Total Listed Pieces</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Sculptural Rugs</span>
            <strong>{stats.rugs}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Gallery Wall Art</span>
            <strong>{stats.wallArt}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Women&apos;s Handbags</span>
            <strong>{stats.handbags}</strong>
          </div>
        </section>

        {/* Main 2-Column Workspace */}
        <div className="admin-workspace">
          {/* Left: Product Inventory List */}
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <h2 className="serif-display" style={{ fontSize: '1.85rem' }}>
                  Current Collection
                </h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
                  Changes appear immediately on your Tuftly storefront.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-rose btn-sm"
                onClick={() => {
                  setForm(createEmptyForm());
                  document
                    .getElementById('admin-product-form')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Plus size={15} />
                New Piece
              </button>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <Search size={15} className="admin-input-icon" />
                <input
                  type="search"
                  className="admin-input has-icon"
                  placeholder="Search pieces by name or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="admin-cat-pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`quick-size-btn ${filterCat === cat.id ? 'active' : ''}`}
                    onClick={() => setFilterCat(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredList.length === 0 ? (
              <div className="admin-empty-state">
                <p>No products match this filter yet.</p>
              </div>
            ) : (
              <div className="admin-product-list">
                {filteredList.map((product) => {
                  const minPrice = Math.min(...product.sizes.map((s) => s.price));
                  const maxPrice = Math.max(...product.sizes.map((s) => s.price));
                  const isEditing = form.id === product.id;

                  return (
                    <div
                      key={product.id}
                      className={`admin-product-row ${isEditing ? 'editing' : ''}`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="admin-product-thumb"
                      />

                      <div className="admin-product-info">
                        <div className="admin-product-top">
                          <span className="product-cat">{product.categoryLabel}</span>
                          {product.badge && (
                            <span className="admin-mini-badge">{product.badge}</span>
                          )}
                        </div>
                        <h3 className="admin-product-name">{product.name}</h3>
                        <div className="admin-product-meta">
                          <strong>
                            {minPrice === maxPrice
                              ? formatKES(minPrice)
                              : `${formatKES(minPrice)} – ${formatKES(maxPrice)}`}
                          </strong>
                          <span>·</span>
                          <span>
                            {product.sizes.length}{' '}
                            {product.sizes.length === 1 ? 'size' : 'sizes'}
                          </span>
                          <span>·</span>
                          <span>{product.leadTime}</span>
                        </div>
                      </div>

                      <div className="admin-row-actions">
                        {confirmDeleteId === product.id ? (
                          <div className="admin-confirm-strip">
                            <button
                              type="button"
                              className="btn btn-sm admin-danger-btn"
                              onClick={() => handleConfirmRemove(product)}
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="icon-circle-btn"
                              title="Edit piece"
                              aria-label={`Edit ${product.name}`}
                              onClick={() => handleEditProduct(product)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className="icon-circle-btn admin-trash-icon"
                              title="Remove piece"
                              aria-label={`Remove ${product.name}`}
                              onClick={() => setConfirmDeleteId(product.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Backup & Deployment Tools */}
            <div className="admin-utility-bar">
              <span className="admin-utility-label">Catalog Tools:</span>
              <div className="admin-utility-btns">
                <button
                  type="button"
                  className="quick-size-btn"
                  onClick={handleExportJson}
                >
                  <Download size={13} style={{ marginRight: 5, verticalAlign: '-2px' }} />
                  Export JSON
                </button>
                <button
                  type="button"
                  className="quick-size-btn"
                  onClick={() => importInputRef.current?.click()}
                >
                  <Upload size={13} style={{ marginRight: 5, verticalAlign: '-2px' }} />
                  Import JSON
                </button>
                <input
                  ref={importInputRef}
                  type="file"
                  accept="application/json"
                  style={{ display: 'none' }}
                  onChange={handleImportJson}
                />
                <button
                  type="button"
                  className="quick-size-btn"
                  onClick={handleCopyConfigSnippet}
                  title="Copy updated PRODUCTS array for tuftlyConfig.js before deploying"
                >
                  <Copy size={13} style={{ marginRight: 5, verticalAlign: '-2px' }} />
                  Copy Code
                </button>
                {confirmReset ? (
                  <>
                    <button
                      type="button"
                      className="quick-size-btn active"
                      onClick={() => {
                        onResetProducts();
                        setForm(createEmptyForm());
                        setConfirmReset(false);
                        showToast('Catalog restored to starter collection.');
                      }}
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      className="quick-size-btn"
                      onClick={() => setConfirmReset(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="quick-size-btn"
                    onClick={() => setConfirmReset(true)}
                  >
                    <RotateCcw
                      size={13}
                      style={{ marginRight: 5, verticalAlign: '-2px' }}
                    />
                    Reset Defaults
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Right: Add / Edit Product Form */}
          <section id="admin-product-form" className="admin-panel admin-form-panel">
            <div className="admin-panel-head">
              <div>
                <span className="eyebrow">
                  {form.id ? 'Editing Existing Piece' : 'Add to Storefront'}
                </span>
                <h2 className="serif-display" style={{ fontSize: '1.9rem', marginTop: '0.35rem' }}>
                  {form.id ? form.name || 'Edit Piece' : 'Create New Product'}
                </h2>
              </div>
              {form.id && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setForm(createEmptyForm())}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitForm} className="admin-form">
              {/* Photo Upload + Preview */}
              <div className="admin-field">
                <label className="admin-label">Product Photograph</label>
                <div className="admin-photo-row">
                  <div className="admin-photo-preview">
                    <img src={form.image} alt="Product preview" />
                  </div>
                  <div className="admin-photo-controls">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      <ImagePlus size={15} />
                      {uploadingImage ? 'Optimizing Photo...' : 'Upload Photo from Device'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Or paste image URL / path (e.g. /images/my-rug.jpg)"
                      value={form.image.startsWith('data:') ? '' : form.image}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, image: e.target.value }))
                      }
                    />
                    <div className="admin-sample-strip">
                      <span>Studio presets:</span>
                      {STUDIO_SAMPLE_IMAGES.map((sample) => (
                        <button
                          key={sample.path}
                          type="button"
                          className={`admin-sample-chip ${
                            form.image === sample.path ? 'active' : ''
                          }`}
                          onClick={() =>
                            setForm((prev) => ({ ...prev, image: sample.path }))
                          }
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Category */}
              <div className="admin-two-col">
                <div className="admin-field">
                  <label htmlFor="prod-name" className="admin-label">
                    Piece Name *
                  </label>
                  <input
                    id="prod-name"
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Mara Terracotta Rug"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="prod-category" className="admin-label">
                    Category *
                  </label>
                  <select
                    id="prod-category"
                    className="admin-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                  >
                    <option value="rugs">Sculptural Rug</option>
                    <option value="wall-art">Gallery Wall Art</option>
                    <option value="handbags">Women&apos;s Handbag</option>
                  </select>
                </div>
              </div>

              {/* Badge & Lead Time */}
              <div className="admin-two-col">
                <div className="admin-field">
                  <label htmlFor="prod-badge" className="admin-label">
                    Editorial Tag / Badge
                  </label>
                  <input
                    id="prod-badge"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. New Arrival, Signature Piece"
                    value={form.badge}
                    onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="prod-lead" className="admin-label">
                    Crafting Lead Time
                  </label>
                  <input
                    id="prod-lead"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 10 – 14 days"
                    value={form.leadTime}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, leadTime: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Sizes & Prices */}
              <div className="admin-field">
                <div className="admin-label-row">
                  <label className="admin-label">Sizes / Editions &amp; KSh Prices *</label>
                  <button
                    type="button"
                    className="quick-size-btn active"
                    onClick={handleAddSizeRow}
                  >
                    + Add Size Option
                  </button>
                </div>

                <div className="admin-sizes-stack">
                  {form.sizes.map((sizeRow, idx) => (
                    <div key={idx} className="admin-size-row">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Studio · 120 × 180 cm"
                        value={sizeRow.label}
                        onChange={(e) =>
                          handleSizeChange(idx, 'label', e.target.value)
                        }
                        required
                      />
                      <div className="admin-kes-input">
                        <span>KSh</span>
                        <input
                          type="number"
                          min={100}
                          step={100}
                          className="admin-input"
                          placeholder="19500"
                          value={sizeRow.price || ''}
                          onChange={(e) =>
                            handleSizeChange(idx, 'price', e.target.value)
                          }
                          required
                        />
                      </div>
                      <button
                        type="button"
                        className="icon-circle-btn admin-trash-icon"
                        disabled={form.sizes.length <= 1}
                        onClick={() => handleRemoveSizeRow(idx)}
                        aria-label="Remove size option"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="admin-field">
                <label htmlFor="prod-desc" className="admin-label">
                  Description
                </label>
                <textarea
                  id="prod-desc"
                  className="est-textarea"
                  placeholder="Describe the sculpted texture, colour story, and ideal styling..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>

              {/* Pile & Materials */}
              <div className="admin-two-col">
                <div className="admin-field">
                  <label htmlFor="prod-pile" className="admin-label">
                    Pile / Finish
                  </label>
                  <input
                    id="prod-pile"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 18mm Sculpted Cut Pile"
                    value={form.pile}
                    onChange={(e) => setForm((p) => ({ ...p, pile: e.target.value }))}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">Yarn Palette Swatches</label>
                  <div className="admin-color-pickers">
                    {form.palette.map((hex, i) => (
                      <label key={i} className="admin-color-chip">
                        <input
                          type="color"
                          value={hex}
                          onChange={(e) => handleSwatchChange(i, e.target.value)}
                        />
                        <span>{hex.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="prod-materials" className="admin-label">
                  Materials &amp; Backing
                </label>
                <input
                  id="prod-materials"
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Combed wool blend, natural monk's cloth, cotton canvas backing"
                  value={form.materials}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, materials: e.target.value }))
                  }
                />
              </div>

              <div className="admin-form-submit-row">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {form.id ? 'Save Changes to Storefront' : 'Publish Piece to Storefront'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
