/**
 * ============================================================
 * Google Apps Script: auto-send-download.gs
 * Blog: Tự Học AI (tuhocai.top)
 *
 * HỆ THỐNG XỬ LÝ ĐƠN HÀNG & PHÊ DUYỆT TỰ ĐỘNG QUA TELEGRAM BOT
 * ============================================================
 */

// ============================================================
// CẤU HÌNH HỆ THỐNG
// ============================================================
const SPREADSHEET_ID = '1a52NAJUvK8E4VR0BUd9x2-2pEcGP1ibM_8cYfXvM5_8';
const PRODUCTS_SHEET = 'Products';
const ORDERS_SHEET = 'Orders';
const FREE_SHEET = 'Free Downloads';
const CONFIG_SHEET = 'Config';

const BLOG_NAME = 'Tự Học AI';
const BLOG_URL = 'https://www.tuhocai.top';
const SUPPORT_ZALO = '0938494303';
const BANK_INFO = 'VPBank - 0934434101 - NGUYEN VAN DANG';

const TELEGRAM_BOT_TOKEN = '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y';
const TELEGRAM_CHAT_ID = '6580812076';

// ============================================================
// 1. SETUP PROGRAMMATIC: CẤU TRÚC SHEET & WEBHOOK
// ============================================================
function initFullSetup() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // A. Setup Tab 'Products'
  var prodSheet = ss.getSheetByName(PRODUCTS_SHEET) || ss.insertSheet(PRODUCTS_SHEET);
  if (prodSheet.getLastRow() === 0) {
    var prodHeaders = ['pid', 'name', 'price', 'driveId', 'active', 'category', 'description'];
    prodSheet.getRange(1, 1, 1, prodHeaders.length).setValues([prodHeaders]).setFontWeight('bold').setBackground('#e0e7ff');
  }

  // B. Setup Tab 'Free Downloads'
  var freeSheet = ss.getSheetByName(FREE_SHEET) || ss.insertSheet(FREE_SHEET);
  if (freeSheet.getLastRow() === 0) {
    var freeHeaders = ['Thời gian', 'Họ tên', 'Email', 'Mã SP (PID)', 'Tên sản phẩm', 'Link tải', 'Trạng thái'];
    freeSheet.getRange(1, 1, 1, freeHeaders.length).setValues([freeHeaders]).setFontWeight('bold').setBackground('#dcfce7');
  }

  // C. Setup Tab 'Orders' (Bao gồm cột lưu ảnh biên lai và trạng thái duyệt)
  var ordSheet = ss.getSheetByName(ORDERS_SHEET) || ss.insertSheet(ORDERS_SHEET);
  if (ordSheet.getLastRow() === 0) {
    var ordHeaders = ['Thời gian', 'Mã đơn (OrderID)', 'Email', 'Họ tên', 'Mã SP (PID)', 'Tên sản phẩm', 'Giá (VNĐ)', 'Link Ảnh Biên Lai', 'Trạng thái', 'Thời gian xử lý'];
    ordSheet.getRange(1, 1, 1, ordHeaders.length).setValues([ordHeaders]).setFontWeight('bold').setBackground('#fef3c7');
  }

  // D. Setup Tab 'Config'
  var cfgSheet = ss.getSheetByName(CONFIG_SHEET) || ss.insertSheet(CONFIG_SHEET);
  cfgSheet.getRange(1, 1, 4, 2).setValues([
    ['BLOG_NAME', BLOG_NAME],
    ['BLOG_URL', BLOG_URL],
    ['TELEGRAM_CHAT_ID', TELEGRAM_CHAT_ID],
    ['UPDATED_AT', new Date()]
  ]);

  Logger.log('=== INIT SETUP COMPLETED! ===');
}

// Hàm kích hoạt cấp quyền Google Drive (Bấm Chạy hàm này 1 lần trong Apps Script Editor để cấp quyền)
function authorizeDriveAccess() {
  var folder = getOrCreateFolder('BienLai_TuHocAI');
  Logger.log('Đã cấp quyền Google Drive thành công! Thư mục biên lai ID: ' + folder.getId());
}

