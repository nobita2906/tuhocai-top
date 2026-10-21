/**
 * ========================================================
 * GOOGLE APPS SCRIPT CHO GOOGLE SHEETS
 * Tự động đăng bài lên Blogger "Tự Học AI" 1-Click
 * ========================================================
 */

var BLOG_ID = '2562876275428955705';

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Blogger Tự Học AI')
    .addItem('⚡ Đăng các bài "Sẵn sàng đăng"', 'publishReadyPosts')
    .addItem('📝 Đăng bài ở hàng đang chọn', 'publishCurrentRow')
    .addToUi();
}

function publishReadyPosts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var status = row[10]; // Cột K: Trang_Thai

    if (status === 'Sẵn sàng đăng') {
      var result = publishPostFromRow(row, i + 1, sheet);
      if (result) count++;
    }
  }

  SpreadsheetApp.getUi().alert('🎉 Đã xuất bản thành công ' + count + ' bài viết lên Blogger!');
}

function publishCurrentRow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rowIndex = sheet.getActiveCell().getRow();
  if (rowIndex <= 1) {
    SpreadsheetApp.getUi().alert('Vui lòng chọn một hàng bài viết (từ dòng 2 trở đi)!');
    return;
  }
  var row = sheet.getRange(rowIndex, 1, 1, 13).getValues()[0];
  var result = publishPostFromRow(row, rowIndex, sheet);
  if (result) {
    SpreadsheetApp.getUi().alert('🎉 Đã xuất bản thành công bài viết: ' + row[2]);
  }
}

