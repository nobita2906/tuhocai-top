'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import {
  ShieldCheck,
  Copy,
  Check,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  MessageCircle,
  FileText,
  Clock,
} from 'lucide-react';

interface CheckoutClientProps {
  initialProduct: Product | null;
}

export default function CheckoutClient({ initialProduct }: CheckoutClientProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step state: 1 = Form, 2 = VietQR Payment, 3 = Approved / Done
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Order state
  const [orderId, setOrderId] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [vietQrUrl, setVietQrUrl] = useState('');
  const [bankInfo, setBankInfo] = useState<any>(null);

  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Copy helpers
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Auto-fill if user logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) {
          if (!name) setName(d.user.name || '');
          if (!email) setEmail(d.user.email || '');
        }
      })
      .catch(() => {});
  }, []);

  // Poll status when at Step 2 and receipt sent
  useEffect(() => {
    if (step !== 2 || !orderCode || downloadUrl) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/check-status?orderCode=${orderCode}`);
        const data = await res.json();
        if (data.success && data.status === 'APPROVED') {
          setDownloadUrl(data.downloadUrl || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026');
          setStep(3);
          clearInterval(interval);
        }
      } catch (e) {}
    }, 4000);

    return () => clearInterval(interval);
  }, [step, orderCode, downloadUrl]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra');

      if (data.isFree) {
        setDownloadUrl(data.downloadUrl);
        setStep(3);
        return;
      }

      setOrderId(data.orderId);
      setOrderCode(data.orderCode);
      setVietQrUrl(data.vietQrUrl);
      setBankInfo(data.bankInfo);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Lỗi xử lý đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile || !orderId) return;

    setUploadingReceipt(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('receipt', receiptFile);

      const res = await fetch('/api/orders/upload-receipt', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Có lỗi khi tải lên biên lai');

      setReceiptSent(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi gửi biên lai');
    } finally {
      setUploadingReceipt(false);
    }
  };

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Không tìm thấy sản phẩm</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Vui lòng quay lại danh sách sản phẩm để chọn gói mong muốn.</p>
        <Link href="/san-pham" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm">
          Xem Kho Sản Phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200">
      {/* Checkout Steps Header */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {step === 3 ? 'Hoàn Tất Đơn Hàng' : 'Thanh Toán & Kích Hoạt Tự Động'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Hệ thống thanh toán bảo mật VietQR — Tự động đối soát và kích hoạt trong vòng 1 phút.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-5 bento-card border-2 border-slate-300 dark:border-white/15 p-6 space-y-5 shadow-md">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Thông tin sản phẩm</h3>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.08] space-y-3">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30 uppercase font-mono">
              {product.category}
            </span>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">{product.name}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{product.description}</p>
          </div>

          <div className="space-y-2 border-t-2 border-slate-200 dark:border-white/[0.08] pt-4 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Mã sản phẩm:</span>
              <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">{product.pid}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Giá gốc:</span>
              <span className="line-through font-mono">{new Intl.NumberFormat('vi-VN').format(product.original_price || product.price * 2)} đ</span>
            </div>
            <div className="flex justify-between text-slate-900 dark:text-white font-extrabold text-sm pt-2 border-t-2 border-slate-200 dark:border-white/[0.08]">
              <span>Tổng thanh toán:</span>
              <span className="text-indigo-800 dark:text-indigo-400 text-lg font-mono font-black">
                {product.price === 0 ? '0 đ (Miễn phí)' : `${new Intl.NumberFormat('vi-VN').format(product.price)} đ`}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Kèm link tải Google Drive & hướng dẫn chi tiết</span>
          </div>
        </div>

        {/* Right Column: Checkout Form / VietQR / Success */}
        <div className="lg:col-span-7 bento-card border-2 border-slate-300 dark:border-white/15 p-6 sm:p-8 shadow-md">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border-2 border-red-300 dark:border-red-500/20 text-red-800 dark:text-red-400 text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: CUSTOMER FORM */}
          {step === 1 && (
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">1. Thông tin người nhận tài liệu</h3>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Họ và tên của bạn <span className="text-indigo-700 dark:text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Đăng"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Địa chỉ Email (Nhận mã kích hoạt & link tải) <span className="text-indigo-700 dark:text-indigo-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Số điện thoại / Zalo
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0938..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-extrabold text-sm shadow-xl shadow-indigo-950/30 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang khởi tạo đơn hàng...
                  </>
                ) : (
                  <>
                    Tiếp tục thanh toán ({new Intl.NumberFormat('vi-VN').format(product.price)} đ)
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: VIETQR SCREEN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold">
                  Mã đơn: <strong className="text-slate-900 dark:text-white font-mono">{orderCode}</strong>
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quét mã VietQR để thanh toán</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Mở ứng dụng ngân hàng bất kỳ để quét mã QR bên dưới:
                </p>
              </div>

              {/* QR Image */}
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-slate-300 dark:border-slate-700 max-w-[260px]">
                  {vietQrUrl && (
                    <img
                      src={vietQrUrl}
                      alt="VietQR Code"
                      className="w-full h-auto rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Bank Transfer Details with Copy buttons */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border-2 border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Ngân hàng:</span>
                  <span className="font-bold text-slate-900 dark:text-white">VPBank (Việt Nam Thịnh Vượng)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5 font-mono text-sm font-black text-indigo-800 dark:text-indigo-400">
                    <span>{bankInfo?.accountNo || '0934434101'}</span>
                    <button
                      onClick={() => copyToClipboard(bankInfo?.accountNo || '0934434101', 'acc')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Sao chép"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Chủ tài khoản:</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">{bankInfo?.accountName || 'NGUYEN VAN DANG'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Số tiền:</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400 font-mono">
                    <span>{new Intl.NumberFormat('vi-VN').format(product.price)} đ</span>
                    <button
                      onClick={() => copyToClipboard(String(product.price), 'amt')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Sao chép"
                    >
                      {copiedField === 'amt' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t-2 border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-amber-700 dark:text-yellow-400">
                    <span>{orderCode}</span>
                    <button
                      onClick={() => copyToClipboard(orderCode, 'code')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Sao chép"
                    >
                      {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Upload Section */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                    Đính kèm ảnh chụp biên lai (Giúp duyệt tức thì)
                  </span>
                  {receiptSent && (
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã gửi biên lai
                    </span>
                  )}
                </div>

                {!receiptSent ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-800 file:text-white hover:file:opacity-85 cursor-pointer"
                    />

                    {receiptPreview && (
                      <div className="relative max-w-[140px] rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-600">
                        <img src={receiptPreview} alt="Biên lai" className="w-full h-auto" />
                      </div>
                    )}

                    <button
                      onClick={handleUploadReceipt}
                      disabled={!receiptFile || uploadingReceipt}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:opacity-85 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-emerald-950/25 transition-all active:scale-[0.98]"
                    >
                      {uploadingReceipt ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang gửi biên lai tới Bot...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Xác Nhận Đã Chuyển Khoản & Gửi Biên Lai
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 animate-pulse text-emerald-600" />
                      Hệ thống đang chờ Admin kiểm duyệt qua Telegram...
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Ngay khi Admin bấm DUYỆT, màn hình sẽ tự động hiển thị link tải Google Drive bên dưới!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: ORDER APPROVED / DOWNLOAD READY */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border-2 border-emerald-400 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                  Thanh Toán Thành Công
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Đơn Hàng Đã Được Kích Hoạt!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Cảm ơn bạn <strong className="text-slate-900 dark:text-white">{name}</strong> đã ủng hộ Tự Học AI. Tài nguyên của bạn đã sẵn sàng để truy cập.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Sản phẩm:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Mã đơn:</span>
                  <span className="font-mono text-indigo-800 dark:text-indigo-400 font-bold">{orderCode || 'FREE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Email nhận:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{email}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white font-extrabold text-sm shadow-xl shadow-indigo-950/30 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    Mở Link Tải Trực Tiếp (Google Drive)
                  </a>
                )}

                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-slate-800 hover:opacity-80 text-slate-800 dark:text-slate-200 font-bold text-xs border-2 border-slate-300 dark:border-slate-700 transition-all shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  Xem Trong Kho Tài Liệu Của Tôi
                </Link>

                <a
                  href="https://zalo.me/g/tuhocai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:opacity-85 text-white border-2 border-emerald-500 font-bold text-xs shadow-md shadow-emerald-950/20 transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Vào Nhóm Zalo Nhận Hỗ Trợ Kỹ Thuật
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