// Hàm đăng ký Telegram Webhook tự động
function setTelegramWebhook() {
  var webAppUrl = 'https://script.google.com/macros/s/AKfycbxEFiTb3JO611CQLAhA8hvtkV0UygU40AKMXR3KmHDt2R-cHcGpwZALc-_3nk2OhZ0lkQ/exec';
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/setWebhook?url=' + encodeURIComponent(webAppUrl);
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log('setWebhook result: ' + res.getContentText());
}

// ============================================================
// 2. WEB APP ENDPOINTS (doGet & doPost)
// ============================================================
function doGet(e) {
  var p = e && e.parameter ? e.parameter : {};
  var action = p.action || '';

  if (action === 'ping') {
    return jsonResponse({ ok: true, message: 'Tự Học AI API & Telegram Bot is running!', timestamp: new Date() });
  }

  if (action === 'free') {
    return handleFreeDownload(p);
  }

  return jsonResponse({ ok: false, error: 'Action không hợp lệ' });
}

function doPost(e) {
  try {
    var contents = e && e.postData && e.postData.contents ? e.postData.contents : '';

    // A. Kiểm tra nếu request đến từ Telegram Webhook (Callback query hoặc Message)
    var tgUpdate = null;
    if (contents) {
      try {
        tgUpdate = JSON.parse(contents);
      } catch (errJson) {}
    }

    if (tgUpdate && (tgUpdate.callback_query || tgUpdate.message)) {
      return handleTelegramWebhook(tgUpdate);
    }

    // B. Xử lý request từ Checkout page (Form submit / JSON)
    var p = {};
    if (contents) {
      try { p = JSON.parse(contents); } catch(err) { p = e.parameter || {}; }
    } else {
      p = e && e.parameter ? e.parameter : {};
    }

    var action = p.action || '';

    // 1. Tải miễn phí 0đ
    if (action === 'free') {
      return handleFreeDownload(p);
    }

    // 2. Gửi biên lai đơn hàng trả phí (kèm ảnh base64)
    if (action === 'paid_order_upload') {
      return handlePaidOrderUpload(p);
    }

    return jsonResponse({ ok: false, error: 'Action POST không hợp lệ' });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ============================================================
// 3. XỬ LÝ TẢI MIỄN PHÍ (0đ)
// ============================================================
function handleFreeDownload(p) {
  var email       = String(p.email || '').trim();
  var name        = String(p.name || '').trim();
  var pid         = String(p.pid || '').trim();
  var productName = decodeURIComponent(String(p.productName || p.name || pid));
  var drive       = String(p.drive || '').trim();

  if (!email || !email.includes('@')) {
    return jsonResponse({ ok: false, error: 'Email không hợp lệ' });
  }
  if (!pid) {
    return jsonResponse({ ok: false, error: 'Thiếu mã sản phẩm' });
  }

  var driveId = drive || getDriveIdByPid(pid) || '1SAMPLE_DRIVE_ID';
  var downloadLink = 'https://drive.google.com/file/d/' + driveId + '/view?usp=sharing';

  // Gửi email tự động
  sendDownloadEmail(email, name, productName, pid, downloadLink, 0);

  // Ghi log vào Sheet
  logFreeDownload(email, name, pid, productName, downloadLink);

  return jsonResponse({
    ok: true,
    message: 'Đã gửi link tải thành công vào email ' + email + '!',
    email: email,
    productName: productName
  });
}

// ============================================================
// 4. XỬ LÝ ĐƠN HÀNG TRẢ PHÍ (LƯU ẢNH & BÁO TELEGRAM BOT DUYỆT)
// ============================================================
function handlePaidOrderUpload(p) {
  var email       = String(p.email || '').trim();
  var name        = String(p.name || 'Khách vãng lai').trim();
  var pid         = String(p.pid || 'THAI-PROD').trim();
  var productName = decodeURIComponent(String(p.productName || p.name || pid));
  var price       = parseInt(String(p.price || '0').replace(/\D/g, ''), 10) || 99000;
  var imageBase64 = String(p.imageBase64 || '').trim();
  var mimeType    = String(p.mimeType || 'image/jpeg');

  if (!email || !email.includes('@')) {
    return jsonResponse({ ok: false, error: 'Email không hợp lệ' });
  }

  // Tạo mã đơn hàng duy nhất
  var orderId = 'THAI-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyMMdd-HHmmss');

  // Xử lý ảnh biên lai
  var receiptUrl = 'Không tải ảnh';
  var imageBlob = null;

  if (imageBase64) {
    try {
      var rawBase64 = imageBase64;
      if (rawBase64.indexOf(',') !== -1) {
        rawBase64 = rawBase64.split(',')[1];
      }
      var decodedBytes = Utilities.base64Decode(rawBase64);
      var fileExt = (mimeType && mimeType.includes('png')) ? 'png' : 'jpg';
      imageBlob = Utilities.newBlob(decodedBytes, mimeType, orderId + '_receipt.' + fileExt);
    } catch(errDecode) {
      Logger.log('Lỗi decode ảnh base64: ' + errDecode.message);
    }

    try {
      if (imageBlob) {
        // Lưu vào Google Drive thư mục "BienLai_TuHocAI"
        var folder = getOrCreateFolder('BienLai_TuHocAI');
        var driveFile = folder.createFile(imageBlob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        receiptUrl = driveFile.getUrl();
      }
    } catch(errImg) {
      receiptUrl = 'Chưa lưu Drive: ' + errImg.message;
      Logger.log('Lỗi lưu Drive: ' + errImg.message);
    }
  }

  // Ghi đơn vào Google Sheets (Status = 'PENDING')
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var ordSheet = ss.getSheetByName(ORDERS_SHEET) || ss.insertSheet(ORDERS_SHEET);
  ordSheet.appendRow([
    new Date(),
    orderId,
    email,
    name,
    pid,
    productName,
    price,
    receiptUrl,
    'PENDING',
    ''
  ]);

  // Gửi thông báo đến Telegram Bot kèm 2 nút bấm Inline Keyboard
  sendTelegramOrderNotification(orderId, productName, pid, price, name, email, imageBlob, receiptUrl);

  return jsonResponse({
    ok: true,
    orderId: orderId,
    message: 'Đã gửi biên lai chuyển khoản thành công! Mã đơn: #' + orderId
  });
}

// Gửi thông báo đơn hàng kèm ảnh qua Telegram API
function sendTelegramOrderNotification(orderId, productName, pid, price, name, email, imageBlob, receiptUrl) {
  try {
    var caption = "🔔 <b>ĐƠN HÀNG MỚI CẦN DUYỆT!</b>\n"
                + "━━━━━━━━━━━━━━━━━━━━━━\n"
                + "📦 <b>Sản phẩm:</b> " + productName + "\n"
                + "🏷️ <b>Mã SP:</b> <code>" + pid + "</code>\n"
                + "💰 <b>Số tiền:</b> <b>" + Number(price).toLocaleString('vi-VN') + " đ</b>\n"
                + "🆔 <b>Mã đơn:</b> <code>#" + orderId + "</code>\n"
                + "👤 <b>Khách hàng:</b> " + name + "\n"
                + "📧 <b>Email:</b> " + email + "\n"
                + "⏰ <b>Thời gian:</b> " + Utilities.formatDate(new Date(), 'GMT+7', 'HH:mm - dd/MM/yyyy') + "\n"
                + (receiptUrl && receiptUrl.startsWith('http') ? ("🔗 <a href='" + receiptUrl + "'>Xem ảnh gốc Drive</a>\n") : "")
                + "━━━━━━━━━━━━━━━━━━━━━━\n"
                + "👉 Bấm [✅ DUYỆT] để tự động gửi link tải qua Email.\n"
                + "👉 Bấm [❌ TỪ CHỐI] để gửi email báo lỗi cho khách.";

    var inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "✅ DUYỆT (Gửi Link)", callback_data: "appr:" + orderId },
          { text: "❌ TỪ CHỐI (Báo Lỗi)", callback_data: "rejc:" + orderId }
        ]
      ]
    };

    if (imageBlob) {
      // Gửi bằng sendPhoto: Chuyển toàn bộ text sang query string UTF-8 để Apps Script không làm lỗi font multipart
      var queryParams = [
        'chat_id=' + encodeURIComponent(TELEGRAM_CHAT_ID),
        'caption=' + encodeURIComponent(caption),
        'parse_mode=HTML',
        'reply_markup=' + encodeURIComponent(JSON.stringify(inlineKeyboard))
      ].join('&');

      var sendPhotoUrl = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendPhoto?' + queryParams;

      var res = UrlFetchApp.fetch(sendPhotoUrl, {
        method: 'post',
        payload: { photo: imageBlob },
        muteHttpExceptions: true
      });
      var resCode = res.getResponseCode();
      Logger.log('Telegram sendPhoto response: ' + resCode + ' - ' + res.getContentText());

      // Nếu Telegram sendPhoto không thành công (vd ảnh không hợp lệ), fallback gửi text
      if (resCode !== 200) {
        var payloadFallback = {
          chat_id: TELEGRAM_CHAT_ID,
          text: caption,
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard
        };
        UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
          method: 'post',
          contentType: 'application/json; charset=utf-8',
          payload: JSON.stringify(payloadFallback),
          muteHttpExceptions: true
        });
      }
    } else {
      // Gửi bằng sendMessage nếu không có ảnh
      var payloadMsg = {
        chat_id: TELEGRAM_CHAT_ID,
        text: caption,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard
      };
      UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method: 'post',
        contentType: 'application/json; charset=utf-8',
        payload: JSON.stringify(payloadMsg),
        muteHttpExceptions: true
      });
    }
  } catch(e) {
    Logger.log('Lỗi gửi Telegram: ' + e.message);
  }
}

