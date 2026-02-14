/**
 * 発注管理システム - カスタムCSS
 * 
 * カスタマイズ一覧画面のスタイル定義
 */

(function() {
  'use strict';
  
  const CONFIG = window.PO_CONFIG;
  
  window.addCustomCSS = function() {
    const styleId = 'po-custom-styles';
    
    // 既存のスタイルがあれば削除
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* ============================================ */
      /* 基本スタイル */
      /* ============================================ */
      
      .po-custom-form {
        max-width: 1400px;
        margin: 20px auto;
        padding: 20px;
        background: #ffffff;
        font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif;
      }
      
      .po-form-header {
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 3px solid ${CONFIG.UI.COLORS.PRIMARY};
      }
      
      .po-form-title {
        margin: 0;
        font-size: 24px;
        color: ${CONFIG.UI.COLORS.DARK};
        font-weight: 600;
      }
      
      /* ============================================ */
      /* セクション */
      /* ============================================ */
      
      .po-section {
        margin-bottom: 30px;
        padding: 20px;
        background: #ffffff;
        border: 1px solid ${CONFIG.UI.COLORS.BORDER};
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      
      .po-section-title {
        margin: 0 0 20px 0;
        font-size: 18px;
        color: ${CONFIG.UI.COLORS.DARK};
        font-weight: 600;
        padding-bottom: 10px;
        border-bottom: 2px solid ${CONFIG.UI.COLORS.LIGHT};
      }
      
      .po-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .po-section-header .po-section-title {
        margin: 0;
        border: none;
        padding: 0;
      }
      
      .po-form-content {
        padding: 0;
      }
      
      /* ============================================ */
      /* フォーム要素 */
      /* ============================================ */
      
      .po-form-row {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .po-form-row:last-child {
        margin-bottom: 0;
      }
      
      .po-form-group {
        flex: 1;
        min-width: 0;
      }
      
      .po-form-group.po-full-width {
        flex: 1 1 100%;
      }
      
      .po-label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 500;
        color: ${CONFIG.UI.COLORS.DARK};
      }
      
      .po-required {
        color: ${CONFIG.UI.COLORS.DANGER};
        margin-left: 2px;
      }
      
      .po-input,
      .po-select,
      .po-textarea {
        width: 100%;
        padding: 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        background-color: #fff;
        border: 1px solid ${CONFIG.UI.COLORS.BORDER};
        border-radius: 4px;
        transition: border-color 0.15s ease-in-out;
        box-sizing: border-box;
      }
      
      .po-input:focus,
      .po-select:focus,
      .po-textarea:focus {
        outline: none;
        border-color: ${CONFIG.UI.COLORS.PRIMARY};
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
      }
      
      .po-input:disabled,
      .po-select:disabled,
      .po-textarea:disabled {
        background-color: ${CONFIG.UI.COLORS.LIGHT};
        cursor: not-allowed;
      }
      
      .po-input-sm {
        padding: 6px 10px;
        font-size: 13px;
      }
      
      .po-input-number {
        text-align: right;
      }
      
      .po-textarea {
        resize: vertical;
        min-height: 60px;
      }
      
      .po-textarea-sm {
        min-height: 40px;
        padding: 6px 10px;
        font-size: 13px;
      }
      
      .po-input-group {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      
      .po-input-group .po-select {
        flex: 1;
      }
      
      .po-input-group-compact {
        display: flex;
        gap: 4px;
      }
      
      .po-input-group-compact .po-input {
        flex: 1;
      }
      
      /* ============================================ */
      /* ボタン */
      /* ============================================ */
      
      .po-btn {
        display: inline-block;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        border-radius: 4px;
        transition: all 0.15s ease-in-out;
      }
      
      .po-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      .po-btn:active {
        transform: translateY(0);
      }
      
      .po-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
      }
      
      .po-btn-primary {
        color: #fff;
        background-color: ${CONFIG.UI.COLORS.PRIMARY};
        border-color: ${CONFIG.UI.COLORS.PRIMARY};
      }
      
      .po-btn-secondary {
        color: #333;
        background-color: #fff;
        border-color: ${CONFIG.UI.COLORS.BORDER};
      }
      
      .po-btn-success {
        color: #fff;
        background-color: ${CONFIG.UI.COLORS.SUCCESS};
        border-color: ${CONFIG.UI.COLORS.SUCCESS};
      }
      
      .po-btn-danger {
        color: #fff;
        background-color: ${CONFIG.UI.COLORS.DANGER};
        border-color: ${CONFIG.UI.COLORS.DANGER};
      }
      
      .po-btn-sm {
        padding: 6px 12px;
        font-size: 13px;
      }
      
      .po-btn-icon {
        padding: 6px 10px;
        font-size: 16px;
        line-height: 1;
      }
      
      /* ============================================ */
      /* テーブル */
      /* ============================================ */
      
      .po-table-wrapper {
        overflow-x: auto;
        margin-bottom: 15px;
      }
      
      .po-items-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      
      .po-items-table thead th {
        background-color: ${CONFIG.UI.COLORS.DARK};
        color: #fff;
        padding: 12px 8px;
        text-align: left;
        font-weight: 600;
        white-space: nowrap;
        border: 1px solid #1a252f;
      }
      
      .po-items-table tbody td {
        padding: 8px;
        border: 1px solid ${CONFIG.UI.COLORS.BORDER};
        vertical-align: middle;
      }
      
      .po-items-table tbody tr:hover {
        background-color: #f8f9fa;
      }
      
      .po-cell-center {
        text-align: center;
      }
      
      .po-cell-right {
        text-align: right;
      }
      
      .po-items-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .po-item-count {
        font-size: 14px;
        color: #666;
      }
      
      .po-count-number {
        font-weight: 600;
        color: ${CONFIG.UI.COLORS.PRIMARY};
      }
      
      /* ============================================ */
      /* 金額サマリー */
      /* ============================================ */
      
      .po-summary-content {
        max-width: 500px;
        margin-left: auto;
      }
      
      .po-summary-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .po-summary-table th {
        text-align: right;
        padding: 12px 20px 12px 0;
        font-size: 15px;
        font-weight: 500;
        color: #666;
        border-bottom: 1px solid ${CONFIG.UI.COLORS.LIGHT};
      }
      
      .po-summary-table td {
        text-align: right;
        padding: 12px 0;
        font-size: 18px;
        font-weight: 600;
        color: ${CONFIG.UI.COLORS.DARK};
        border-bottom: 1px solid ${CONFIG.UI.COLORS.LIGHT};
      }
      
      .po-summary-table .po-total-row th,
      .po-summary-table .po-total-row td {
        font-size: 18px;
        color: ${CONFIG.UI.COLORS.PRIMARY};
        border-bottom: 2px solid ${CONFIG.UI.COLORS.PRIMARY};
        padding-top: 15px;
      }
      
      .po-summary-value {
        margin-right: 5px;
      }
      
      .po-currency-symbol {
        font-size: 16px;
        color: #666;
      }
      
      /* ============================================ */
      /* アクションボタン */
      /* ============================================ */
      
      .po-action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 15px;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid ${CONFIG.UI.COLORS.LIGHT};
      }
      
      .po-action-buttons .po-btn {
        min-width: 150px;
        padding: 12px 30px;
        font-size: 15px;
      }
      
      /* ============================================ */
      /* モーダル */
      /* ============================================ */
      
      .po-modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.5);
        animation: fadeIn 0.2s;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .po-modal-content {
        position: relative;
        background-color: #fff;
        margin: 5% auto;
        padding: 0;
        border-radius: 8px;
        width: 90%;
        max-width: 700px;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        animation: slideDown 0.3s;
      }
      
      .po-modal-content.po-modal-large {
        max-width: 900px;
      }
      
      @keyframes slideDown {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .po-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 25px;
        border-bottom: 1px solid ${CONFIG.UI.COLORS.BORDER};
        background-color: ${CONFIG.UI.COLORS.LIGHT};
      }
      
      .po-modal-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: ${CONFIG.UI.COLORS.DARK};
      }
      
      .po-modal-close {
        color: #aaa;
        font-size: 28px;
        font-weight: bold;
        line-height: 1;
        cursor: pointer;
        transition: color 0.2s;
      }
      
      .po-modal-close:hover {
        color: #000;
      }
      
      .po-modal-body {
        padding: 20px 25px;
        overflow-y: auto;
        flex: 1;
      }
      
      .po-modal-footer {
        padding: 15px 25px;
        border-top: 1px solid ${CONFIG.UI.COLORS.BORDER};
        text-align: right;
        background-color: ${CONFIG.UI.COLORS.LIGHT};
      }
      
      /* ============================================ */
      /* 検索ボックス */
      /* ============================================ */
      
      .po-search-box {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }
      
      .po-search-box .po-input {
        flex: 1;
      }
      
      .po-search-results {
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .po-no-results {
        text-align: center;
        padding: 40px 20px;
        color: #999;
        font-size: 14px;
      }
      
      .po-results-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      
      .po-results-table thead th {
        background-color: ${CONFIG.UI.COLORS.LIGHT};
        padding: 10px 8px;
        text-align: left;
        font-weight: 600;
        border-bottom: 2px solid ${CONFIG.UI.COLORS.BORDER};
        white-space: nowrap;
      }
      
      .po-results-table tbody td {
        padding: 10px 8px;
        border-bottom: 1px solid ${CONFIG.UI.COLORS.BORDER};
      }
      
      .po-results-table tbody tr:hover {
        background-color: #f8f9fa;
      }
      
      /* ============================================ */
      /* 案件タグ */
      /* ============================================ */
      
      .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 5px;
      }
      
      .po-tag {
        display: inline-flex;
        align-items: center;
        padding: 3px 8px;
        background-color: ${CONFIG.UI.COLORS.PRIMARY};
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
        white-space: nowrap;
      }
      
      .po-tag-remove {
        margin-left: 5px;
        padding: 0;
        background: none;
        border: none;
        color: #fff;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
        opacity: 0.8;
      }
      
      .po-tag-remove:hover {
        opacity: 1;
      }
      
      .po-checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .po-checkbox-label {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid ${CONFIG.UI.COLORS.BORDER};
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .po-checkbox-label:hover {
        background-color: #f8f9fa;
      }
      
      .po-checkbox {
        margin-right: 10px;
        cursor: pointer;
      }
      
      /* ============================================ */
      /* 見積カード */
      /* ============================================ */
      
      .po-quote-card {
        border: 1px solid ${CONFIG.UI.COLORS.BORDER};
        border-radius: 6px;
        margin-bottom: 15px;
        overflow: hidden;
        transition: box-shadow 0.2s;
      }
      
      .po-quote-card:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .po-quote-header {
        padding: 15px;
        background-color: ${CONFIG.UI.COLORS.LIGHT};
        border-bottom: 1px solid ${CONFIG.UI.COLORS.BORDER};
      }
      
      .po-quote-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: ${CONFIG.UI.COLORS.DARK};
      }
      
      .po-quote-body {
        padding: 15px;
      }
      
      .po-quote-body p {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #666;
      }
      
      .po-quote-body p:last-child {
        margin-bottom: 0;
      }
      
      .po-quote-footer {
        padding: 15px;
        background-color: #f8f9fa;
        border-top: 1px solid ${CONFIG.UI.COLORS.BORDER};
        text-align: right;
      }
      
      /* ============================================ */
      /* ローディング */
      /* ============================================ */
      
      .po-loader {
        display: none;
        position: fixed;
        z-index: 20000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.4);
        justify-content: center;
        align-items: center;
      }
      
      .po-loader-content {
        background: #fff;
        padding: 30px 50px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .po-spinner {
        border: 4px solid ${CONFIG.UI.COLORS.LIGHT};
        border-top: 4px solid ${CONFIG.UI.COLORS.PRIMARY};
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .po-loader-message {
        margin: 0;
        font-size: 14px;
        color: #666;
      }
      
      /* ============================================ */
      /* レスポンシブ */
      /* ============================================ */
      
      @media (max-width: 1200px) {
        .po-custom-form {
          padding: 15px;
        }
        
        .po-form-row {
          flex-direction: column;
          gap: 15px;
        }
        
        .po-table-wrapper {
          overflow-x: scroll;
        }
      }
    `;
    
    document.head.appendChild(style);
  };
  
})();
