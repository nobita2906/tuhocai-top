/**
 * ============================================================
 * Google Apps Script: auto-send-download.gs
 * Blog: T\u1EF1 H\u1ECDc AI (tuhocai.top)
 *
 * H\u1EC6 TH\u1ED0NG X\u1EEC L\u00DD \u0110\u01A0N H\u00C0NG & PH\u00CA DUY\u1EC6T T\u1EF0 \u0110\u1ED8NG QUA TELEGRAM BOT
 * ============================================================
 */

// ============================================================
// C\u1EA4U H\u00CCNH H\u1EC6 TH\u1ED0NG
// ============================================================
const SPREADSHEET_ID = '1a52NAJUvK8E4VR0BUd9x2-2pEcGP1ibM_8cYfXvM5_8';
const PRODUCTS_SHEET = 'Products';
const ORDERS_SHEET = 'Orders';
const FREE_SHEET = 'Free Downloads';
const CONFIG_SHEET = 'Config';

const BLOG_NAME = 'T\u1EF1 H\u1ECDc AI';
const BLOG_URL = 'https://www.tuhocai.top';
const SUPPORT_ZALO = '0938494303';
const BANK_INFO = 'VPBank - 0934434101 - NGUYEN VAN DANG';

const TELEGRAM_BOT_TOKEN = '8884382661:AAH-CBsXMtrwBvQzR2Ko-hCnNjTVMqNBK_E';
const TELEGRAM_CHAT_ID = '6580812076';

// ============================================================
// 1. SETUP PROGRAMMATIC: C\u1EA4U TR\u00DAC SHEET & WEBHOOK
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
    var freeHeaders = ['Th\u1EDDi gian', 'H\u1ECD t\u00EAn', 'Email', 'M\u00E3 SP (PID)', 'T\u00EAn s\u1EA3n ph\u1EA9m', 'Link t\u1EA3i', 'Tr\u1EA1ng th\u00E1i'];
    freeSheet.getRange(1, 1, 1, freeHeaders.length).setValues([freeHeaders]).setFontWeight('bold').setBackground('#dcfce7');
  }

  // C. Setup Tab 'Orders' (Bao g\u1ED3m c\u1ED9t l\u01B0u \u1EA3nh bi\u00EAn lai v\u00E0 tr\u1EA1ng th\u00E1i duy\u1EC7t)
  var ordSheet = ss.getSheetByName(ORDERS_SHEET) || ss.insertSheet(ORDERS_SHEET);
  if (ordSheet.getLastRow() === 0) {
    var ordHeaders = ['Th\u1EDDi gian', 'M\u00E3 \u0111\u01A1n (OrderID)', 'Email', 'H\u1ECD t\u00EAn', 'M\u00E3 SP (PID)', 'T\u00EAn s\u1EA3n ph\u1EA9m', 'Gi\u00E1 (VN\u0110)', 'Link \u1EA2nh Bi\u00EAn Lai', 'Tr\u1EA1ng th\u00E1i', 'Th\u1EDDi gian x\u1EED l\u00FD'];
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

// H\u00E0m k\u00EDch ho\u1EA1t c\u1EA5p quy\u1EC1n Google Drive (B\u1EA5m Ch\u1EA1y h\u00E0m n\u00E0y 1 l\u1EA7n trong Apps Script Editor \u0111\u1EC3 c\u1EA5p quy\u1EC1n)
function authorizeDriveAccess() {
  var folder = getOrCreateFolder('BienLai_TuHocAI');
  Logger.log('\u0110\u00E3 c\u1EA5p quy\u1EC1n Google Drive th\u00E0nh c\u00F4ng! Th\u01B0 m\u1EE5c bi\u00EAn lai ID: ' + folder.getId());
}

// H\u00E0m \u0111\u0103ng k\u00FD Telegram Webhook t\u1EF1 \u0111\u1ED9ng
function setTelegramWebhook() {
  // Thay th\u1EBF URL d\u01B0\u1EDBi \u0111\u00E2y b\u1EB1ng URL Web App sau khi Deploy
  var webAppUrl = ScriptApp.getService().getUrl();
  if (!webAppUrl) {
    Logger.log('Ch\u01B0a c\u00F3 Web App URL! H\u00E3y Deploy New Deployment tr\u01B0\u1EDBc.');
    return;
  }
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
    return jsonResponse({ ok: true, message: 'T\u1EF1 H\u1ECDc AI API & Telegram Bot is running!', timestamp: new Date() });
  }

  if (action === 'free') {
    return handleFreeDownload(p);
  }

  return jsonResponse({ ok: false, error: 'Action kh\u00F4ng h\u1EE3p l\u1EC7' });
}