// ============================================================
// 5. XỬ LÝ WEBHOOK TỪ TELEGRAM (ADMIN BẤM NÚT HOẶC GÕ LỆNH)
// ============================================================
function handleTelegramWebhook(tgUpdate) {
  // 1. Trường hợp Admin bấm nút Inline Keyboard
  if (tgUpdate.callback_query) {
    var cb = tgUpdate.callback_query;
    var data = String(cb.data || '');
    var chatId = cb.message ? cb.message.chat.id : TELEGRAM_CHAT_ID;
    var messageId = cb.message ? cb.message.message_id : null;
    var hasPhoto = Boolean(cb.message && cb.message.photo);

    var parts = data.split(':');
    var action = parts[0];
    var orderId = parts[1];

    if (action === 'appr') {
      try {
        var resAppr = processOrderApproval(orderId, chatId, messageId, hasPhoto);
        if (resAppr && resAppr.ok) {
          // Thông báo popup trên màn hình Telegram của Admin
          answerTelegramCallback(cb.id, "🎉 Đã duyệt đơn #" + orderId + "!\nĐã gửi link tải thành công cho khách hàng (" + resAppr.email + ").", true);
        } else {
          answerTelegramCallback(cb.id, (resAppr && resAppr.error) || "Đơn hàng đã được duyệt trước đó!", true);
        }
      } catch (errAppr) {
        Logger.log('Lỗi khi duyệt đơn: ' + errAppr.message);
        sendTelegramTextMessage(chatId, "❌ <b>Lỗi khi duyệt đơn #" + orderId + ":</b> " + errAppr.message);
        answerTelegramCallback(cb.id, "❌ Lỗi: " + errAppr.message, true);
        return jsonResponse({ ok: false, error: errAppr.message });
      }
    } else if (action === 'rejc') {
      try {
        processOrderRejection(orderId, chatId, messageId, hasPhoto);
        answerTelegramCallback(cb.id, "❌ Đã từ chối đơn hàng #" + orderId + " và báo cho khách!", true);
      } catch (errRejc) {
        sendTelegramTextMessage(chatId, "❌ <b>Lỗi khi từ chối đơn:</b> " + errRejc.message);
        answerTelegramCallback(cb.id, "❌ Lỗi: " + errRejc.message, true);
        return HtmlService.createHtmlOutput("OK");
      }
    }
    return HtmlService.createHtmlOutput("OK");
  }

  // 2. Trường hợp Admin gõ tin nhắn (yes / no #THAI-xxx)
  if (tgUpdate.message && tgUpdate.message.text) {
    var text = tgUpdate.message.text.trim();
    var match = text.match(/^(yes|duyet|ok|no|tuchoi|huy)\s+([A-Za-z0-9_-]+)/i);
    if (match) {
      var cmd = match[1].toLowerCase();
      var orderIdTxt = match[2].toUpperCase().replace(/^#/, '');
      var chatIdTxt = tgUpdate.message.chat.id;

      if (['yes', 'duyet', 'ok'].includes(cmd)) {
        processOrderApproval(orderIdTxt, chatIdTxt, null, false);
      } else {
        processOrderRejection(orderIdTxt, chatIdTxt, null, false);
      }
      return HtmlService.createHtmlOutput("OK");
    }
  }

  return HtmlService.createHtmlOutput("OK");
}

// Xử lý Duyệt Đơn (Yes) -> Gửi Link qua Email + Cập nhật Telegram
function processOrderApproval(orderId, chatId, messageId, hasPhoto) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var ordSheet = ss.getSheetByName(ORDERS_SHEET);
  if (!ordSheet) return { ok: false, error: 'Không tìm thấy Sheet Orders' };

  var data = ordSheet.getDataRange().getValues();
  var rowIndex = -1;
  var orderRow = null;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toUpperCase() === String(orderId).trim().toUpperCase()) {
      rowIndex = i + 1;
      orderRow = data[i];
      break;
    }
  }

  if (!orderRow) {
    sendTelegramTextMessage(chatId, "⚠️ <b>Không tìm thấy đơn hàng #" + orderId + " trong hệ thống!</b>");
    return { ok: false, error: 'Không tìm thấy đơn hàng #' + orderId };
  }

  var currentStatus = String(orderRow[8] || '').trim();
  if (currentStatus === 'APPROVED') {
    sendTelegramTextMessage(chatId, "ℹ️ <b>Đơn hàng #" + orderId + " ĐÃ ĐƯỢC DUYỆT trước đó!</b>");
    return { ok: false, error: 'Đơn hàng #' + orderId + ' đã được duyệt trước đó' };
  }

  var email       = orderRow[2];
  var name        = orderRow[3];
  var pid         = orderRow[4];
  var productName = orderRow[5];
  var price       = orderRow[6];

  // Lấy link Drive
  var driveId = getDriveIdByPid(pid) || '1SAMPLE_DRIVE_ID';
  var downloadLink = 'https://drive.google.com/file/d/' + driveId + '/view?usp=sharing';

  // 1. Gửi Email kèm Link tải cho khách
  sendDownloadEmail(email, name, productName, pid, downloadLink, price);

  // 2. Cập nhật Google Sheet (Status = 'APPROVED')
  ordSheet.getRange(rowIndex, 9).setValue('APPROVED');
  ordSheet.getRange(rowIndex, 10).setValue(new Date());

  // 3. Sửa caption/tin nhắn Telegram gốc thành ĐÃ DUYỆT (bỏ nút bấm)
  var doneTime = Utilities.formatDate(new Date(), 'GMT+7', 'HH:mm - dd/MM/yyyy');
  var updatedText = "✅ <b>ĐÃ DUYỆT ĐƠN HÀNG #" + orderId + "!</b>\n"
                  + "━━━━━━━━━━━━━━━━━━━━━━\n"
                  + "📦 <b>Sản phẩm:</b> " + productName + "\n"
                  + "👤 <b>Khách hàng:</b> " + name + " (<code>" + email + "</code>)\n"
                  + "💰 <b>Số tiền:</b> " + Number(price).toLocaleString('vi-VN') + " đ\n"
                  + "🎉 <b>Kết quả:</b> Đã gửi link Google Drive cho khách qua email lúc <b>" + doneTime + "</b>.";

  if (messageId && hasPhoto) {
    editTelegramCaption(chatId, messageId, updatedText);
  } else if (messageId) {
    editTelegramText(chatId, messageId, updatedText);
  }

  // 4. GỬI TIN NHẮN THÔNG BÁO RIÊNG: ĐÃ GỬI LINK THÀNH CÔNG CHO KHÁCH HÀNG
  var notifySuccessText = "🚀 <b>THÔNG BÁO: ĐÃ GỬI LINK THÀNH CÔNG CHO KHÁCH HÀNG!</b>\n"
                        + "━━━━━━━━━━━━━━━━━━━━━━\n"
                        + "✅ <b>Trạng thái:</b> Đã giao hàng qua Email\n"
                        + "🆔 <b>Mã đơn hàng:</b> <code>#" + orderId + "</code>\n"
                        + "👤 <b>Khách hàng:</b> <b>" + name + "</b>\n"
                        + "📧 <b>Email nhận link:</b> <code>" + email + "</code>\n"
                        + "📦 <b>Sản phẩm:</b> " + productName + "\n"
                        + "🔗 <b>Link Drive đã gửi:</b> <a href='" + downloadLink + "'>Bấm mở link tải</a>\n"
                        + "⏰ <b>Thời gian duyệt & gửi:</b> " + doneTime + "\n"
                        + "━━━━━━━━━━━━━━━━━━━━━━\n"
                        + "👉 Khách hàng đã nhận được email kèm tài liệu. Nếu cần hỗ trợ thêm, khách có thể liên hệ Zalo: " + SUPPORT_ZALO;

  sendTelegramTextMessage(chatId, notifySuccessText);

  return { ok: true, email: email, orderId: orderId, name: name, productName: productName };
}

