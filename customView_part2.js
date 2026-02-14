/**
 * 発注管理システム - カスタマイズ一覧画面(Part2)
 * 
 * 明細行操作、モーダル表示、レコード登録処理
 */

(function(window) {
  'use strict';
  
  const CONFIG = window.PO_CONFIG;
  const Utils = window.PO_Utils;
  const MasterData = window.PO_MasterData;
  const Calculator = window.PO_Calculator;
  
  /**
   * 明細行を追加
   */
  window.addItemRow = function() {
    const tbody = document.getElementById('itemsBody');
    const currentCount = tbody.children.length;
    
    if (currentCount >= CONFIG.MAX_ITEMS) {
      Utils.showAlert(
        Utils.formatMessage(CONFIG.UI.MESSAGES.ERROR_MAX_ITEMS, { max: CONFIG.MAX_ITEMS }),
        'warning'
      );
      return;
    }
    
    const rowNo = currentCount + 1;
    const row = document.createElement('tr');
    row.dataset.rowNo = rowNo;
    row.dataset.projectIds = '';
    row.dataset.projectDisplay = '';
    row.dataset.isInventory = CONFIG.INVENTORY_TYPES.NON_INVENTORY;
    
    row.innerHTML = `
      <td class="po-cell-center">${rowNo}</td>
      <td>
        <div class="po-input-group-compact">
          <input type="text" class="po-input po-input-sm item-code" placeholder="コード">
          <button type="button" class="po-btn po-btn-icon btn-search" title="アイテム検索">🔍</button>
        </div>
      </td>
      <td><input type="text" class="po-input po-input-sm item-name" placeholder="名称" required></td>
      <td><textarea class="po-textarea po-textarea-sm item-detail" rows="2" placeholder="詳細情報"></textarea></td>
      <td><input type="number" class="po-input po-input-sm po-input-number unit-price" step="0.01" min="0" placeholder="0.00" required></td>
      <td><input type="number" class="po-input po-input-sm po-input-number quantity" step="0.01" min="0" placeholder="0" required></td>
      <td><input type="text" class="po-input po-input-sm unit" placeholder="個"></td>
      <td class="po-cell-right amount" data-value="0">0.00</td>
      <td>
        <div class="project-tags"></div>
        <button type="button" class="po-btn po-btn-icon po-btn-sm btn-project" title="案件追加">➕</button>
      </td>
      <td class="po-cell-center">
        <button type="button" class="po-btn po-btn-icon po-btn-danger btn-delete" title="削除">✕</button>
      </td>
    `;
    
    tbody.appendChild(row);
    attachRowEventListeners(row);
    updateItemCount();
    
    Utils.log(`明細行追加: 行番号=${rowNo}`);
  };
  
  /**
   * 明細行にイベントリスナーを設定
   * @param {HTMLElement} row - 明細行
   */
  function attachRowEventListeners(row) {
    // アイテム検索ボタン
    row.querySelector('.btn-search').addEventListener('click', function() {
      openItemSearchModal(row);
    });
    
    // 単価・数量入力時に金額計算
    row.querySelector('.unit-price').addEventListener('input', function() {
      Calculator.calculateRowAmount(row);
    });
    
    row.querySelector('.quantity').addEventListener('input', function() {
      Calculator.calculateRowAmount(row);
    });
    
    // 案件追加ボタン
    row.querySelector('.btn-project').addEventListener('click', function() {
      openProjectModal(row);
    });
    
    // 削除ボタン
    row.querySelector('.btn-delete').addEventListener('click', function() {
      if (Utils.confirm(CONFIG.UI.MESSAGES.CONFIRM_DELETE_ROW)) {
        row.remove();
        renumberRows();
        updateItemCount();
        Calculator.calculateTotal();
        Utils.log('明細行削除');
      }
    });
  }
  
  /**
   * 明細行番号を振り直し
   */
  function renumberRows() {
    const rows = document.querySelectorAll('#itemsBody tr');
    rows.forEach((row, index) => {
      const rowNo = index + 1;
      row.dataset.rowNo = rowNo;
      row.querySelector('td:first-child').textContent = rowNo;
    });
  }
  
  /**
   * 明細行数を更新
   */
  function updateItemCount() {
    const count = document.querySelectorAll('#itemsBody tr').length;
    document.getElementById('itemCount').textContent = count;
    
    // 最大行数に達したら追加ボタンを無効化
    const btnAdd = document.getElementById('btnAddItem');
    btnAdd.disabled = (count >= CONFIG.MAX_ITEMS);
  }
  
  /**
   * アイテム検索モーダルを開く
   * @param {HTMLElement} row - 対象の明細行
   */
  function openItemSearchModal(row) {
    const modal = document.getElementById('modalItemSearch');
    modal.style.display = 'block';
    modal.dataset.targetRow = row.dataset.rowNo;
    
    // 検索ボタンイベント
    document.getElementById('btnItemSearch').onclick = async function() {
      const query = document.getElementById('itemSearchQuery').value;
      await searchItems(query);
    };
  }
  
  /**
   * アイテム検索実行
   * @param {string} query - 検索クエリ
   */
  async function searchItems(query) {
    try {
      Utils.showLoading('アイテム検索中...');
      
      const records = await MasterData.searchItems(query);
      const resultsDiv = document.getElementById('itemSearchResults');
      resultsDiv.innerHTML = '';
      
      if (records.length === 0) {
        resultsDiv.innerHTML = `<p class="po-no-results">${CONFIG.UI.MESSAGES.ERROR_NO_RESULTS}</p>`;
        Utils.hideLoading();
        return;
      }
      
      const table = document.createElement('table');
      table.className = 'po-results-table';
      table.innerHTML = `
        <thead>
          <tr>
            <th>コード</th>
            <th>名称</th>
            <th>カテゴリ</th>
            <th>在庫区分</th>
            <th>標準単価</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      
      const tbody = table.querySelector('tbody');
      records.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${Utils.escapeHtml(Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.CODE))}</td>
          <td>${Utils.escapeHtml(Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.NAME))}</td>
          <td>${Utils.escapeHtml(Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.CATEGORY))}</td>
          <td>${Utils.escapeHtml(Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.IS_INVENTORY))}</td>
          <td class="po-cell-right">${Utils.formatNumber(Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.STANDARD_PRICE))}</td>
          <td class="po-cell-center">
            <button type="button" class="po-btn po-btn-sm po-btn-primary btn-select-item">${CONFIG.UI.BUTTON_TEXT.SELECT}</button>
          </td>
        `;
        
        tr.querySelector('.btn-select-item').addEventListener('click', function() {
          selectItem(record);
        });
        
        tbody.appendChild(tr);
      });
      
      resultsDiv.appendChild(table);
      Utils.hideLoading();
      
    } catch (error) {
      Utils.hideLoading();
      Utils.error('アイテム検索エラー', error);
      Utils.showAlert('アイテム検索に失敗しました', 'error');
    }
  }
  
  /**
   * アイテム選択
   * @param {Object} record - アイテムレコード
   */
  function selectItem(record) {
    const modal = document.getElementById('modalItemSearch');
    const rowNo = modal.dataset.targetRow;
    const row = document.querySelector(`#itemsBody tr[data-row-no="${rowNo}"]`);
    
    if (!row) return;
    
    // アイテム情報を明細行に設定
    row.querySelector('.item-code').value = Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.CODE);
    row.querySelector('.item-name').value = Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.NAME);
    row.querySelector('.unit').value = Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.UNIT);
    row.dataset.isInventory = Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.IS_INVENTORY);
    
    // 標準単価があれば設定
    const standardPrice = Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.STANDARD_PRICE);
    if (standardPrice) {
      row.querySelector('.unit-price').value = standardPrice;
    }
    
    // 仕様情報があれば詳細項目に設定
    const specification = Utils.getFieldValue(record, CONFIG.FIELDS.ITEM_MASTER.SPECIFICATION);
    if (specification) {
      row.querySelector('.item-detail').value = specification;
    }
    
    modal.style.display = 'none';
    Calculator.calculateRowAmount(row);
    
    Utils.log('アイテム選択完了', record);
  }
  
  /**
   * 案件選択モーダルを開く
   * @param {HTMLElement} row - 対象の明細行
   */
  function openProjectModal(row) {
    const modal = document.getElementById('modalProjectSelect');
    modal.style.display = 'block';
    modal.dataset.targetRow = row.dataset.rowNo;
    
    // 既存選択済み案件を表示
    displaySelectedProjects(row);
    
    // 検索ボタンイベント
    document.getElementById('btnProjectSearch').onclick = async function() {
      const query = document.getElementById('projectSearchQuery').value;
      await searchProjects(query, row);
    };
    
    // 選択確定ボタン
    document.getElementById('btnProjectConfirm').onclick = function() {
      modal.style.display = 'none';
    };
  }
  
  /**
   * 案件検索実行
   * @param {string} query - 検索クエリ
   * @param {HTMLElement} row - 対象の明細行
   */
  async function searchProjects(query, row) {
    try {
      Utils.showLoading('案件検索中...');
      
      const records = await MasterData.searchProjects(query);
      const resultsDiv = document.getElementById('projectSearchResults');
      resultsDiv.innerHTML = '';
      
      if (records.length === 0) {
        resultsDiv.innerHTML = `<p class="po-no-results">${CONFIG.UI.MESSAGES.ERROR_NO_RESULTS}</p>`;
        Utils.hideLoading();
        return;
      }
      
      const selectedIds = (row.dataset.projectIds || '').split(',').filter(id => id);
      
      const container = document.createElement('div');
      container.className = 'po-checkbox-group';
      
      records.forEach(record => {
        const projectId = Utils.getFieldValue(record, CONFIG.FIELDS.PROJECT.ID);
        const isChecked = selectedIds.includes(projectId);
        
        const label = document.createElement('label');
        label.className = 'po-checkbox-label';
        label.innerHTML = `
          <input type="checkbox" class="po-checkbox" value="${Utils.escapeHtml(projectId)}" ${isChecked ? 'checked' : ''}>
          <span>${Utils.escapeHtml(projectId)}</span>
        `;
        
        label.querySelector('input').addEventListener('change', function() {
          updateSelectedProjects(row, projectId, this.checked);
        });
        
        container.appendChild(label);
      });
      
      resultsDiv.appendChild(container);
      Utils.hideLoading();
      
    } catch (error) {
      Utils.hideLoading();
      Utils.error('案件検索エラー', error);
      Utils.showAlert('案件検索に失敗しました', 'error');
    }
  }
  
  /**
   * 選択済み案件を更新
   * @param {HTMLElement} row - 対象の明細行
   * @param {string} projectId - 案件ID
   * @param {boolean} isSelected - 選択状態
   */
  function updateSelectedProjects(row, projectId, isSelected) {
    let selectedIds = (row.dataset.projectIds || '').split(',').filter(id => id);
    
    if (isSelected) {
      if (!selectedIds.includes(projectId)) {
        selectedIds.push(projectId);
      }
    } else {
      selectedIds = selectedIds.filter(id => id !== projectId);
    }
    
    row.dataset.projectIds = selectedIds.join(',');
    row.dataset.projectDisplay = selectedIds.join(', ');
    
    displaySelectedProjects(row);
  }
  
  /**
   * 選択済み案件を表示
   * @param {HTMLElement} row - 対象の明細行
   */
  function displaySelectedProjects(row) {
    const tagsDiv = row.querySelector('.project-tags');
    const selectedIds = (row.dataset.projectIds || '').split(',').filter(id => id);
    
    tagsDiv.innerHTML = '';
    
    selectedIds.forEach(id => {
      const tag = document.createElement('span');
      tag.className = 'po-tag';
      tag.textContent = id;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'po-tag-remove';
      removeBtn.textContent = '×';
      removeBtn.onclick = function(e) {
        e.stopPropagation();
        updateSelectedProjects(row, id, false);
      };
      
      tag.appendChild(removeBtn);
      tagsDiv.appendChild(tag);
    });
  }
  
  /**
   * 見積参照モーダルを開く
   */
  window.openQuoteModal = async function() {
    const vendorCode = document.getElementById('vendor').value;
    if (!vendorCode) {
      Utils.showAlert(CONFIG.UI.MESSAGES.ERROR_NO_VENDOR, 'warning');
      return;
    }
    
    const modal = document.getElementById('modalQuoteRef');
    modal.style.display = 'block';
    
    // 初期検索(発注先でフィルタ)
    await searchQuotes(vendorCode);
    
    // 検索ボタンイベント
    document.getElementById('btnQuoteSearch').onclick = async function() {
      const query = document.getElementById('quoteSearchQuery').value;
      await searchQuotes(vendorCode, query);
    };
  };
  
  /**
   * 見積検索実行
   * @param {string} vendorCode - 発注先コード
   * @param {string} searchQuery - 検索クエリ
   */
  async function searchQuotes(vendorCode, searchQuery = '') {
    try {
      Utils.showLoading('見積検索中...');
      
      const records = await MasterData.searchQuotes(vendorCode, searchQuery);
      const resultsDiv = document.getElementById('quoteSearchResults');
      resultsDiv.innerHTML = '';
      
      if (records.length === 0) {
        resultsDiv.innerHTML = `<p class="po-no-results">${CONFIG.UI.MESSAGES.ERROR_NO_RESULTS}</p>`;
        Utils.hideLoading();
        return;
      }
      
      records.forEach(record => {
        const card = document.createElement('div');
        card.className = 'po-quote-card';
        
        const quoteNumber = Utils.getFieldValue(record, CONFIG.FIELDS.QUOTE.NUMBER);
        const quoteName = Utils.getFieldValue(record, CONFIG.FIELDS.QUOTE.NAME);
        const currency = Utils.getFieldValue(record, CONFIG.FIELDS.QUOTE.CURRENCY);
        const expiryDate = Utils.getFieldValue(record, CONFIG.FIELDS.QUOTE.EXPIRY_DATE);
        const itemsCount = record[CONFIG.FIELDS.QUOTE.ITEMS]?.value?.length || 0;
        
        card.innerHTML = `
          <div class="po-quote-header">
            <h4 class="po-quote-title">${Utils.escapeHtml(quoteNumber)} - ${Utils.escapeHtml(quoteName)}</h4>
          </div>
          <div class="po-quote-body">
            <p>通貨: ${Utils.escapeHtml(currency)} | 有効期限: ${expiryDate || '無期限'}</p>
            <p>明細行数: ${itemsCount}行</p>
          </div>
          <div class="po-quote-footer">
            <button type="button" class="po-btn po-btn-primary btn-import-quote">この見積を取込</button>
          </div>
        `;
        
        card.querySelector('.btn-import-quote').addEventListener('click', function() {
          importQuoteItems(record);
        });
        
        resultsDiv.appendChild(card);
      });
      
      Utils.hideLoading();
      
    } catch (error) {
      Utils.hideLoading();
      Utils.error('見積検索エラー', error);
      Utils.showAlert('見積検索に失敗しました', 'error');
    }
  }
  
  /**
   * 見積明細を取込
   * @param {Object} quoteRecord - 見積レコード
   */
  function importQuoteItems(quoteRecord) {
    const tbody = document.getElementById('itemsBody');
    const currentCount = tbody.children.length;
    
    // 既存明細がある場合は確認
    if (currentCount > 0) {
      const overwrite = Utils.confirm('既存の明細を上書きしますか?\n\n「OK」: 上書き\n「キャンセル」: 追加');
      if (overwrite) {
        tbody.innerHTML = '';
      }
    }
    
    // 見積明細を取込
    const quoteItems = quoteRecord[CONFIG.FIELDS.QUOTE.ITEMS]?.value || [];
    let importedCount = 0;
    
    quoteItems.forEach(item => {
      const currentCount = document.querySelectorAll('#itemsBody tr').length;
      if (currentCount >= CONFIG.MAX_ITEMS) {
        return;
      }
      
      const rowNo = currentCount + 1;
      const row = document.createElement('tr');
      row.dataset.rowNo = rowNo;
      row.dataset.projectIds = '';
      row.dataset.projectDisplay = '';
      row.dataset.isInventory = CONFIG.INVENTORY_TYPES.NON_INVENTORY;
      
      const itemCode = Utils.getFieldValue(item.value, CONFIG.FIELDS.QUOTE_ITEM.ITEM_CODE);
      const itemName = Utils.getFieldValue(item.value, CONFIG.FIELDS.QUOTE_ITEM.ITEM_NAME);
      const itemDetail = Utils.getFieldValue(item.value, CONFIG.FIELDS.QUOTE_ITEM.ITEM_DETAIL);
      const unitPrice = Utils.getFieldValue(item.value, CONFIG.FIELDS.QUOTE_ITEM.UNIT_PRICE);
      const unit = Utils.getFieldValue(item.value, CONFIG.FIELDS.QUOTE_ITEM.UNIT);
      
      row.innerHTML = `
        <td class="po-cell-center">${rowNo}</td>
        <td>
          <div class="po-input-group-compact">
            <input type="text" class="po-input po-input-sm item-code" value="${Utils.escapeHtml(itemCode)}">
            <button type="button" class="po-btn po-btn-icon btn-search" title="アイテム検索">🔍</button>
          </div>
        </td>
        <td><input type="text" class="po-input po-input-sm item-name" value="${Utils.escapeHtml(itemName)}" required></td>
        <td><textarea class="po-textarea po-textarea-sm item-detail" rows="2">${Utils.escapeHtml(itemDetail)}</textarea></td>
        <td><input type="number" class="po-input po-input-sm po-input-number unit-price" value="${unitPrice}" step="0.01" min="0" required></td>
        <td><input type="number" class="po-input po-input-sm po-input-number quantity" step="0.01" min="0" placeholder="0" required></td>
        <td><input type="text" class="po-input po-input-sm unit" value="${Utils.escapeHtml(unit)}"></td>
        <td class="po-cell-right amount" data-value="0">0.00</td>
        <td>
          <div class="project-tags"></div>
          <button type="button" class="po-btn po-btn-icon po-btn-sm btn-project" title="案件追加">➕</button>
        </td>
        <td class="po-cell-center">
          <button type="button" class="po-btn po-btn-icon po-btn-danger btn-delete" title="削除">✕</button>
        </td>
      `;
      
      tbody.appendChild(row);
      attachRowEventListeners(row);
      importedCount++;
    });
    
    // 通貨を見積と合わせる
    const quoteCurrency = Utils.getFieldValue(quoteRecord, CONFIG.FIELDS.QUOTE.CURRENCY);
    document.getElementById('currency').value = quoteCurrency;
    document.getElementById('currency').dispatchEvent(new Event('change'));
    
    updateItemCount();
    Calculator.calculateTotal();
    
    // モーダルを閉じる
    document.getElementById('modalQuoteRef').style.display = 'none';
    
    Utils.showAlert(
      Utils.formatMessage(CONFIG.UI.MESSAGES.INFO_ITEMS_IMPORTED, { count: importedCount }),
      'success'
    );
    
    Utils.log(`見積明細取込完了: ${importedCount}行`);
  }
  
  /**
   * レコード登録処理は customView_part3.js に続く
   */
  
})(window);