function doPost(e) {
  try {
    var contents = e && e.postData && e.postData.contents ? e.postData.contents : '';

    // A. Ki\u1EC3m tra n\u1EBFu request \u0111\u1EBFn t\u1EEB Telegram Webhook (Callback query ho\u1EB7c Message)
    if (contents) {
      try {
        var tgUpdate = JSON.parse(contents);
        if (tgUpdate && (tgUpdate.callback_query || tgUpdate.message)) {
          return handleTelegramWebhook(tgUpdate);
        }
      } catch (errJson) {
        // Kh\u00F4ng ph\u1EA3i JSON Telegram, chuy\u1EC3n xu\u1ED1ng x\u1EED l\u00FD form th\u00F4ng th\u01B0\u1EDDng
      }
    }

    // B. X\u1EED l\u00FD request t\u1EEB Checkout page (Form submit / JSON)
    var p = {};
    if (contents) {
      try { p = JSON.parse(contents); } catch(err) { p = e.parameter || {}; }
    } else {
      p = e && e.parameter ? e.parameter : {};
    }

    var action = p.action || '';

    // 1. T\u1EA3i mi\u1EC5n ph\u00ED 0\u0111
    if (action === 'free') {
      return handleFreeDownload(p);
    }

    // 2. G\u1EEDi bi\u00EAn lai \u0111\u01A1n h\u00E0ng tr\u1EA3 ph\u00ED (k\u00E8m \u1EA3nh base64)
    if (action === 'paid_order_upload') {
      return handlePaidOrderUpload(p);
    }

    return jsonResponse({ ok: false, error: 'Action POST kh\u00F4ng h\u1EE3p l\u1EC7' });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ============================================================
// 3. X\u1EEC L\u00DD T\u1EA2I MI\u1EC4N PH\u00CD (0\u0111)
// ============================================================
function handleFreeDownload(p) {
  var email       = String(p.email || '').trim();
  var name        = String(p.name || '').trim();
  var pid         = String(p.pid || '').trim();
  var productName = decodeURIComponent(String(p.productName || p.name || pid));
  var drive       = String(p.drive || '').trim();

  if (!email || !email.includes('@')) {
    return jsonResponse({ ok: false, error: 'Email kh\u00F4ng h\u1EE3p l\u1EC7' });
  }
  if (!pid) {
    return jsonResponse({ ok: false, error: 'Thi\u1EBFu m\u00E3 s\u1EA3n ph\u1EA9m' });
  }

  var driveId = drive || getDriveIdByPid(pid) || '1SAMPLE_DRIVE_ID';
  var downloadLink = 'https://drive.google.com/file/d/' + driveId + '/view?usp=sharing';

  // G\u1EEDi email t\u1EF1 \u0111\u1ED9ng
  sendDownloadEmail(email, name, productName, pid, downloadLink, 0);

  // Ghi log v\u00E0o Sheet
  logFreeDownload(email, name, pid, productName, downloadLink);

  return jsonResponse({
    ok: true,
    message: '\u0110\u00E3 g\u1EEDi link t\u1EA3i th\u00E0nh c\u00F4ng v\u00E0o email ' + email + '!',
    email: email,
    productName: productName
  });
}

// ============================================================
// 4. X\u1EEC L\u00DD \u0110\u01A0N H\u00C0NG TR\u1EA2 PH\u00CD (L\u01AFU \u1EA2NH & B\u00C1O TELEGRAM BOT DUY\u1EC6T)
// ============================================================
function handlePaidOrderUpload(p) {
  var email       = String(p.email || '').trim();
  var name        = String(p.name || 'Kh\u00E1ch v\u00E3ng lai').trim();
  var pid         = String(p.pid || 'THAI-PROD').trim();
  var productName = decodeURIComponent(String(p.productName || p.name || pid));
  var price       = parseInt(String(p.price || '0').replace(/\D/g, ''), 10) || 99000;
  var imageBase64 = String(p.imageBase64 || '').trim();
  var mimeType    = String(p.mimeType || 'image/jpeg');

  if (!email || !email.includes('@')) {
    return jsonResponse({ ok: false, error: 'Email kh\u00F4ng h\u1EE3p l\u1EC7' });
  }

  // T\u1EA1o m\u00E3 \u0111\u01A1n h\u00E0ng duy nh\u1EA5t
  var orderId = 'THAI-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyMMdd-HHmmss');

  // X\u1EED l\u00FD \u1EA3nh bi\u00EAn lai
  var receiptUrl = 'Kh\u00F4ng t\u1EA3i \u1EA3nh';
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
      Logger.log('L\u1ED7i decode \u1EA3nh base64: ' + errDecode.message);
    }

    try {
      if (imageBlob) {
        // L\u01B0u v\u00E0o Google Drive th\u01B0 m\u1EE5c "BienLai_TuHocAI"
        var folder = getOrCreateFolder('BienLai_TuHocAI');
        var driveFile = folder.createFile(imageBlob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        receiptUrl = driveFile.getUrl();
      }
    } catch(errImg) {
      receiptUrl = 'Ch\u01B0a l\u01B0u Drive: ' + errImg.message;
      Logger.log('L\u1ED7i l\u01B0u Drive: ' + errImg.message);
    }
  }

  // Ghi \u0111\u01A1n v\u00E0o Google Sheets (Status = 'PENDING')
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

  // G\u1EEDi th\u00F4ng b\u00E1o \u0111\u1EBFn Telegram Bot k\u00E8m 2 n\u00FAt b\u1EA5m Inline Keyboard
  sendTelegramOrderNotification(orderId, productName, pid, price, name, email, imageBlob, receiptUrl);

  return jsonResponse({
    ok: true,
    orderId: orderId,
    message: '\u0110\u00E3 g\u1EEDi bi\u00EAn lai chuy\u1EC3n kho\u1EA3n th\u00E0nh c\u00F4ng! M\u00E3 \u0111\u01A1n: #' + orderId
  });
}

