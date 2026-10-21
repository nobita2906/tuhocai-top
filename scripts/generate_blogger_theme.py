import sys

sys.stdout.reconfigure(encoding='utf-8')

theme_xml = r"""<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:defaultwidgetversion='2' b:layoutsversion='3' b:responsive='true' lang='vi' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta charset='utf-8'/>
  <meta content='width=device-width, initial-scale=1, shrink-to-fit=no' name='viewport'/>
  <title><data:view.title.escaped/></title>
  
  <b:include data='blog' name='all-head-content'/>

  <!-- Google Fonts -->
  <link rel='preconnect' href='https://fonts.googleapis.com'/>
  <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin='anonymous'/>
  <link href='https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&amp;family=Inter+Tight:wght@600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap' rel='stylesheet'/>
  
  <!-- FontAwesome -->
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'/>

  <b:skin><![CDATA[
  :root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #e0e7ff;
    --accent: #ec4899;
    --accent-red: #ef4444;
    --bg-body: #f8fafc;
    --bg-surface: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #64748b;
    --border-color: #e2e8f0;
    --border-light: #f1f5f9;
    --card-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
    --card-shadow-hover: 0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-full: 9999px;
    --font-sans: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-heading: 'Inter Tight', 'Be Vietnam Pro', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-sans);
    background-color: var(--bg-body);
    color: var(--text-primary);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  .container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* TOP ANNOUNCEMENT BAR */
  .topbar {
    background: linear-gradient(90deg, #1e1b4b 0%, #312e81 100%);
    color: #e0e7ff;
    font-size: 13.5px;
    padding: 8px 0;
    font-weight: 500;
  }
  .topbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .topbar-badge {
    background: rgba(99, 102, 241, 0.35);
    border: 1px solid rgba(165, 180, 252, 0.4);
    padding: 2px 10px;
    border-radius: var(--radius-full);
    font-size: 12px;
    margin-right: 8px;
  }
  .topbar-btn {
    background: #6366f1;
    color: #ffffff;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 12.5px;
    font-weight: 600;
    transition: background 0.2s;
  }
  .topbar-btn:hover {
    background: #4f46e5;
  }

  /* HEADER */
  .site-header {
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.03);
  }
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 74px;
  }
  .site-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .site-logo img {
    height: 44px;
    width: auto;
    object-fit: contain;
  }

  /* NAV */
  .main-nav {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .nav-link {
    font-size: 14.5px;
    font-weight: 600;
    color: var(--text-secondary);
    position: relative;
    padding: 8px 0;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .nav-link:hover, .nav-link.active {
    color: var(--primary);
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background: var(--primary);
    transition: width 0.25s ease;
  }
  .nav-link:hover::after {
    width: 100%;
  }

  .nav-shop-link {
    color: var(--primary-dark);
    font-weight: 700;
  }
  .badge-hot {
    background: #ef4444;
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 10px;
    margin-left: 2px;
    text-transform: uppercase;
    box-shadow: 0 2px 5px rgba(239, 68, 68, 0.35);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .btn-cta {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    padding: 9px 18px;
    border-radius: var(--radius-sm);
    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(99, 102, 241, 0.35);
  }

  .mobile-toggle {
    display: none;
    font-size: 22px;
    cursor: pointer;
    background: none;
    border: none;
    color: var(--text-primary);
  }

  /* HERO BANNER */
  .hero-section {
    background: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(248, 250, 252, 0) 60%),
                radial-gradient(circle at 10% 80%, rgba(236, 72, 153, 0.08) 0%, rgba(248, 250, 252, 0) 50%),
                #ffffff;
    border-bottom: 1px solid var(--border-color);
    padding: 48px 0 40px;
    text-align: center;
  }
  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--primary-light);
    color: var(--primary-dark);
    font-size: 13px;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: var(--radius-full);
    margin-bottom: 18px;
    border: 1px solid rgba(99, 102, 241, 0.2);
  }
  .hero-title {
    font-family: var(--font-heading);
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.25;
    max-width: 820px;
    margin: 0 auto 16px;
  }
  .hero-title span {
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .hero-desc {
    font-size: 16.5px;
    color: var(--text-muted);
    max-width: 660px;
    margin: 0 auto 28px;
    line-height: 1.6;
  }
  .hero-search-box {
    max-width: 580px;
    margin: 0 auto;
    position: relative;
  }
  .hero-search-input {
    width: 100%;
    padding: 14px 20px 14px 48px;
    font-size: 15px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    outline: none;
    font-family: var(--font-sans);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .hero-search-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  .hero-search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 16px;
  }

  /* PILL TAGS */
  .category-pills {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
  }
  .category-pill {
    font-size: 13.5px;
    font-weight: 600;
    padding: 7px 16px;
    border-radius: var(--radius-full);
    background: #ffffff;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }
  .category-pill:hover, .category-pill.active {
    background: var(--primary);
    border-color: var(--primary);
    color: #ffffff;
  }
  .category-pill.pill-shop {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    border-color: #4f46e5;
    color: #ffffff;
    box-shadow: 0 3px 8px rgba(79, 70, 229, 0.3);
  }

  /* MAIN CONTENT LAYOUT */
  .main-wrapper {
    padding: 40px 0 60px;
  }
  .content-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 36px;
  }
  .main-content {
    min-width: 0;
    max-width: 100%;
  }

  /* SECTION TITLE (STANDARD BLOG) */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-bottom: 14px;
    border-bottom: 2px solid var(--border-color);
  }
  .section-title {
    font-family: var(--font-heading);
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-title i {
    color: var(--primary);
  }

  /* STANDARD POST GRID */
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  /* STANDARD POST CARD */
  .post-card {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--card-shadow-hover);
    border-color: rgba(99, 102, 241, 0.4);
  }
  .post-thumb-link {
    display: block;
    position: relative;
    aspect-ratio: 16 / 9;
    background: #e2e8f0;
    overflow: hidden;
  }
  .post-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .post-card:hover .post-thumb {
    transform: scale(1.05);
  }
  .post-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(4px);
    color: #ffffff;
    font-size: 11.5px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .post-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .post-card-title {
    font-family: var(--font-heading);
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.45;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .post-card-title a:hover {
    color: var(--primary);
  }
  .post-snippet {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.55;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
  }
  .post-meta-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid var(--border-light);
    font-size: 12.5px;
    color: var(--text-muted);
  }
  .post-author-box {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--primary-light);
    color: var(--primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
  }
  .read-more-btn {
    color: var(--primary);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
  }
  .read-more-btn:hover {
    color: var(--primary-dark);
    gap: 6px;
  }

  /* ========================================================
     SHOP & WOOCOMMERCE ARCHIVE STYLING (workflowfree.com)
     ======================================================== */
  .shop-archive-header {
    margin-bottom: 28px;
  }
  .shop-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 16px;
  }
  .shop-breadcrumb a {
    color: var(--text-secondary);
  }
  .shop-breadcrumb a:hover {
    color: var(--primary);
  }
  .shop-breadcrumb .separator {
    font-size: 10px;
    color: #94a3b8;
  }
  .shop-breadcrumb .current {
    color: var(--text-primary);
    font-weight: 600;
  }

  /* Shop Banner */
  .shop-banner-card {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
    border-radius: var(--radius-lg);
    padding: 30px 32px;
    color: #ffffff;
    margin-bottom: 24px;
    box-shadow: 0 10px 25px -5px rgba(30, 27, 75, 0.25);
    position: relative;
    overflow: hidden;
  }
  .shop-banner-card::after {
    content: '';
    position: absolute;
    right: -30px;
    bottom: -30px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .shop-pill-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
    text-transform: uppercase;
  }
  .shop-title {
    font-family: var(--font-heading);
    font-size: 26px;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 10px;
    color: #ffffff;
  }
  .shop-desc {
    font-size: 14px;
    line-height: 1.65;
    color: #e0e7ff;
    max-width: 680px;
  }

  /* Shop Toolbar */
  .shop-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    padding: 14px 20px;
    border-radius: var(--radius-md);
    margin-bottom: 24px;
    box-shadow: var(--card-shadow);
  }
  .shop-count {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
  }
  .shop-ordering {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13.5px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  .shop-select {
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
    background: #ffffff;
    font-size: 13.5px;
    font-family: var(--font-sans);
    color: var(--text-primary);
    font-weight: 600;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
  }
  .shop-select:focus {
    border-color: var(--primary);
  }

  /* Product Grid: 3 columns matching workflowfree.com */
  .shop-products-grid.products.columns-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  /* Product Item Card */
  .product-item-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--card-shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    position: relative;
  }
  .product-item-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-hover);
    border-color: rgba(99, 102, 241, 0.45);
  }

  /* Product Thumbnail (1:1 square ratio) */
  .bloghash-product-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f1f5f9;
    overflow: hidden;
  }
  .woocommerce-LoopProduct-link {
    display: block;
    width: 100%;
    height: 100%;
  }
  .attachment-woocommerce_thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .product-item-card:hover .attachment-woocommerce_thumbnail {
    transform: scale(1.06);
  }

  /* Sale Badge (onsale) */
  .onsale {
    position: absolute;
    top: 12px;
    left: 12px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #ffffff;
    font-size: 11.5px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    z-index: 3;
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.35);
    letter-spacing: 0.02em;
  }

  /* Add to Cart Button (Hover overlay) */
  .button.add_to_cart_button.bloghash-btn {
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(6px);
    color: #ffffff;
    text-align: center;
    padding: 9px 12px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 600;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.25s ease;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .button.add_to_cart_button.bloghash-btn:hover {
    background: var(--primary);
    color: #ffffff;
  }
  .product-item-card:hover .button.add_to_cart_button.bloghash-btn {
    opacity: 1;
    transform: translateY(0);
  }

  /* Meta Wrap */
  .meta-wrap {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .bloghash-loop-product__category-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .bloghash-loop-product__category {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--primary);
    background: var(--primary-light);
    padding: 2px 7px;
    border-radius: 4px;
    letter-spacing: 0.03em;
  }
  .bloghash-loop-product__category:hover {
    background: var(--primary);
    color: #ffffff;
  }

  /* Product Title */
  .woocommerce-loop-product__title {
    font-family: var(--font-heading);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.45;
    color: var(--text-primary);
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 44px;
  }
  .woocommerce-loop-product__title a:hover {
    color: var(--primary);
  }

  /* Price Row */
  .price-row {
    margin-bottom: 14px;
    margin-top: auto;
  }
  .price {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .price del, .price-regular {
    font-size: 13.5px;
    color: #94a3b8;
    font-weight: 500;
    text-decoration: line-through;
  }
  .custom-sale-price {
    font-size: 18px;
    font-weight: 800;
    color: #4f46e5;
  }

  /* Fast Buy Action */
  .product-bottom-action {
    margin-top: auto;
  }
  .btn-vietqr-direct {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    padding: 9px 14px;
    border-radius: var(--radius-sm);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
    transition: all 0.2s ease;
  }
  .btn-vietqr-direct:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    color: #ffffff;
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
  }

  /* SINGLE POST DETAIL */
  .single-article {
    background: var(--bg-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    box-shadow: var(--card-shadow);
    padding: 36px 40px;
    min-width: 0;
    max-width: 100%;
    overflow-wrap: break-word;
    word-break: break-word;
    box-sizing: border-box;
  }
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 20px;
  }
  .breadcrumb a:hover {
    color: var(--primary);
  }
  .single-title {
    font-family: var(--font-heading);
    font-size: 30px;
    font-weight: 800;
    line-height: 1.35;
    color: #0f172a;
    margin-bottom: 18px;
    word-break: break-word;
  }
  .single-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 18px;
    font-size: 13.5px;
    color: var(--text-muted);
    padding-bottom: 22px;
    margin-bottom: 26px;
    border-bottom: 1px solid var(--border-color);
  }
  .single-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .single-meta-item i {
    color: var(--primary);
  }

  /* ARTICLE CONTENT TYPOGRAPHY & RESPONSIVE MEDIA */
  .article-content {
    font-size: 16.5px;
    line-height: 1.85;
    color: #334155;
    min-width: 0;
    max-width: 100%;
  }
  .article-content p {
    margin-bottom: 20px;
  }
  .article-content h2, .article-content h3, .article-content h4 {
    font-family: var(--font-heading);
    color: #0f172a;
    margin-top: 36px;
    margin-bottom: 16px;
    font-weight: 700;
  }
  .article-content h2 {
    font-size: 24px;
    padding-left: 14px;
    border-left: 4px solid var(--primary);
  }
  .article-content h3 {
    font-size: 20px;
    padding-left: 10px;
    border-left: 3px solid var(--accent);
  }

  /* Force all images, videos, iframes, embeds to be 100% responsive */
  .article-content img,
  .article-content video,
  .article-content iframe,
  .article-content embed,
  .article-content object,
  .article-content .wp-video,
  .article-content .wp-video-shortcode {
    max-width: 100% !important;
    height: auto !important;
    box-sizing: border-box !important;
  }

  /* Override WordPress hardcoded width on .wp-video (e.g. style="width: 1668px;") */
  .article-content .wp-video {
    width: 100% !important;
    max-width: 100% !important;
    margin: 24px 0 !important;
  }

  .article-content .wp-video video,
  .article-content video {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    border-radius: var(--radius-md) !important;
    background: #000;
  }

  .article-content img {
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    margin: 24px auto;
    display: block;
  }

  /* Top Product Box: prevent thumbnail from blowing up */
  .article-content [style*="flex: 1 1 260px"],
  .article-content [style*="flex: 1 1 280px"] {
    flex: 0 0 280px !important;
    max-width: 280px !important;
    width: 280px !important;
    margin: 0 auto !important;
  }
  .article-content [style*="flex: 1 1 260px"] img,
  .article-content [style*="flex: 1 1 280px"] img {
    width: 280px !important;
    max-width: 100% !important;
    height: auto !important;
    aspect-ratio: 1 / 1 !important;
    object-fit: cover !important;
    border-radius: 12px !important;
    margin: 0 !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
  }
  .article-content [style*="flex: 1 1 320px"],
  .article-content [style*="flex: 1 1 340px"] {
    flex: 1 1 300px !important;
    min-width: 0 !important;
  }
  .article-content ul, .article-content ol {
    margin: 18px 0 24px 28px;
  }
  .article-content li {
    margin-bottom: 8px;
  }
  .article-content pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 20px;
    border-radius: var(--radius-md);
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 14px;
    line-height: 1.6;
    margin: 24px 0;
    border: 1px solid #1e293b;
  }
  .article-content code {
    background: #f1f5f9;
    color: #dc2626;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.9em;
  }
  .article-content pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }
  .article-content blockquote {
    border-left: 4px solid var(--primary);
    background: var(--primary-light);
    padding: 16px 20px;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    font-style: italic;
    color: #1e1b4b;
    margin: 24px 0;
  }

  /* SHARE BOX */
  .share-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 36px;
    padding-top: 24px;
    border-top: 1px solid var(--border-color);
  }
  .share-buttons {
    display: flex;
    gap: 10px;
  }
  .share-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 15px;
    transition: transform 0.2s;
  }
  .share-btn:hover {
    transform: translateY(-2px);
  }
  .share-fb { background: #1877f2; }
  .share-tg { background: #229ed9; }
  .share-tw { background: #000000; }
  .share-cp { background: #64748b; cursor: pointer; }

  /* SIDEBAR */
  .sidebar-widget {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    box-shadow: var(--card-shadow);
    padding: 24px;
    margin-bottom: 24px;
  }
  .widget-title {
    font-family: var(--font-heading);
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--border-light);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .widget-title i {
    color: var(--primary);
  }
  .sidebar-banner {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: #ffffff;
    border-radius: var(--radius-md);
    padding: 24px;
    text-align: center;
    margin-bottom: 24px;
  }
  .sidebar-banner h4 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .sidebar-banner p {
    font-size: 13.5px;
    opacity: 0.9;
    margin-bottom: 16px;
  }

  /* FOOTER */
  .site-footer {
    background: #0f172a;
    color: #cbd5e1;
    padding: 60px 0 24px;
    border-top: 1px solid #1e293b;
    margin-top: 40px;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 48px;
  }
  .footer-col h3 {
    font-family: var(--font-heading);
    font-size: 17px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 18px;
  }
  .footer-desc {
    font-size: 14.5px;
    line-height: 1.7;
    color: #94a3b8;
    max-width: 380px;
    margin-bottom: 18px;
  }
  .footer-links {
    list-style: none;
  }
  .footer-links li {
    margin-bottom: 10px;
  }
  .footer-links a {
    color: #94a3b8;
    font-size: 14px;
    transition: color 0.2s;
  }
  .footer-links a:hover {
    color: var(--primary-light);
  }
  .footer-bottom {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid #1e293b;
    font-size: 13.5px;
    color: #64748b;
  }

  /* PAGINATION */
  .blog-pager {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 40px;
  }
  .blog-pager a {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    padding: 10px 20px;
    border-radius: var(--radius-sm);
    font-weight: 600;
    color: var(--text-primary);
    box-shadow: var(--card-shadow);
  }
  .blog-pager a:hover {
    background: var(--primary);
    color: #ffffff;
    border-color: var(--primary);
  }

  /* RESPONSIVE */
  @media (max-width: 991px) {
    .content-layout {
      grid-template-columns: 1fr;
    }
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    .shop-products-grid.products.columns-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .main-nav {
      display: none;
      position: absolute;
      top: 74px;
      left: 0;
      right: 0;
      background: var(--bg-surface);
      flex-direction: column;
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      gap: 16px;
      align-items: flex-start;
    }
    .main-nav.active {
      display: flex;
    }
    .mobile-toggle {
      display: block;
    }
    .topbar-content {
      flex-direction: column;
      gap: 6px;
      text-align: center;
    }
    .hero-title {
      font-size: 28px;
    }
    .single-article {
      padding: 24px 20px;
    }
    .single-title {
      font-size: 24px;
    }
    .article-content [style*="flex: 1 1 260px"],
    .article-content [style*="flex: 1 1 280px"] {
      flex: 1 1 100% !important;
      max-width: 100% !important;
      width: 100% !important;
    }
  }

  @media (max-width: 580px) {
    .shop-products-grid.products.columns-3 {
      grid-template-columns: 1fr;
    }
    .shop-toolbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .shop-ordering {
      width: 100%;
      justify-content: space-between;
    }
    .shop-select {
      flex-grow: 1;
    }
    .shop-banner-card {
      padding: 22px 18px;
    }
    .shop-title {
      font-size: 21px;
    }
  }
  ]]></b:skin>
</head>

<body>
  <!-- TOP ANNOUNCEMENT BAR -->
  <div class='topbar'>
    <div class='container topbar-content'>
      <div>
        <span class='topbar-badge'>🚀 Cập nhật</span>
        <span>Kho thư viện n8n Automation &amp; AI Agents miễn phí 100%</span>
      </div>
      <div>
        <a class='topbar-btn' href='https://n8n.io/' rel='noopener' target='_blank'>
          <i class='fa-solid fa-bolt'/> Free 14 ngày với n8n
        </a>
      </div>
    </div>
  </div>

  <!-- HEADER -->
  <header class='site-header'>
    <div class='container header-inner'>
      <!-- Logo -->
      <a class='site-logo' expr:href='data:blog.homepageUrl'>
        <img alt='Share Workflow Template Free' src='https://workflowfree.com/wp-content/uploads/2025/06/cropped-logo-1.png'/>
      </a>

      <!-- Main Navigation -->
      <nav class='main-nav' id='mainNav'>
        <a class='nav-link' expr:href='data:blog.homepageUrl'>Trang chủ</a>
        <a class='nav-link nav-shop-link' expr:href='data:blog.homepageUrl + "search/label/C%E1%BB%ADa%20h%C3%A0ng"'>
          <i class='fa-solid fa-store' style='color: var(--primary);'/> Cửa hàng <span class='badge-hot'>HOT</span>
        </a>
        <a class='nav-link' expr:href='data:blog.homepageUrl + "search/label/Template%20n8n"'>Template n8n</a>
        <a class='nav-link' expr:href='data:blog.homepageUrl + "search/label/H%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn"'>Học n8n</a>
        <a class='nav-link' expr:href='data:blog.homepageUrl + "search/label/Chia%20s%E1%BA%BB%20quy%20tr%C3%ACnh"'>Quy trình</a>
        <a class='nav-link' expr:href='data:blog.homepageUrl + "search/label/Image%20Prompt"'>Image Prompt</a>
        <a class='nav-link' expr:href='data:blog.homepageUrl + "search/label/C%C3%B4ng%20c%E1%BB%A5%20h%C3%ACnh%20%E1%BA%A3nh%20Ai"'>Công cụ AI</a>
      </nav>

      <!-- Actions -->
      <div class='header-actions'>
        <a class='btn-cta' expr:href='data:blog.homepageUrl + "search/label/C%E1%BB%ADa%20h%C3%A0ng"'>
          <i class='fa-solid fa-bag-shopping'/> Gian hàng
        </a>
        <button class='mobile-toggle' id='mobileToggle' aria-label='Menu'>
          <i class='fa-solid fa-bars'/>
        </button>
      </div>
    </div>
  </header>

  <!-- HERO SECTION (HOMEPAGE ONLY) -->
  <b:if cond='data:view.isHomepage'>
    <div class='hero-section'>
      <div class='container'>
        <div class='hero-tag'>
          <i class='fa-solid fa-sparkles'/> AI Automation &amp; n8n Community
        </div>
        <h1 class='hero-title'>
          Share Workflow Template Free <br/>
          <span>n8n Automation &amp; AI Agents</span>
        </h1>
        <p class='hero-desc'>
          Khám phá và tải về miễn phí hàng trăm quy trình tự động hóa n8n thực chiến, prompt tạo ảnh AI và giải pháp tối ưu năng suất làm việc cho cá nhân &amp; doanh nghiệp.
        </p>

        <!-- Search Box -->
        <div class='hero-search-box'>
          <form expr:action='data:blog.searchUrl' method='get'>
            <i class='fa-solid fa-magnifying-glass hero-search-icon'/>
            <input class='hero-search-input' name='q' placeholder='Tìm kiếm workflow n8n, prompt, bài hướng dẫn...' type='text'/>
          </form>
        </div>

        <!-- Category Pills -->
        <div class='category-pills'>
          <a class='category-pill active' expr:href='data:blog.homepageUrl'>Tất cả</a>
          <a class='category-pill pill-shop' expr:href='data:blog.homepageUrl + "search/label/C%E1%BB%ADa%20h%C3%A0ng"'><i class='fa-solid fa-bag-shopping'/> 🛍️ Cửa hàng n8n</a>
          <a class='category-pill' expr:href='data:blog.homepageUrl + "search/label/Template%20n8n"'>⚡ Template n8n</a>
          <a class='category-pill' expr:href='data:blog.homepageUrl + "search/label/H%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn"'>📚 Hướng dẫn</a>
          <a class='category-pill' expr:href='data:blog.homepageUrl + "search/label/Chia%20s%E1%BA%BB%20quy%20tr%C3%ACnh"'>🔄 Quy trình</a>
          <a class='category-pill' expr:href='data:blog.homepageUrl + "search/label/Image%20Prompt"'>🎨 Image Prompt</a>
          <a class='category-pill' expr:href='data:blog.homepageUrl + "search/label/Tin%20t%E1%BB%A9c%20Ai"'>🤖 Tin tức AI</a>
        </div>
      </div>
    </div>
  </b:if>

  <!-- MAIN WRAPPER -->
  <main class='main-wrapper'>
    <div class='container'>
      <div class='content-layout'>

        <!-- BLOG POSTS SECTION -->
        <div class='main-content'>
          <b:section id='main-posts' showaddelement='false'>
            <b:widget id='Blog1' locked='true' title='Bài đăng trên Blog' type='Blog' version='2'>
              <b:widget-settings>
                <b:widget-setting name='showDateHeader'>false</b:widget-setting>
                <b:widget-setting name='showShareButtons'>true</b:widget-setting>
                <b:widget-setting name='authorLabel'>Tác giả</b:widget-setting>
                <b:widget-setting name='showCommentLink'>true</b:widget-setting>
                <b:widget-setting name='showAuthor'>true</b:widget-setting>
                <b:widget-setting name='showAuthorProfile'>false</b:widget-setting>
                <b:widget-setting name='showTimestamp'>true</b:widget-setting>
                <b:widget-setting name='postsPerPage'>15</b:widget-setting>
                <b:widget-setting name='showLabels'>true</b:widget-setting>
              </b:widget-settings>

              <b:includable id='main' var='this'>
                <b:if cond='data:view.isMultipleItems'>
                  <b:if cond='data:view.search.label == "Cửa hàng" or data:view.search.label == "C%E1%BB%ADa%20h%C3%A0ng" or data:view.search.label == "Sản phẩm n8n" or data:view.search.label == "Sản phẩm"'>
                    <!-- ============================================== -->
                    <!-- WOOCOMMERCE SHOP ARCHIVE (CỬA HÀNG)           -->
                    <!-- ============================================== -->
                    <div class='shop-archive-header'>
                      <!-- Breadcrumbs -->
                      <nav class='shop-breadcrumb'>
                        <a expr:href='data:blog.homepageUrl'><i class='fa-solid fa-house'/> Trang chủ</a>
                        <i class='fa-solid fa-chevron-right separator'/>
                        <span class='current'>Cửa hàng</span>
                      </nav>

                      <!-- Shop Hero Banner -->
                      <div class='shop-banner-card'>
                        <div class='shop-banner-content'>
                          <span class='shop-pill-tag'><i class='fa-solid fa-bag-shopping'/> GIAN HÀNG CHÍNH THỨC</span>
                          <h1 class='shop-title'>Cửa Hàng Workflow n8n &amp; Ứng Dụng AI</h1>
                          <p class='shop-desc'>Khám phá các workflow n8n tự động hóa thực chiến, ứng dụng AI Agents và giải pháp số độc quyền. Quét mã VietQR nhận tài nguyên tức thì kèm video hướng dẫn 1-1.</p>
                        </div>
                      </div>

                      <!-- Shop Toolbar: Result Count & Sắp Xếp Filter -->
                      <div class='shop-toolbar'>
                        <div class='shop-count'>
                          <i class='fa-solid fa-layer-group' style='color: var(--primary); margin-right: 8px;'/>
                          <span>Danh mục sản phẩm bản quyền</span>
                        </div>
                        <div class='shop-ordering'>
                          <label for='shopOrderSelect'><i class='fa-solid fa-arrow-down-wide-short'/> Sắp xếp:</label>
                          <select id='shopOrderSelect' class='shop-select' onchange='sortShopProducts(this.value)'>
                            <option value='default'>Thứ tự mặc định</option>
                            <option value='newest' selected='selected'>Mới nhất</option>
                            <option value='price-asc'>Giá: Thấp đến cao</option>
                            <option value='price-desc'>Giá: Cao xuống thấp</option>
                            <option value='discount'>Ưu đãi giảm giá nhiều nhất</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- WOOCOMMERCE PRODUCT GRID (COLUMNS-3) -->
                    <div class='shop-products-grid products columns-3' id='shopProductsContainer'>
                      <b:loop values='data:posts' var='post'>
                        <article class='product-item-card type-product' expr:data-title='data:post.title' expr:data-url='data:post.url'>
                          <!-- Thumbnail Box with square aspect-ratio & badge -->
                          <div class='bloghash-product-thumb'>
                            <a class='woocommerce-LoopProduct-link' expr:href='data:post.url'>
                              <span class='onsale'>-17%</span>
                              <b:if cond='data:post.featuredImage'>
                                <img class='attachment-woocommerce_thumbnail' expr:alt='data:post.title' expr:src='data:post.featuredImage' loading='lazy'/>
                              <b:else/>
                                <img class='attachment-woocommerce_thumbnail' expr:alt='data:post.title' loading='lazy' src='https://workflowfree.com/wp-content/uploads/2026/08/flow-app-avatar-studio.png'/>
                              </b:if>
                            </a>
                            <!-- Hover Quick Action -->
                            <a class='button add_to_cart_button bloghash-btn' expr:href='data:post.url'>
                              <i class='fa-solid fa-cart-shopping'/> Xem chi tiết
                            </a>
                          </div>

                          <!-- Meta Wrap: Categories, Title & Price -->
                          <div class='meta-wrap'>
                            <div class='bloghash-loop-product__category-wrap'>
                              <b:loop values='data:post.labels' var='label'>
                                <b:if cond='data:label.name != "Cửa hàng" and data:label.name != "C%E1%BB%ADa%20h%C3%A0ng"'>
                                  <a class='bloghash-loop-product__category' expr:href='data:label.url'><data:label.name/></a>
                                </b:if>
                              </b:loop>
                            </div>

                            <h2 class='woocommerce-loop-product__title'>
                              <a expr:href='data:post.url'><data:post.title/></a>
                            </h2>

                            <div class='price-row'>
                              <span class='price'>
                                <del class='price-regular'>300.000 đ</del>
                                <span class='custom-sale-price'>199.000 đ</span>
                              </span>
                            </div>

                            <div class='product-bottom-action'>
                              <a class='btn-vietqr-direct' expr:href='data:post.url'>
                                <i class='fa-solid fa-bolt'/> Mua ngay VietQR
                              </a>
                            </div>
                          </div>

                          <!-- Hidden Raw Container for Client-Side JS Price & Title Extractor -->
                          <div class='js-raw-content' style='display:none;'>
                            <div class='js-snippet'><data:post.snippet/></div>
                            <div class='js-body'><data:post.body/></div>
                          </div>
                        </article>
                      </b:loop>
                    </div>

                    <!-- PAGER -->
                    <div class='blog-pager'>
                      <b:if cond='data:newerPageUrl'>
                        <a class='blog-pager-newer-link' expr:href='data:newerPageUrl'><i class='fa-solid fa-chevron-left'/> Trang trước</a>
                      </b:if>
                      <b:if cond='data:olderPageUrl'>
                        <a class='blog-pager-older-link' expr:href='data:olderPageUrl'>Trang kế tiếp <i class='fa-solid fa-chevron-right'/></a>
                      </b:if>
                    </div>

                  <b:else/>
                    <!-- ============================================== -->
                    <!-- STANDARD BLOG POSTS ARCHIVE                   -->
                    <!-- ============================================== -->
                    <div class='section-header'>
                      <h2 class='section-title'>
                        <b:if cond='data:view.isSearch'>
                          <i class='fa-solid fa-magnifying-glass'/> Kết quả tìm kiếm: &quot;<data:view.search.query/>&quot;
                        <b:elseif cond='data:view.isLabelSearch'/>
                          <i class='fa-solid fa-folder-open'/> Chuyên mục: <data:view.search.label/>
                        <b:else/>
                          <i class='fa-solid fa-fire'/> Workflow &amp; Template Mới Nhất
                        </b:if>
                      </h2>
                    </div>

                    <!-- POSTS GRID -->
                    <div class='posts-grid'>
                      <b:loop values='data:posts' var='post'>
                        <article class='post-card'>
                          <a class='post-thumb-link' expr:href='data:post.url'>
                            <b:if cond='data:post.featuredImage'>
                              <img class='post-thumb' expr:alt='data:post.title' expr:src='data:post.featuredImage' loading='lazy'/>
                            <b:else/>
                              <img class='post-thumb' expr:alt='data:post.title' loading='lazy' src='https://workflowfree.com/wp-content/uploads/2026/08/anh-bia-1024x574.png'/>
                            </b:if>
                            <b:if cond='data:post.labels and not data:post.labels.empty'>
                              <span class='post-badge'><data:post.labels.first.name/></span>
                            </b:if>
                          </a>
                          <div class='post-body'>
                            <h3 class='post-card-title'>
                              <a expr:href='data:post.url'><data:post.title/></a>
                            </h3>
                            <div class='post-snippet'>
                              <data:post.snippet/>
                            </div>
                            <div class='post-meta-footer'>
                              <div class='post-author-box'>
                                <div class='author-avatar'>
                                  <i class='fa-solid fa-user'/>
                                </div>
                                <span><data:post.author.name/></span>
                              </div>
                              <a class='read-more-btn' expr:href='data:post.url'>
                                Xem thêm <i class='fa-solid fa-arrow-right'/>
                              </a>
                            </div>
                          </div>
                        </article>
                      </b:loop>
                    </div>

                    <!-- PAGER -->
                    <div class='blog-pager'>
                      <b:if cond='data:newerPageUrl'>
                        <a class='blog-pager-newer-link' expr:href='data:newerPageUrl'><i class='fa-solid fa-chevron-left'/> Trang trước</a>
                      </b:if>
                      <b:if cond='data:olderPageUrl'>
                        <a class='blog-pager-older-link' expr:href='data:olderPageUrl'>Trang kế tiếp <i class='fa-solid fa-chevron-right'/></a>
                      </b:if>
                    </div>
                  </b:if>

                <b:else/>
                  <!-- SINGLE POST VIEW -->
                  <b:loop values='data:posts' var='post'>
                    <article class='single-article'>
                      <!-- Breadcrumbs -->
                      <nav class='breadcrumb'>
                        <a expr:href='data:blog.homepageUrl'>Trang chủ</a>
                        <i class='fa-solid fa-chevron-right' style='font-size: 10px;'/>
                        <b:if cond='data:post.labels and not data:post.labels.empty'>
                          <a expr:href='data:post.labels.first.url'><data:post.labels.first.name/></a>
                          <i class='fa-solid fa-chevron-right' style='font-size: 10px;'/>
                        </b:if>
                        <span>Chi tiết bài viết</span>
                      </nav>

                      <h1 class='single-title'><data:post.title/></h1>

                      <div class='single-meta'>
                        <div class='single-meta-item'>
                          <i class='fa-solid fa-circle-user'/>
                          <span>Tác giả: <strong><data:post.author.name/></strong></span>
                        </div>
                        <div class='single-meta-item'>
                          <i class='fa-regular fa-calendar'/>
                          <span><data:post.date/></span>
                        </div>
                        <b:if cond='data:post.labels and not data:post.labels.empty'>
                          <div class='single-meta-item'>
                            <i class='fa-solid fa-tag'/>
                            <b:loop values='data:post.labels' var='label'>
                              <a expr:href='data:label.url' style='color: var(--primary); font-weight: 600;'><data:label.name/></a><b:if cond='not data:label.isLast'>, </b:if>
                            </b:loop>
                          </div>
                        </b:if>
                      </div>

                      <div class='article-content'>
                        <data:post.body/>
                      </div>

                      <!-- Share Bar -->
                      <div class='share-bar'>
                        <span style='font-weight: 600; font-size: 14.5px;'>
                          <i class='fa-solid fa-share-nodes' style='color: var(--primary);'/> Chia sẻ bài viết:
                        </span>
                        <div class='share-buttons'>
                          <a class='share-btn share-fb' expr:href='"https://www.facebook.com/sharer/sharer.php?u=" + data:post.url' rel='noopener' target='_blank' title='Chia sẻ lên Facebook'>
                            <i class='fa-brands fa-facebook-f'/>
                          </a>
                          <a class='share-btn share-tg' expr:href='"https://t.me/share/url?url=" + data:post.url + "&amp;text=" + data:post.title' rel='noopener' target='_blank' title='Chia sẻ lên Telegram'>
                            <i class='fa-brands fa-telegram'/>
                          </a>
                          <a class='share-btn share-tw' expr:href='"https://twitter.com/intent/tweet?url=" + data:post.url + "&amp;text=" + data:post.title' rel='noopener' target='_blank' title='Chia sẻ lên Twitter/X'>
                            <i class='fa-brands fa-x-twitter'/>
                          </a>
                          <button class='share-btn share-cp' onclick='navigator.clipboard.writeText(window.location.href); alert("Đã sao chép liên kết vào bộ nhớ tạm!");' title='Sao chép liên kết'>
                            <i class='fa-solid fa-link'/>
                          </button>
                        </div>
                      </div>

                      <!-- Comments Section -->
                      <b:include data='post' name='comments'/>
                    </article>
                  </b:loop>
                </b:if>
              </b:includable>
            </b:widget>
          </b:section>
        </div>

        <!-- SIDEBAR -->
        <aside class='site-sidebar'>
          <!-- Promotion banner -->
          <div class='sidebar-banner'>
            <i class='fa-solid fa-rocket' style='font-size: 32px; margin-bottom: 12px; display: inline-block;'/>
            <h4>Tự Động Hóa Với n8n</h4>
            <p>Trải nghiệm 14 ngày miễn phí với nền tảng n8n Cloud hàng đầu thế giới.</p>
            <a class='topbar-btn' href='https://n8n.io/' rel='noopener' style='display: inline-block; padding: 8px 18px;' target='_blank'>
              Bắt đầu ngay <i class='fa-solid fa-arrow-right'/>
            </a>
          </div>

          <!-- Dynamic Sidebar Widgets -->
          <b:section id='sidebar-widgets' showaddelement='true'>
            <b:widget id='Label1' locked='false' title='Chuyên mục nổi bật' type='Label' version='2'>
              <b:widget-settings>
                <b:widget-setting name='sorting'>ALPHA</b:widget-setting>
                <b:widget-setting name='display'>LIST</b:widget-setting>
                <b:widget-setting name='selectedLabelsList'/>
                <b:widget-setting name='showFreqNumbers'>true</b:widget-setting>
              </b:widget-settings>
              <b:includable id='main'>
                <div class='sidebar-widget'>
                  <h3 class='widget-title'><i class='fa-solid fa-folder-tree'/> <data:title/></h3>
                  <div class='widget-content'>
                    <ul class='footer-links'>
                      <b:loop values='data:labels' var='label'>
                        <li style='display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed var(--border-light);'>
                          <a expr:href='data:label.url' style='font-weight: 500;'><data:label.name/></a>
                          <span style='background: var(--bg-body); border: 1px solid var(--border-color); font-size: 11.5px; padding: 2px 8px; border-radius: var(--radius-full); color: var(--text-muted);'>
                            <data:label.count/>
                          </span>
                        </li>
                      </b:loop>
                    </ul>
                  </div>
                </div>
              </b:includable>
            </b:widget>

            <b:widget id='PopularPosts1' locked='false' title='Workflow phổ biến' type='PopularPosts' version='2'>
              <b:includable id='main'>
                <div class='sidebar-widget'>
                  <h3 class='widget-title'><i class='fa-solid fa-fire-flame-curved'/> <data:title/></h3>
                  <div class='widget-content'>
                    <b:loop values='data:posts' var='post'>
                      <div style='display: flex; gap: 12px; margin-bottom: 14px;'>
                        <a expr:href='data:post.url' style='flex-shrink: 0; width: 68px; height: 50px; border-radius: 6px; overflow: hidden; background: #e2e8f0;'>
                          <img expr:alt='data:post.title' expr:src='data:post.featuredImage' style='width: 100%; height: 100%; object-fit: cover;'/>
                        </a>
                        <div>
                          <a expr:href='data:post.url' style='font-size: 13.5px; font-weight: 600; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;'>
                            <data:post.title/>
                          </a>
                        </div>
                      </div>
                    </b:loop>
                  </div>
                </div>
              </b:includable>
            </b:widget>
          </b:section>
        </aside>

      </div>
    </div>
  </main>

  <!-- FOOTER -->
  <footer class='site-footer'>
    <div class='container'>
      <div class='footer-grid'>
        <div class='footer-col'>
          <div class='site-logo' style='margin-bottom: 16px;'>
            <img alt='Share Workflow Template Free' src='https://workflowfree.com/wp-content/uploads/2025/06/cropped-logo-1.png' style='filter: brightness(0) invert(1); height: 40px;'/>
          </div>
          <p class='footer-desc'>
            Share Workflow Template Free - Cộng đồng chia sẻ tài nguyên n8n automation, kịch bản tự động hóa và AI Agent hàng đầu tại Việt Nam. Giúp bạn tiết kiệm hàng trăm giờ làm việc mỗi tháng.
          </p>
          <div style='display: flex; gap: 12px;'>
            <a class='share-btn share-fb' href='https://workflowfree.com' target='_blank'><i class='fa-brands fa-facebook-f'/></a>
            <a class='share-btn share-tg' href='https://workflowfree.com' target='_blank'><i class='fa-brands fa-telegram'/></a>
            <a class='share-btn share-tw' href='https://n8n.io/' target='_blank'><i class='fa-solid fa-bolt'/></a>
          </div>
        </div>

        <div class='footer-col'>
          <h3>Chuyên mục chính</h3>
          <ul class='footer-links'>
            <li><a expr:href='data:blog.homepageUrl + "search/label/C%E1%BB%ADa%20h%C3%A0ng"'>🛍️ Cửa hàng n8n &amp; AI</a></li>
            <li><a expr:href='data:blog.homepageUrl + "search/label/Template%20n8n"'>Template n8n Miễn Phí</a></li>
            <li><a expr:href='data:blog.homepageUrl + "search/label/H%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn"'>Hướng dẫn n8n từ A-Z</a></li>
            <li><a expr:href='data:blog.homepageUrl + "search/label/Chia%20s%E1%BA%BB%20quy%20tr%C3%ACnh"'>Quy trình tự động hóa</a></li>
            <li><a expr:href='data:blog.homepageUrl + "search/label/Image%20Prompt"'>Thư viện Image Prompt</a></li>
          </ul>
        </div>

        <div class='footer-col'>
          <h3>Liên kết hữu ích</h3>
          <ul class='footer-links'>
            <li><a href='https://n8n.io/' rel='noopener' target='_blank'>Nền tảng n8n.io</a></li>
            <li><a expr:href='data:blog.homepageUrl'>Trang chủ Blogger</a></li>
            <li><a expr:href='data:blog.homepageUrl + "search/label/C%E1%BB%ADa%20h%C3%A0ng"'>Cửa hàng sản phẩm</a></li>
            <li><a href='https://workflowfree.com' rel='noopener' target='_blank'>Website gốc WorkflowFree</a></li>
          </ul>
        </div>
      </div>

      <div class='footer-bottom'>
        <p>© 2026 Share Workflow Template Free - n8n Automation and AI Agents. Rebuilt for Blogger.</p>
      </div>
    </div>
  </footer>

  <!-- CENTRALIZED GLOBAL CONFIG & AUTO-SYNC SCRIPT -->
  <script type='text/javascript'>
    //<![CDATA[
    // ========================================================
    // CẤU HÌNH TÀI KHOẢN VIETQR & ZALO DÙNG CHUNG TOÀN BLOG
    // Thay đổi thông tin tại đây sẽ TỰ ĐỘNG áp dụng cho TẤT CẢ bài viết!
    // ========================================================
    window.VIETQR_CONFIG = window.VIETQR_CONFIG || {
      bankId: 'MB',                 // Mã ngân hàng: MB, VCB, ACB, TPB, TCB, VPB, BIDV...
      accountNo: '0987654321',      // SỐ TÀI KHOẢN NHẬN TIỀN DÙNG CHUNG
      accountName: 'NGUYEN DANG',   // TÊN CHỦ TÀI KHOẢN (viết hoa không dấu)
      zaloPhone: '0987654321'       // SỐ ZALO NHẬN TIN NHẮN TƯ VẤN
    };

    document.addEventListener('DOMContentLoaded', function() {
      // 1. Mobile Menu Toggle
      var mobileBtn = document.getElementById('mobileToggle');
      var mainNav = document.getElementById('mainNav');
      if (mobileBtn && mainNav) {
        mobileBtn.addEventListener('click', function() {
          mainNav.classList.toggle('active');
        });
      }

      // 2. Global VietQR & Zalo Auto-Sync
      var cfg = window.VIETQR_CONFIG;
      if (cfg) {
        // Cập nhật tất cả ảnh mã QR trong mọi bài viết
        document.querySelectorAll('img[src*="vietqr.io"], img.vietqr-img').forEach(function(img) {
          try {
            var url = new URL(img.src);
            var amount = img.getAttribute('data-amount') || url.searchParams.get('amount') || '199000';
            var memo = img.getAttribute('data-memo') || url.searchParams.get('addInfo') || 'WF_ORDER';
            var newQr = 'https://img.vietqr.io/image/' + cfg.bankId + '-' + cfg.accountNo + '-compact2.png' +
                        '?amount=' + amount + '&addInfo=' + encodeURIComponent(memo) + '&accountName=' + encodeURIComponent(cfg.accountName);
            img.src = newQr;
          } catch (e) {}
        });

        // Cập nhật tất cả link bấm mở mã QR
        document.querySelectorAll('a[href*="vietqr.io"]').forEach(function(link) {
          try {
            var url = new URL(link.href);
            var amount = url.searchParams.get('amount') || '199000';
            var memo = url.searchParams.get('addInfo') || 'WF_ORDER';
            link.href = 'https://img.vietqr.io/image/' + cfg.bankId + '-' + cfg.accountNo + '-compact2.png' +
                        '?amount=' + amount + '&addInfo=' + encodeURIComponent(memo) + '&accountName=' + encodeURIComponent(cfg.accountName);
          } catch (e) {}
        });

        // Cập nhật tất cả link Zalo
        document.querySelectorAll('a[href*="zalo.me"], .btn-zalo').forEach(function(link) {
          link.href = 'https://zalo.me/' + cfg.zaloPhone;
        });

        // Cập nhật text hiển thị số Zalo và thông tin ngân hàng nếu có placeholder
        document.querySelectorAll('.js-vietqr-bank').forEach(function(el) { el.textContent = cfg.bankId; });
        document.querySelectorAll('.js-vietqr-stk').forEach(function(el) { el.textContent = cfg.accountNo; });
        document.querySelectorAll('.js-vietqr-name').forEach(function(el) { el.textContent = cfg.accountName; });
        document.querySelectorAll('.js-zalo-phone').forEach(function(el) { el.textContent = cfg.zaloPhone; });
      }

      // 3. Shop Engine: Real-time Price Extraction, Badge Sync & Sắp Xếp
      var shopProducts = document.querySelectorAll('.product-item-card');
      if (shopProducts.length > 0) {
        shopProducts.forEach(function(card) {
          try {
            // A. Clean Title: strip [Cửa Hàng] prefix if present
            var titleEl = card.querySelector('.woocommerce-loop-product__title a');
            if (titleEl) {
              var cleanTitle = titleEl.textContent.replace(/^\[Cửa\s*Hàng\]\s*/i, '').trim();
              titleEl.textContent = cleanTitle;
              card.setAttribute('data-clean-title', cleanTitle);
            }

            // B. Extract Price from hidden raw content or body
            var rawWrap = card.querySelector('.js-raw-content');
            var rawText = rawWrap ? rawWrap.textContent : '';
            
            // Search for prices: e.g. "199.000 đ", "300.000 đ"
            var priceMatches = rawText.match(/(\\d{1,3}(?:\\.\\d{3})+)\\s*đ/g);
            if (priceMatches && priceMatches.length > 0) {
              var salePriceStr = priceMatches[0];
              var regPriceStr = priceMatches.length > 1 ? priceMatches[1] : '';
              
              var saleNum = parseInt(salePriceStr.replace(/\\D/g, ''), 10);
              var regNum = regPriceStr ? parseInt(regPriceStr.replace(/\\D/g, ''), 10) : 0;
              
              // If reg is smaller than sale, swap
              if (regNum > 0 && regNum < saleNum) {
                var tmp = saleNum; saleNum = regNum; regNum = tmp;
                var tmpStr = salePriceStr; salePriceStr = regPriceStr; regPriceStr = tmpStr;
              }

              card.setAttribute('data-price', saleNum);
              card.setAttribute('data-reg-price', regNum);

              var saleEl = card.querySelector('.custom-sale-price');
              if (saleEl) saleEl.textContent = salePriceStr;

              var regEl = card.querySelector('.price-regular');
              if (regEl) {
                if (regNum > saleNum) {
                  regEl.textContent = regPriceStr;
                  regEl.style.display = 'inline';
                } else {
                  regEl.style.display = 'none';
                }
              }

              // Calculate discount %
              var onsaleEl = card.querySelector('.onsale');
              if (onsaleEl) {
                if (regNum > saleNum) {
                  var discountPercent = Math.round(((regNum - saleNum) / regNum) * 100);
                  onsaleEl.textContent = '-' + discountPercent + '%';
                  card.setAttribute('data-discount', discountPercent);
                } else {
                  onsaleEl.textContent = 'HOT';
                  card.setAttribute('data-discount', 0);
                }
              }
            } else {
              card.setAttribute('data-price', 199000);
              card.setAttribute('data-discount', 17);
            }
          } catch (err) {
            console.error('Error processing shop product card:', err);
          }
        });

        // Window sort function for shop
        window.sortShopProducts = function(sortType) {
          var container = document.getElementById('shopProductsContainer');
          if (!container) return;
          var items = Array.from(container.querySelectorAll('.product-item-card'));

          items.sort(function(a, b) {
            var priceA = parseInt(a.getAttribute('data-price') || '0', 10);
            var priceB = parseInt(b.getAttribute('data-price') || '0', 10);
            var discountA = parseInt(a.getAttribute('data-discount') || '0', 10);
            var discountB = parseInt(b.getAttribute('data-discount') || '0', 10);

            if (sortType === 'price-asc') return priceA - priceB;
            if (sortType === 'price-desc') return priceB - priceA;
            if (sortType === 'discount') return discountB - discountA;
            return 0; // default order
          });

          items.forEach(function(item) {
            container.appendChild(item);
          });
        };
      }
    });
    //]]>
  </script>
</body>
</html>
"""

out_path = 'docs/blogger/workflowfree-blogger-theme.xml'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(theme_xml)

print(f"Successfully generated Blogger Theme XML: {out_path} ({len(theme_xml)} bytes)")