// Xử lý Từ Chối (No) -> Gửi Email báo lỗi thanh toán + Cập nhật Telegram
function processOrderRejection(orderId, chatId, messageId, hasPhoto) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var ordSheet = ss.getSheetByName(ORDERS_SHEET);
  if (!ordSheet) return;

  var data = ordSheet.getDataRange().getValues();
  var rowIndex = -1;
  var orderRow = null;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toUpperCase() === String(orderId).trim().toUpperCase()) {
      rowIndex = i + 1;
      orderRow = data[i];
      break;
    }
  }

  if (!orderRow) {
    sendTelegramTextMessage(chatId, "⚠️ <b>Không tìm thấy đơn hàng #" + orderId + " trong hệ thống!</b>");
    return;
  }

  var email       = orderRow[2];
  var name        = orderRow[3];
  var productName = orderRow[5];

  // 1. Gửi Email thông báo lỗi thanh toán cho khách
  sendPaymentRejectionEmail(email, name, productName, orderId);

  // 2. Cập nhật Google Sheet (Status = 'REJECTED')
  ordSheet.getRange(rowIndex, 9).setValue('REJECTED');
  ordSheet.getRange(rowIndex, 10).setValue(new Date());

  // 3. Sửa caption/tin nhắn Telegram thành ĐÃ TỪ CHỐI
  var rejectTime = Utilities.formatDate(new Date(), 'GMT+7', 'HH:mm - dd/MM/yyyy');
  var updatedText = "❌ <b>ĐÃ TỪ CHỐI ĐƠN HÀNG #" + orderId + "</b>\n"
                  + "━━━━━━━━━━━━━━━━━━━━━━\n"
                  + "📦 <b>Sản phẩm:</b> " + productName + "\n"
                  + "👤 <b>Khách hàng:</b> " + name + " (<code>" + email + "</code>)\n"
                  + "⚠️ <b>Kết quả:</b> Đã gửi email thông báo thông tin thanh toán chưa đúng hoặc chưa nhận được tiền lúc <b>" + rejectTime + "</b>.\n"
                  + "👉 Khách có thể liên hệ Zalo <b>" + SUPPORT_ZALO + "</b> để đối soát.";

  if (messageId && hasPhoto) {
    editTelegramCaption(chatId, messageId, updatedText);
  } else if (messageId) {
    editTelegramText(chatId, messageId, updatedText);
  } else {
    sendTelegramTextMessage(chatId, updatedText);
  }
}