// G\u1EEDi th\u00F4ng b\u00E1o \u0111\u01A1n h\u00E0ng k\u00E8m \u1EA3nh qua Telegram API
function sendTelegramOrderNotification(orderId, productName, pid, price, name, email, imageBlob, receiptUrl) {
  try {
    var caption = "\uD83D\uDD14 <b>\u0110\u01A0N H\u00C0NG M\u1EDAI C\u1EA6N DUY\u1EC6T!</b>\n"
                + "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n"
                + "\uD83D\uDCE6 <b>S\u1EA3n ph\u1EA9m:</b> " + productName + "\n"
                + "\uD83C\uDFF7\uFE0F <b>M\u00E3 SP:</b> <code>" + pid + "</code>\n"
                + "\uD83D\uDCB0 <b>S\u1ED1 ti\u1EC1n:</b> <b>" + Number(price).toLocaleString('vi-VN') + " \u0111</b>\n"
                + "\uD83C\uDD94 <b>M\u00E3 \u0111\u01A1n:</b> <code>#" + orderId + "</code>\n"
                + "\uD83D\uDC64 <b>Kh\u00E1ch h\u00E0ng:</b> " + name + "\n"
                + "\uD83D\uDCE7 <b>Email:</b> " + email + "\n"
                + "\u23F0 <b>Th\u1EDDi gian:</b> " + Utilities.formatDate(new Date(), 'GMT+7', 'HH:mm - dd/MM/yyyy') + "\n"
                + (receiptUrl && receiptUrl.startsWith('http') ? ("\uD83D\uDD17 <a href='" + receiptUrl + "'>Xem \u1EA3nh g\u1ED1c Drive</a>\n") : "")
                + "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n"
                + "\uD83D\uDC49 B\u1EA5m [\u2705 DUY\u1EC6T] \u0111\u1EC3 t\u1EF1 \u0111\u1ED9ng g\u1EEDi link t\u1EA3i qua Email.\n"
                + "\uD83D\uDC49 B\u1EA5m [\u274C T\u1EEA CH\u1ED0I] \u0111\u1EC3 g\u1EEDi email b\u00E1o l\u1ED7i cho kh\u00E1ch.";

    var inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "\u2705 DUY\u1EC6T (G\u1EEDi Link)", callback_data: "appr:" + orderId },
          { text: "\u274C T\u1EEA CH\u1ED0I (B\u00E1o L\u1ED7i)", callback_data: "rejc:" + orderId }
        ]
      ]
    };

    if (imageBlob) {
      // G\u1EEDi b\u1EB1ng sendPhoto (multipart)
      var payload = {
        chat_id: TELEGRAM_CHAT_ID,
        caption: caption,
        parse_mode: 'HTML',
        photo: imageBlob,
        reply_markup: JSON.stringify(inlineKeyboard)
      };
      var res = UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendPhoto', {
        method: 'post',
        payload: payload,
        muteHttpExceptions: true
      });
      var resCode = res.getResponseCode();
      Logger.log('Telegram sendPhoto response: ' + resCode + ' - ' + res.getContentText());

      // N\u1EBFu Telegram sendPhoto kh\u00F4ng th\u00E0nh c\u00F4ng (vd \u1EA3nh kh\u00F4ng h\u1EE3p l\u1EC7), fallback g\u1EEDi text
      if (resCode !== 200) {
        var payloadFallback = {
          chat_id: TELEGRAM_CHAT_ID,
          text: caption,
          parse_mode: 'HTML',
          reply_markup: JSON.stringify(inlineKeyboard)
        };
        UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(payloadFallback),
          muteHttpExceptions: true
        });
      }
    } else {
      // G\u1EEDi b\u1EB1ng sendMessage n\u1EBFu kh\u00F4ng c\u00F3 \u1EA3nh
      var payloadMsg = {
        chat_id: TELEGRAM_CHAT_ID,
        text: caption,
        parse_mode: 'HTML',
        reply_markup: JSON.stringify(inlineKeyboard)
      };
      UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payloadMsg),
        muteHttpExceptions: true
      });
    }
  } catch(e) {
    Logger.log('L\u1ED7i g\u1EEDi Telegram: ' + e.message);
  }
}

