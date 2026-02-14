/**
 * 発注管理システム - カスタマイズ一覧画面(Part3)
 * 
 * レコード登録処理、バリデーション
 */

(function(window) {
  'use strict';
  
  const CONFIG = window.PO_CONFIG;
  const Utils = window.PO_Utils;
  const Calculator = window.PO_Calculator;
  
  /**
   * レコード登録
   * @param {boolean} isDraft - 下書き保存フラグ
   */
  window.submitRecord = async function(isDraft = false) {
    try {
      // バリデーション
      if (!validateForm()) {
        return;
      }
      
      // 確認ダイアログ
      const message = isDraft ? CONFIG.UI.MESSAGES.CONFIRM_DRAFT : CONFIG.UI.MESSAGES.CONFIRM_SUBMIT;
      if (!Utils.confirm(message)) {
        return;
      }
      
      Utils.showLoading('登録処理中...');
      
      // 発注番号を生成
      const poNumber = await Utils.generatePoNumber();
      
      // レコードデータを構築
      const recordData = buildRecordData(isDraft, poNumber);
      
      // API実行
      const resp = await Utils.createRecord(CONFIG.APP_IDS.PO_MANAGEMENT, recordData);
      
      Utils.hideLoading();
      
      const successMessage = isDraft ? 
        Utils.formatMessage(CONFIG.UI.MESSAGES.SUCCESS_DRAFT, { recordId: resp.id }) :
        Utils.formatMessage(CONFIG.UI.MESSAGES.SUCCESS_SUBMIT, { recordId: resp.id });
      
      Utils.showAlert(successMessage, 'success');
      
      // 詳細画面に遷移
      setTimeout(() => {
        location.href = `/k/${CONFIG.APP_IDS.PO_MANAGEMENT}/show#record=${resp.id}`;
      }, 1000);
      
    } catch (error) {
      Utils.hideLoading();
      Utils.error('レコード登録エラー', error);
      Utils.showAlert(`登録に失敗しました: ${error.message || CONFIG.UI.MESSAGES.ERROR_API}`, 'error');
    }
  };
  
  /**
   * フォームバリデーション
   * @returns {boolean} 検証結果
   */
  function validateForm() {
    // 必須項目チェック
    const requiredFields = [
      { id: 'supplier', label: '発注元' },
      { id: 'vendor', label: '発注先' },
      { id: 'poDate', label: '発注日' },
      { id: 'subject', label: '件名' },
      { id: 'currency', label: '通貨' },
      { id: 'taxCode', label: '税コード' }
    ];
    
    for (const field of requiredFields) {
      const element = document.getElementById(field.id);
      const value = element.value.trim();
      
      if (!value) {
        Utils.showAlert(`${field.label}を入力してください`, 'warning');
        element.focus();
        return false;
      }
    }
    
    // 明細行チェック
    const rows = document.querySelectorAll('#itemsBody tr');
    if (rows.length === 0) {
      Utils.showAlert('発注内訳を最低1行入力してください', 'warning');
      return false;
    }
    
    // 明細行の必須項目チェック
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const itemName = row.querySelector('.item-name').value.trim();
      const unitPrice = row.querySelector('.unit-price').value.trim();
      const quantity = row.querySelector('.quantity').value.trim();
      
      if (!itemName || !unitPrice || !quantity) {
        Utils.showAlert(`明細行 ${i + 1} の必須項目(アイテム名、単価、数量)を入力してください`, 'warning');
        return false;
      }
      
      // 数値チェック
      if (parseFloat(unitPrice) < 0 || parseFloat(quantity) < 0) {
        Utils.showAlert(`明細行 ${i + 1} の単価・数量は0以上の値を入力してください`, 'warning');
        return false;
      }
    }
    
    // 為替レートチェック
    const currency = document.getElementById('currency').value;
    const exchangeRate = document.getElementById('exchangeRate').value.trim();
    
    if (currency !== CONFIG.CURRENCY_CODES.JPY && !exchangeRate) {
      if (!Utils.confirm(CONFIG.UI.MESSAGES.WARN_NO_EXCHANGE_RATE)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * レコードデータを構築
   * @param {boolean} isDraft - 下書き保存フラグ
   * @param {string} poNumber - 発注番号
   * @returns {Object} レコードデータ
   */
  function buildRecordData(isDraft, poNumber) {
    const record = {};
    
    // 発注番号
    record[CONFIG.FIELDS.PO.NUMBER] = { value: poNumber };
    
    // 基本情報
    record[CONFIG.FIELDS.PO.SUPPLIER] = { value: document.getElementById('supplier').value };
    record[CONFIG.FIELDS.PO.VENDOR] = { value: document.getElementById('vendor').value };
    record[CONFIG.FIELDS.PO.DATE] = { value: document.getElementById('poDate').value };
    record[CONFIG.FIELDS.PO.SUBJECT] = { value: document.getElementById('subject').value };
    record[CONFIG.FIELDS.PO.CURRENCY] = { value: document.getElementById('currency').value };
    record[CONFIG.FIELDS.PO.EXCHANGE_RATE] = { value: document.getElementById('exchangeRate').value };
    record[CONFIG.FIELDS.PO.TAX_CODE] = { value: document.getElementById('taxCode').value };
    record[CONFIG.FIELDS.PO.CONTRACT_TERMS] = { value: document.getElementById('contractTerms').value };
    record[CONFIG.FIELDS.PO.STATUS] = { 
      value: isDraft ? CONFIG.STATUS.DRAFT : CONFIG.STATUS.PENDING 
    };
    
    // 発注元詳細情報
    const supplierRecord = Utils.getSelectedRecord('supplier');
    if (supplierRecord) {
      record[CONFIG.FIELDS.PO.SUPPLIER_NAME] = { 
        value: Utils.getFieldValue(supplierRecord, CONFIG.FIELDS.BASIC_INFO.COMPANY_NAME) 
      };
      record[CONFIG.FIELDS.PO.SUPPLIER_ADDRESS] = { 
        value: Utils.getFieldValue(supplierRecord, CONFIG.FIELDS.BASIC_INFO.ADDRESS) 
      };
      record[CONFIG.FIELDS.PO.SUPPLIER_REP] = { 
        value: Utils.getFieldValue(supplierRecord, CONFIG.FIELDS.BASIC_INFO.REPRESENTATIVE) 
      };
    }
    
    // 発注先詳細情報
    const vendorRecord = Utils.getSelectedRecord('vendor');
    if (vendorRecord) {
      record[CONFIG.FIELDS.PO.VENDOR_NAME] = { 
        value: Utils.getFieldValue(vendorRecord, CONFIG.FIELDS.VENDOR.NAME) 
      };
      record[CONFIG.FIELDS.PO.VENDOR_ADDRESS] = { 
        value: Utils.getFieldValue(vendorRecord, CONFIG.FIELDS.VENDOR.ADDRESS) 
      };
      record[CONFIG.FIELDS.PO.VENDOR_CONTACT] = { 
        value: Utils.getFieldValue(vendorRecord, CONFIG.FIELDS.VENDOR.CONTACT) 
      };
    }
    
    // 税率
    const taxCodeSelect = document.getElementById('taxCode');
    record[CONFIG.FIELDS.PO.TAX_RATE] = { 
      value: taxCodeSelect.dataset.taxRate || '' 
    };
    
    // 発注内訳(テーブル)
    const itemsData = [];
    const rows = document.querySelectorAll('#itemsBody tr');
    
    rows.forEach((row, index) => {
      const itemRow = {
        value: {
          [CONFIG.FIELDS.ITEM.LINE_NO]: { value: index + 1 },
          [CONFIG.FIELDS.ITEM.CODE]: { value: row.querySelector('.item-code').value },
          [CONFIG.FIELDS.ITEM.NAME]: { value: row.querySelector('.item-name').value },
          [CONFIG.FIELDS.ITEM.DETAIL]: { value: row.querySelector('.item-detail').value },
          [CONFIG.FIELDS.ITEM.UNIT_PRICE]: { value: row.querySelector('.unit-price').value },
          [CONFIG.FIELDS.ITEM.QUANTITY]: { value: row.querySelector('.quantity').value },
          [CONFIG.FIELDS.ITEM.UNIT]: { value: row.querySelector('.unit').value },
          [CONFIG.FIELDS.ITEM.AMOUNT]: { value: row.querySelector('.amount').dataset.value },
          [CONFIG.FIELDS.ITEM.IS_INVENTORY]: { value: row.dataset.isInventory || CONFIG.INVENTORY_TYPES.NON_INVENTORY },
          [CONFIG.FIELDS.ITEM.PROJECT_IDS]: { value: row.dataset.projectIds || '' },
          [CONFIG.FIELDS.ITEM.PROJECT_DISPLAY]: { value: row.dataset.projectDisplay || '' },
          [CONFIG.FIELDS.ITEM.REMARKS]: { value: '' }
        }
      };
      itemsData.push(itemRow);
    });
    
    record[CONFIG.FIELDS.PO.ITEMS] = { value: itemsData };
    
    // 金額計算フィールド
    record[CONFIG.FIELDS.PO.SUBTOTAL] = { value: Calculator.getSubtotal() };
    record[CONFIG.FIELDS.PO.TAX_AMOUNT] = { value: Calculator.getTaxAmount() };
    record[CONFIG.FIELDS.PO.TOTAL] = { value: Calculator.getTotal() };
    
    const currency = document.getElementById('currency').value;
    if (currency !== CONFIG.CURRENCY_CODES.JPY) {
      record[CONFIG.FIELDS.PO.TOTAL_JPY] = { value: Calculator.getTotalJpy() };
    }
    
    Utils.log('レコードデータ構築完了', record);
    
    return record;
  }
  
})(window);