// ============================================================
// 6. GỬI EMAIL: LINK TẢI THÀNH CÔNG & THÔNG BÁO TỪ CHỐI
// ============================================================
function sendDownloadEmail(email, customerName, productName, pid, downloadLink, price) {
  var subject = '🎉 [Tự Học AI] Link Tải Tài Nguyên: ' + productName;
  var priceText = price === 0 ? 'MIỄN PHÍ (0đ)' : (Number(price).toLocaleString('vi-VN') + ' đ');

  var htmlBody = '<!DOCTYPE html>'
    + '<html>'
    + '<head><meta charset="utf-8"/></head>'
    + '<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">'
    + '  <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">'
    + '    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">'
    + '      <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">Cảm ơn bạn đã tin tưởng ' + BLOG_NAME + '!</h1>'
    + '      <p style="margin: 0; font-size: 14px; opacity: 0.95; color: #e0e7ff;">Tài liệu AI &amp; Workflow của bạn đã sẵn sàng để tải xuống</p>'
    + '    </div>'
    + '    <div style="padding: 28px 24px;">'
    + '      <p style="color: #334155; font-size: 15px; margin: 0 0 16px;">Xin chào <strong>' + (customerName || 'bạn') + '</strong>,</p>'
    + '      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">Dưới đây là link truy cập file Google Drive của tài nguyên bạn đã đặt mua:</p>'
    + '      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">'
    + '        <div style="font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">&#128230; SẢN PHẨM / TÀI LIỆU</div>'
    + '        <div style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 12px; line-height: 1.4;">' + productName + '</div>'
    + '        <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; font-size: 13.5px; color: #64748b; line-height: 1.8;">'
    + '          <div>&#127991;&#65039; Mã sản phẩm: <strong style="color:#0f172a;">' + pid + '</strong></div>'
    + '          <div>&#128176; Số tiền: <strong style="color:#16a34a;">' + priceText + '</strong></div>'
    + '        </div>'
    + '      </div>'
    + '      <div style="text-align: center; margin: 28px 0;">'
    + '        <a href="' + downloadLink + '" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 800; padding: 15px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(34,197,94,0.35);">&#11015;&#65039; BẤM VÀO ĐÂY ĐỂ TẢI XUỐNG</a>'
    + '      </div>'
    + '      <p style="color: #64748b; font-size: 12.5px; line-height: 1.6; text-align: center; margin: 0 0 24px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 10px 14px;">'
    + '        &#128161; <em>Lưu ý: Bạn nên lưu bản sao về Google Drive hoặc tải về máy tính để sử dụng lâu dài.</em>'
    + '      </p>'
    + '      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; text-align: center; line-height: 1.6;">'
    + '        <p style="margin: 0 0 6px;">Cần hỗ trợ kỹ thuật hoặc tư vấn? Liên hệ trực tiếp qua Zalo:</p>'
    + '        <p style="margin: 0 0 10px;"><a href="https://zalo.me/' + SUPPORT_ZALO + '" style="color: #6366f1; font-weight: 700; text-decoration: none;">&#128172; Zalo Hỗ Trợ: ' + SUPPORT_ZALO + '</a></p>'
    + '        <p style="margin: 0; font-size: 12px; color: #94a3b8;"><a href="' + BLOG_URL + '" style="color: #6366f1; text-decoration: none;">' + BLOG_NAME + ' (tuhocai.top)</a> — Cổng tri thức tự học trí tuệ nhân tạo &amp; workflow thực chiến.</p>'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '</body>'
    + '</html>';

  MailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    name: BLOG_NAME
  });
}