// ============================================================
// 5. X\u1EEC L\u00DD WEBHOOK T\u1EEA TELEGRAM (ADMIN B\u1EA4M N\u00DAT HO\u1EB6C G\u00D5 L\u1EC6NH)
// ============================================================
function handleTelegramWebhook(tgUpdate) {
  // 1. Tr\u01B0\u1EDDng h\u1EE3p Admin b\u1EA5m n\u00FAt Inline Keyboard
  if (tgUpdate.callback_query) {
    var cb = tgUpdate.callback_query;
    var data = String(cb.data || '');
    var chatId = cb.message ? cb.message.chat.id : TELEGRAM_CHAT_ID;
    var messageId = cb.message ? cb.message.message_id : null;
    var hasPhoto = Boolean(cb.message && cb.message.photo);

    // Tr\u1EA3 l\u1EDDi Telegram ngay \u0111\u1EC3 \u1EA9n loading spinner
    answerTelegramCallback(cb.id, "\u0110ang x\u1EED l\u00FD \u0111\u01A1n h\u00E0ng...");

    var parts = data.split(':');
    var action = parts[0];
    var orderId = parts[1];

    if (action === 'appr') {
      processOrderApproval(orderId, chatId, messageId, hasPhoto);
    } else if (action === 'rejc') {
      processOrderRejection(orderId, chatId, messageId, hasPhoto);
    }
    return jsonResponse({ ok: true, action: action, orderId: orderId });
  }

  // 2. Tr\u01B0\u1EDDng h\u1EE3p Admin g\u00F5 tin nh\u1EAFn (yes / no #THAI-xxx)
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
      return jsonResponse({ ok: true, cmd: cmd, orderId: orderIdTxt });
    }
  }

  return jsonResponse({ ok: true, ignored: true });
}

