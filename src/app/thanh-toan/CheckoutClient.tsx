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
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Không tìm thấy sản phẩm</h2>
        <p className="text-slate-400 text-sm">Vui lòng quay lại danh sách sản phẩm để chọn gói mong muốn.</p>
        <Link href="/san-pham" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm">
          Xem Kho Sản Phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Checkout Steps Header */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {step === 3 ? 'Hoàn Tất Đơn Hàng' : 'Thanh Toán & Kích Hoạt Tự Động'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Hệ thống thanh toán bảo mật VietQR — Tự động đối soát và kích hoạt trong vòng 1 phút.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Thông tin sản phẩm</h3>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
              {product.category}
            </span>
            <h4 className="font-bold text-white text-base leading-snug">{product.name}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Mã sản phẩm:</span>
              <span className="font-mono text-slate-200">{product.pid}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Giá gốc:</span>
              <span className="line-through">{new Intl.NumberFormat('vi-VN').format(product.original_price || product.price * 2)} đ</span>
            </div>
            <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
              <span>Tổng thanh toán:</span>
              <span className="text-indigo-400 text-lg">
                {product.price === 0 ? '0 đ (Miễn phí)' : `${new Intl.NumberFormat('vi-VN').format(product.price)} đ`}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Kèm link tải Google Drive & hướng dẫn chi tiết</span>
          </div>
        </div>

        {/* Right Column: Checkout Form / VietQR / Success */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: CUSTOMER FORM */}
          {step === 1 && (
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">1. Thông tin người nhận tài liệu</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Họ và tên của bạn <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Đăng"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Địa chỉ Email (Nhận mã kích hoạt & link tải) <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Số điện thoại / Zalo
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0938..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01]"
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
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                  Mã đơn: <strong className="text-white font-mono">{orderCode}</strong>
                </span>
                <h3 className="text-xl font-bold text-white">Quét mã VietQR để thanh toán</h3>
                <p className="text-xs text-slate-400">
                  Mở ứng dụng ngân hàng bất kỳ để quét mã QR bên dưới:
                </p>
              </div>

              {/* QR Image */}
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-700 max-w-[260px]">
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
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-semibold text-white">VPBank (Việt Nam Thịnh Vượng)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-indigo-400">
                    <span>{bankInfo?.accountNo || '0934434101'}</span>
                    <button
                      onClick={() => copyToClipboard(bankInfo?.accountNo || '0934434101', 'acc')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                      title="Sao chép"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-semibold text-white uppercase">{bankInfo?.accountName || 'NGUYEN VAN DANG'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tiền:</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-400">
                    <span>{new Intl.NumberFormat('vi-VN').format(product.price)} đ</span>
                    <button
                      onClick={() => copyToClipboard(String(product.price), 'amt')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                      title="Sao chép"
                    >
                      {copiedField === 'amt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-yellow-400">
                    <span>{orderCode}</span>
                    <button
                      onClick={() => copyToClipboard(orderCode, 'code')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                      title="Sao chép"
                    >
                      {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Upload Section */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    Đính kèm ảnh chụp biên lai (Giúp duyệt tức thì)
                  </span>
                  {receiptSent && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
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
                      className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                    />

                    {receiptPreview && (
                      <div className="relative max-w-[140px] rounded-lg overflow-hidden border border-slate-600">
                        <img src={receiptPreview} alt="Biên lai" className="w-full h-auto" />
                      </div>
                    )}

                    <button
                      onClick={handleUploadReceipt}
                      disabled={!receiptFile || uploadingReceipt}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md transition-all"
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
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 animate-pulse" />
                      Hệ thống đang chờ Admin kiểm duyệt qua Telegram...
                    </p>
                    <p className="text-[11px] text-slate-400">
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
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Thanh Toán Thành Công
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Đơn Hàng Đã Được Kích Hoạt!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Cảm ơn bạn <strong className="text-white">{name}</strong> đã ủng hộ Tự Học AI. Tài nguyên của bạn đã sẵn sàng để truy cập.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sản phẩm:</span>
                  <span className="font-semibold text-white">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã đơn:</span>
                  <span className="font-mono text-indigo-400">{orderCode || 'FREE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email nhận:</span>
                  <span className="text-slate-200">{email}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    Mở Link Tải Trực Tiếp (Google Drive)
                  </a>
                )}

                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Xem Trong Kho Tài Liệu Của Tôi
                </Link>

                <a
                  href="https://zalo.me/g/tuhocai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-semibold text-xs transition-colors"
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