function sendPaymentRejectionEmail(email, customerName, productName, orderId) {
  var subject = '⚠️ [Tự Học AI] Thông báo về giao dịch đơn hàng #' + orderId;

  var htmlBody = '<!DOCTYPE html>'
    + '<html>'
    + '<head><meta charset="utf-8"/></head>'
    + '<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">'
    + '  <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #fee2e2;">'
    + '    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 32px 24px; text-align: center;">'
    + '      <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 800; color: #ffffff;">Thông Báo Kiểm Tra Giao Dịch</h1>'
    + '      <p style="margin: 0; font-size: 14px; opacity: 0.95; color: #fee2e2;">Đơn hàng #' + orderId + ' — ' + productName + '</p>'
    + '    </div>'
    + '    <div style="padding: 28px 24px;">'
    + '      <p style="color: #334155; font-size: 15px; margin: 0 0 16px;">Xin chào <strong>' + (customerName || 'bạn') + '</strong>,</p>'
    + '      <p style="color: #475569; font-size: 14.5px; line-height: 1.7; margin: 0 0 20px;">'
    + '        Chúng tôi đã kiểm tra thông tin biên lai và đối soát với tài khoản ngân hàng, nhưng hiện tại <strong>thông tin thanh toán chưa chính xác hoặc hệ thống chưa nhận được số tiền chuyển khoản tương ứng</strong> cho đơn hàng này.'
    + '      </p>'
    + '      <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; color: #9f1239; font-size: 14px; line-height: 1.6;">'
    + '        <strong>👉 Hướng xử lý:</strong><br/>'
    + '        Nếu bạn đã chuyển khoản thành công từ tài khoản ngân hàng của bạn, vui lòng liên hệ trực tiếp qua Zalo để nhân viên kiểm tra đối soát thủ công và gửi link tải ngay cho bạn!'
    + '      </div>'
    + '      <div style="text-align: center; margin: 24px 0;">'
    + '        <a href="https://zalo.me/' + SUPPORT_ZALO + '" target="_blank" style="display: inline-block; background: #0068ff; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,104,255,0.35);">&#128172; LIÊN HỆ ZALO: ' + SUPPORT_ZALO + ' ĐỂ HỖ TRỢ</a>'
    + '      </div>'
    + '      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; text-align: center; line-height: 1.6;">'
    + '        <p style="margin: 0; font-size: 12px; color: #94a3b8;"><a href="' + BLOG_URL + '" style="color: #6366f1; text-decoration: none;">' + BLOG_NAME + ' (tuhocai.top)</a> — Cổng tri thức tự học trí tuệ nhân tạo &amp; workflow thực chiến.</p>'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '</body>'
    + '</html>';

  MailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    name: BLOG_NAME
  });
}