// X\u1EED l\u00FD Duy\u1EC7t \u0110\u01A1n (Yes) -> G\u1EEDi Link qua Email + C\u1EADp nh\u1EADt Telegram
function processOrderApproval(orderId, chatId, messageId, hasPhoto) {
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
    sendTelegramTextMessage(chatId, "\u26A0\uFE0F <b>Kh\u00F4ng t\u00ECm th\u1EA5y \u0111\u01A1n h\u00E0ng #" + orderId + " trong h\u1EC7 th\u1ED1ng!</b>");
    return;
  }

  var currentStatus = String(orderRow[8] || '').trim();
  if (currentStatus === 'APPROVED') {
    sendTelegramTextMessage(chatId, "\u2139\uFE0F <b>\u0110\u01A1n h\u00E0ng #" + orderId + " \u0110\u00C3 \u0110\u01AF\u1EE2C DUY\u1EC6T tr\u01B0\u1EDBc \u0111\u00F3!</b>");
    return;
  }

  var email       = orderRow[2];
  var name        = orderRow[3];
  var pid         = orderRow[4];
  var productName = orderRow[5];
  var price       = orderRow[6];

  // L\u1EA5y link Drive
  var driveId = getDriveIdByPid(pid) || '1SAMPLE_DRIVE_ID';
  var downloadLink = 'https://drive.google.com/file/d/' + driveId + '/view?usp=sharing';

  // 1. G\u1EEDi Email k\u00E8m Link t\u1EA3i cho kh\u00E1ch
  sendDownloadEmail(email, name, productName, pid, downloadLink, price);

  // 2. C\u1EADp nh\u1EADt Google Sheet (Status = 'APPROVED')
  ordSheet.getRange(rowIndex, 9).setValue('APPROVED');
  ordSheet.getRange(rowIndex, 10).setValue(new Date());

  // 3. S\u1EEDa caption/tin nh\u1EAFn Telegram th\u00E0nh \u0110\u00C3 DUY\u1EC6T (b\u1ECF n\u00FAt b\u1EA5m)
  var doneTime = Utilities.formatDate(new Date(), 'GMT+7', 'HH:mm - dd/MM/yyyy');
  var updatedText = "\u2705 <b>\u0110\u00C3 DUY\u1EC6T \u0110\u01A0N H\u00C0NG #" + orderId + "!</b>\n"
                  + "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n"
                  + "\uD83D\uDCE6 <b>S\u1EA3n ph\u1EA9m:</b> " + productName + "\n"
                  + "\uD83D\uDC64 <b>Kh\u00E1ch h\u00E0ng:</b> " + name + " (<code>" + email + "</code>)\n"
                  + "\uD83D\uDCB0 <b>S\u1ED1 ti\u1EC1n:</b> " + Number(price).toLocaleString('vi-VN') + " \u0111\n"
                  + "\uD83C\uDF89 <b>K\u1EBFt qu\u1EA3:</b> \u0110\u00E3 g\u1EEDi link Google Drive cho kh\u00E1ch qua email l\u00FAc <b>" + doneTime + "</b>.";

  if (messageId && hasPhoto) {
    editTelegramCaption(chatId, messageId, updatedText);
  } else if (messageId) {
    editTelegramText(chatId, messageId, updatedText);
  } else {
    sendTelegramTextMessage(chatId, updatedText);
  }
}