function publishPostFromRow(row, rowIndex, sheet) {
  var template = row[1];
  var title = row[2];
  var labels = row[3] ? row[3].toString().split(',').map(function(s){return s.trim();}) : ['Template n8n'];
  var img = row[4] || 'https://workflowfree.com/wp-content/uploads/2026/08/anh-bia-1024x574.png';
  var priceSale = row[5] ? parseInt(row[5]).toLocaleString('vi-VN') + ' đ' : '199.000 đ';
  var priceReg = row[6] ? parseInt(row[6]).toLocaleString('vi-VN') + ' đ' : '350.000 đ';
  var amountClean = row[5] || '199000';
  var code = row[7] || ('WF' + rowIndex);
  var promptAI = row[8] || '';
  var desc = row[9] || '';

  var htmlContent = '';

  if (template.indexOf('Bán hàng') !== -1 || template.indexOf('Cửa hàng') !== -1) {
    htmlContent = '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin:20px 0 32px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);font-family:sans-serif;">' +
      '<div style="display:flex;flex-wrap:wrap;gap:24px;align-items:center;">' +
      '<div style="flex:1 1 280px;text-align:center;"><img src="' + img + '" alt="' + title + '" style="max-width:100%;border-radius:12px;" /></div>' +
      '<div style="flex:1 1 340px;">' +
      '<span style="background:#fef2f2;color:#ef4444;font-weight:700;font-size:12px;padding:4px 12px;border-radius:20px;">🔥 SẢN PHẨM CAO CẤP</span>' +
      '<h2 style="font-size:21px;font-weight:800;color:#0f172a;margin:12px 0;">' + title + '</h2>' +
      '<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:18px;"><span style="font-size:28px;font-weight:800;color:#4f46e5;">' + priceSale + '</span><del style="color:#94a3b8;">' + priceReg + '</del></div>' +
      '<div style="background:#f8fafc;border-radius:10px;padding:12px 16px;margin-bottom:20px;border:1px dashed #cbd5e1;font-size:13.5px;line-height:1.75;">' +
      '<div>✅ Tải trọn bộ file JSON workflow n8n gốc</div><div>✅ Kèm video hướng dẫn cài đặt từng node</div><div>✅ Hỗ trợ kích hoạt 1-1 qua Zalo</div></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;">' +
      '<a href="#thanh-toan" style="flex:1 1 180px;text-align:center;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);color:#fff;padding:12px 18px;border-radius:8px;font-weight:700;text-decoration:none;">⚡ QUÉT MÃ VIETQR (' + priceSale + ')</a>' +
      '<a href="https://zalo.me/0987654321" class="btn-zalo" target="_blank" style="flex:1 1 130px;text-align:center;background:#0068ff;color:#fff;padding:12px 16px;border-radius:8px;font-weight:700;text-decoration:none;">💬 Chat Zalo</a>' +
      '</div></div></div>' +
      '<div id="thanh-toan" style="margin-top:24px;padding-top:20px;border-top:1px solid #f1f5f9;text-align:center;">' +
      '<div style="font-size:13px;color:#64748b;margin-bottom:8px;">Mở App Ngân hàng hoặc MoMo quét mã nhận link ngay:</div>' +
      '<img class="vietqr-img" data-amount="' + amountClean + '" data-memo="' + code + '" src="https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=' + amountClean + '&addInfo=' + code + '&accountName=NGUYEN%20DANG" style="max-width:220px;margin:0 auto 10px;" />' +
      '<div style="font-size:14px;">Số tiền: <strong style="color:#ef4444;">' + priceSale + '</strong> | Cú pháp: <strong style="color:#4f46e5;">' + code + '</strong></div>' +
      '</div></div>' +
      '<h3>Giới thiệu chi tiết sản phẩm:</h3><p>' + desc + '</p>';
  } else if (template.indexOf('Workflow') !== -1) {
    htmlContent = '<div style="background:linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%);border:1px solid #c7d2fe;border-radius:16px;padding:24px;margin:20px 0 30px;">' +
      '<span style="background:#6366f1;color:#fff;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:20px;">⚡ FREE WORKFLOW</span>' +
      '<h2 style="font-size:21px;font-weight:800;color:#1e1b4b;margin:10px 0;">' + title + '</h2>' +
      '<div style="margin:16px 0;"><a href="' + code + '" target="_blank" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:10px;font-weight:700;text-decoration:none;display:inline-block;">📥 Tải File JSON (.json)</a></div>' +
      '</div>' +
      '<div style="text-align:center;margin:20px 0;"><img src="' + img + '" alt="' + title + '" style="max-width:100%;border-radius:12px;" /></div>' +
      '<h3>Mô tả quy trình:</h3><p>' + desc + '</p>';
  } else if (template.indexOf('Prompt') !== -1) {
    htmlContent = '<div style="text-align:center;margin:20px 0;"><img src="' + img + '" alt="' + title + '" style="max-width:100%;border-radius:14px;" /></div>' +
      '<h3>🎨 Câu Lệnh Prompt Chính Thức</h3>' +
      '<div style="background:#0f172a;color:#f8fafc;border-radius:12px;padding:20px;font-family:monospace;font-size:14px;line-height:1.6;margin:16px 0;">' + (promptAI || desc) + '</div>' +
      '<h3>Phân tích & Hướng dẫn:</h3><p>' + desc + '</p>';
  } else {
    htmlContent = '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin:20px 0;">' +
      '<span style="background:#ecfdf5;color:#059669;font-weight:700;font-size:12px;padding:3px 10px;border-radius:20px;">📚 BÀI HƯỚNG DẪN</span>' +
      '<h2 style="font-size:21px;font-weight:800;color:#0f172a;margin:10px 0;">' + title + '</h2></div>' +
      '<div style="text-align:center;margin:20px 0;"><img src="' + img + '" alt="' + title + '" style="max-width:100%;border-radius:12px;" /></div>' +
      '<div style="font-size:15.5px;line-height:1.8;">' + desc + '</div>';
  }

  // Gọi Blogger REST API v3 bằng Google Apps Script OAuth Token
  var payload = {
    kind: 'blogger#post',
    title: title,
    content: htmlContent,
    labels: labels
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var url = 'https://www.googleapis.com/blogger/v3/blogs/' + BLOG_ID + '/posts/';
  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());

  if (json.url) {
    sheet.getRange(rowIndex, 11).setValue('Đã đăng'); // Cột K
    sheet.getRange(rowIndex, 12).setValue(json.url); // Cột L
    sheet.getRange(rowIndex, 13).setValue(new Date()); // Cột M
    return true;
  } else {
    Logger.log('Lỗi đăng bài: ' + response.getContentText());
    return false;
  }
}