// ============================================================
// 7. TELEGRAM API UTILITIES
// ============================================================
function answerTelegramCallback(callbackQueryId, text, showAlert) {
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/answerCallbackQuery', {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      payload: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: showAlert ? true : false
      }),
      muteHttpExceptions: true
    });
  } catch(e) {}
}

function editTelegramCaption(chatId, messageId, newCaption) {
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/editMessageCaption', {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      payload: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        caption: newCaption,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [] }
      }),
      muteHttpExceptions: true
    });
  } catch(e) {}
}

function editTelegramText(chatId, messageId, newText) {
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/editMessageText', {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      payload: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newText,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [] }
      }),
      muteHttpExceptions: true
    });
  } catch(e) {}
}

function sendTelegramTextMessage(chatId, text) {
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      payload: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }),
      muteHttpExceptions: true
    });
  } catch(e) {}
}

// ============================================================
// 8. FILE & DRIVE HELPERS
// ============================================================
function getOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

function getDriveIdByPid(pid) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(PRODUCTS_SHEET);
    if (!sheet) return null;

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === String(pid).trim().toUpperCase() && data[i][4] !== false) {
        return String(data[i][3]).trim();
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

function logFreeDownload(email, name, pid, productName, downloadLink) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(FREE_SHEET);
    if (!sheet) return;
    sheet.appendRow([new Date(), name, email, pid, productName, downloadLink, 'COMPLETED']);
  } catch (e) {}
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