// X\u1EED l\u00FD T\u1EEB Ch\u1ED1i (No) -> G\u1EEDi Email b\u00E1o l\u1ED7i thanh to\u00E1n + C\u1EADp nh\u1EADt Telegram
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
    sendTelegramTextMessage(chatId, "\u26A0\uFE0F <b>Kh\u00F4ng t\u00ECm th\u1EA5y \u0111\u01A1n h\u00E0ng #" + orderId + " trong h\u1EC7 th\u1ED1ng!</b>");
    return;
  }

  var email       = orderRow[2];
  var name        = orderRow[3];
  var productName = orderRow[5];

  // 1. G\u1EEDi Email th\u00F4ng b\u00E1o l\u1ED7i thanh to\u00E1n cho kh\u00E1ch
  sendPaymentRejectionEmail(email, name, productName, orderId);

  // 2. C\u1EADp nh\u1EADt Google Sheet (Status = 'REJECTED')
  ordSheet.getRange(rowIndex, 9).setValue('REJECTED');
  ordSheet.getRange(rowIndex, 10).setValue(new Date());

  // 3. S\u1EEDa caption/tin nh\u1EAFn Telegram th\u00E0nh \u0110\u00C3 T\u1EEA CH\u1ED0I
  var rejectTime = Utilities.formatDate(new Date(), 'GMT+7', 'HH:mm - dd/MM/yyyy');
  var updatedText = "\u274C <b>\u0110\u00C3 T\u1EEA CH\u1ED0I \u0110\u01A0N H\u00C0NG #" + orderId + "</b>\n"
                  + "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n"
                  + "\uD83D\uDCE6 <b>S\u1EA3n ph\u1EA9m:</b> " + productName + "\n"
                  + "\uD83D\uDC64 <b>Kh\u00E1ch h\u00E0ng:</b> " + name + " (<code>" + email + "</code>)\n"
                  + "\u26A0\uFE0F <b>K\u1EBFt qu\u1EA3:</b> \u0110\u00E3 g\u1EEDi email th\u00F4ng b\u00E1o th\u00F4ng tin thanh to\u00E1n ch\u01B0a \u0111\u00FAng ho\u1EB7c ch\u01B0a nh\u1EADn \u0111\u01B0\u1EE3c ti\u1EC1n l\u00FAc <b>" + rejectTime + "</b>.\n"
                  + "\uD83D\uDC49 Kh\u00E1ch c\u00F3 th\u1EC3 li\u00EAn h\u1EC7 Zalo <b>" + SUPPORT_ZALO + "</b> \u0111\u1EC3 \u0111\u1ED1i so\u00E1t.";

  if (messageId && hasPhoto) {
    editTelegramCaption(chatId, messageId, updatedText);
  } else if (messageId) {
    editTelegramText(chatId, messageId, updatedText);
  } else {
    sendTelegramTextMessage(chatId, updatedText);
  }
}

// ============================================================
// 6. G\u1EECI EMAIL: LINK T\u1EA2I TH\u00C0NH C\u00D4NG & TH\u00D4NG B\u00C1O T\u1EEA CH\u1ED0I
// ============================================================
function sendDownloadEmail(email, customerName, productName, pid, downloadLink, price) {
  var subject = '\uD83C\uDF89 [T\u1EF1 H\u1ECDc AI] Link T\u1EA3i T\u00E0i Nguy\u00EAn: ' + productName;
  var priceText = price === 0 ? 'MI\u1EC4N PH\u00CD (0\u0111)' : (Number(price).toLocaleString('vi-VN') + ' \u0111');

  var htmlBody = '<!DOCTYPE html>'
    + '<html>'
    + '<head><meta charset="utf-8"/></head>'
    + '<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">'
    + '  <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">'
    + '    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">'
    + '      <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">C\u1EA3m \u01A1n b\u1EA1n \u0111\u00E3 tin t\u01B0\u1EDFng ' + BLOG_NAME + '!</h1>'
    + '      <p style="margin: 0; font-size: 14px; opacity: 0.95; color: #e0e7ff;">T\u00E0i li\u1EC7u AI &amp; Workflow c\u1EE7a b\u1EA1n \u0111\u00E3 s\u1EB5n s\u00E0ng \u0111\u1EC3 t\u1EA3i xu\u1ED1ng</p>'
    + '    </div>'
    + '    <div style="padding: 28px 24px;">'
    + '      <p style="color: #334155; font-size: 15px; margin: 0 0 16px;">Xin ch\u00E0o <strong>' + (customerName || 'b\u1EA1n') + '</strong>,</p>'
    + '      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">D\u01B0\u1EDBi \u0111\u00E2y l\u00E0 link truy c\u1EADp file Google Drive c\u1EE7a t\u00E0i nguy\u00EAn b\u1EA1n \u0111\u00E3 \u0111\u1EB7t mua:</p>'
    + '      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">'
    + '        <div style="font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">&#128230; S\u1EA2N PH\u1EA8M / T\u00C0I LI\u1EC6U</div>'
    + '        <div style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 12px; line-height: 1.4;">' + productName + '</div>'
    + '        <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; font-size: 13.5px; color: #64748b; line-height: 1.8;">'
    + '          <div>&#127991;&#65039; M\u00E3 s\u1EA3n ph\u1EA9m: <strong style="color:#0f172a;">' + pid + '</strong></div>'
    + '          <div>&#128176; S\u1ED1 ti\u1EC1n: <strong style="color:#16a34a;">' + priceText + '</strong></div>'
    + '        </div>'
    + '      </div>'
    + '      <div style="text-align: center; margin: 28px 0;">'
    + '        <a href="' + downloadLink + '" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 800; padding: 15px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(34,197,94,0.35);">&#11015;&#65039; B\u1EA4M V\u00C0O \u0110\u00C2Y \u0110\u1EC2 T\u1EA2I XU\u1ED0NG</a>'
    + '      </div>'
    + '      <p style="color: #64748b; font-size: 12.5px; line-height: 1.6; text-align: center; margin: 0 0 24px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 10px 14px;">'
    + '        &#128161; <em>L\u01B0u \u00FD: B\u1EA1n n\u00EAn l\u01B0u b\u1EA3n sao v\u1EC1 Google Drive ho\u1EB7c t\u1EA3i v\u1EC1 m\u00E1y t\u00EDnh \u0111\u1EC3 s\u1EED d\u1EE5ng l\u00E2u d\u00E0i.</em>'
    + '      </p>'
    + '      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; text-align: center; line-height: 1.6;">'
    + '        <p style="margin: 0 0 6px;">C\u1EA7n h\u1ED7 tr\u1EE3 k\u1EF9 thu\u1EADt ho\u1EB7c t\u01B0 v\u1EA5n? Li\u00EAn h\u1EC7 tr\u1EF1c ti\u1EBFp qua Zalo:</p>'
    + '        <p style="margin: 0 0 10px;"><a href="https://zalo.me/' + SUPPORT_ZALO + '" style="color: #6366f1; font-weight: 700; text-decoration: none;">&#128172; Zalo H\u1ED7 Tr\u1EE3: ' + SUPPORT_ZALO + '</a></p>'
    + '        <p style="margin: 0; font-size: 12px; color: #94a3b8;"><a href="' + BLOG_URL + '" style="color: #6366f1; text-decoration: none;">' + BLOG_NAME + ' (tuhocai.top)</a> \u2014 C\u1ED5ng tri th\u1EE9c t\u1EF1 h\u1ECDc tr\u00ED tu\u1EC7 nh\u00E2n t\u1EA1o &amp; workflow th\u1EF1c chi\u1EBFn.</p>'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '</body>'
    + '</html>';

  GmailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    name: BLOG_NAME
  });
}

function sendPaymentRejectionEmail(email, customerName, productName, orderId) {
  var subject = '\u26A0\uFE0F [T\u1EF1 H\u1ECDc AI] Th\u00F4ng b\u00E1o v\u1EC1 giao d\u1ECBch \u0111\u01A1n h\u00E0ng #' + orderId;

  var htmlBody = '<!DOCTYPE html>'
    + '<html>'
    + '<head><meta charset="utf-8"/></head>'
    + '<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">'
    + '  <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #fee2e2;">'
    + '    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 32px 24px; text-align: center;">'
    + '      <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 800; color: #ffffff;">Th\u00F4ng B\u00E1o Ki\u1EC3m Tra Giao D\u1ECBch</h1>'
    + '      <p style="margin: 0; font-size: 14px; opacity: 0.95; color: #fee2e2;">\u0110\u01A1n h\u00E0ng #' + orderId + ' \u2014 ' + productName + '</p>'
    + '    </div>'
    + '    <div style="padding: 28px 24px;">'
    + '      <p style="color: #334155; font-size: 15px; margin: 0 0 16px;">Xin ch\u00E0o <strong>' + (customerName || 'b\u1EA1n') + '</strong>,</p>'
    + '      <p style="color: #475569; font-size: 14.5px; line-height: 1.7; margin: 0 0 20px;">'
    + '        Ch\u00FAng t\u00F4i \u0111\u00E3 ki\u1EC3m tra th\u00F4ng tin bi\u00EAn lai v\u00E0 \u0111\u1ED1i so\u00E1t v\u1EDBi t\u00E0i kho\u1EA3n ng\u00E2n h\u00E0ng, nh\u01B0ng hi\u1EC7n t\u1EA1i <strong>th\u00F4ng tin thanh to\u00E1n ch\u01B0a ch\u00EDnh x\u00E1c ho\u1EB7c h\u1EC7 th\u1ED1ng ch\u01B0a nh\u1EADn \u0111\u01B0\u1EE3c s\u1ED1 ti\u1EC1n chuy\u1EC3n kho\u1EA3n t\u01B0\u01A1ng \u1EE9ng</strong> cho \u0111\u01A1n h\u00E0ng n\u00E0y.'
    + '      </p>'
    + '      <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; color: #9f1239; font-size: 14px; line-height: 1.6;">'
    + '        <strong>\uD83D\uDC49 H\u01B0\u1EDBng x\u1EED l\u00FD:</strong><br/>'
    + '        N\u1EBFu b\u1EA1n \u0111\u00E3 chuy\u1EC3n kho\u1EA3n th\u00E0nh c\u00F4ng t\u1EEB t\u00E0i kho\u1EA3n ng\u00E2n h\u00E0ng c\u1EE7a b\u1EA1n, vui l\u00F2ng li\u00EAn h\u1EC7 tr\u1EF1c ti\u1EBFp qua Zalo \u0111\u1EC3 nh\u00E2n vi\u00EAn ki\u1EC3m tra \u0111\u1ED1i so\u00E1t th\u1EE7 c\u00F4ng v\u00E0 g\u1EEDi link t\u1EA3i ngay cho b\u1EA1n!'
    + '      </div>'
    + '      <div style="text-align: center; margin: 24px 0;">'
    + '        <a href="https://zalo.me/' + SUPPORT_ZALO + '" target="_blank" style="display: inline-block; background: #0068ff; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,104,255,0.35);">&#128172; LI\u00CAN H\u1EC6 ZALO: ' + SUPPORT_ZALO + ' \u0110\u1EC2 H\u1ED6 TR\u1EE2</a>'
    + '      </div>'
    + '      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; text-align: center; line-height: 1.6;">'
    + '        <p style="margin: 0; font-size: 12px; color: #94a3b8;"><a href="' + BLOG_URL + '" style="color: #6366f1; text-decoration: none;">' + BLOG_NAME + ' (tuhocai.top)</a> \u2014 C\u1ED5ng tri th\u1EE9c t\u1EF1 h\u1ECDc tr\u00ED tu\u1EC7 nh\u00E2n t\u1EA1o &amp; workflow th\u1EF1c chi\u1EBFn.</p>'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '</body>'
    + '</html>';

  GmailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    name: BLOG_NAME
  });
}

// ============================================================
// 7. TELEGRAM API UTILITIES
// ============================================================
function answerTelegramCallback(callbackQueryId, text) {
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/answerCallbackQuery', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ callback_query_id: callbackQueryId, text: text }),
      muteHttpExceptions: true
    });
  } catch(e) {}
}

function editTelegramCaption(chatId, messageId, newCaption) {
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/editMessageCaption', {
      method: 'post',
      contentType: 'application/json',
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
      contentType: 'application/json',
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
      contentType: 'application/json',
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
