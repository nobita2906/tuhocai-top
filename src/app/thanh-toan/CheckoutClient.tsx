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
  Send,
  Zap,
  KeyRound,
  X,
} from 'lucide-react';

interface CheckoutClientProps {
  initialProduct: Product | null;
}

export default function CheckoutClient({ initialProduct }: CheckoutClientProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recognizedCustomer, setRecognizedCustomer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailBlur = async () => {
    if (isLoggedIn || !email || !email.includes('@')) return;
    try {
      const res = await fetch(`/api/checkout/lookup-customer?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      const data = await res.json();
      if (data.exists) {
        if (!name && data.name) setName(data.name);
        if (!phone && data.phone) setPhone(data.phone);
        setRecognizedCustomer(true);
      }
    } catch (_) {}
  };

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

  // 60-second timer & manual review state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [manualReviewSent, setManualReviewSent] = useState(false);
  const [manualReviewLoading, setManualReviewLoading] = useState(false);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Copy helpers
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Auto-fill if user logged in or from URL query
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const qEmail = sp.get('email');
      const qPhone = sp.get('phone');
      const qName = sp.get('name');
      if (qEmail) setEmail(qEmail);
      if (qPhone) setPhone(qPhone);
      if (qName) setName(qName);
    }

    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) {
          setIsLoggedIn(true);
          if (!name) setName(d.user.name || '');
          if (!email) setEmail(d.user.email || '');
          if (d.user.phone) setPhone(d.user.phone);
        }
      })
      .catch(() => {});
  }, []);

  // Timer for 60s threshold when at Step 2
  useEffect(() => {
    if (step !== 2) {
      setSecondsElapsed(0);
      return;
    }
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Poll status when at Step 2 and automatically redirect to Thank You page upon approval
  useEffect(() => {
    if (step !== 2 || !orderCode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/check-status?orderCode=${orderCode}`);
        const data = await res.json();
        if (data.success && data.status === 'APPROVED') {
          clearInterval(interval);
          setDownloadUrl(data.downloadUrl || '/dashboard');
          setStep(3);
          // Tự động mở modal hỏi đổi mật khẩu nếu là khách mới
          if (!isLoggedIn) {
            setShowPasswordModal(true);
          }
        }
      } catch (e) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [step, orderCode, product, bankInfo, isLoggedIn]);

  const handleNavigateToCourse = () => {
    // Nếu là khách mới vừa được tạo pass theo SĐT -> hỏi đổi pass
    if (!isLoggedIn) {
      setShowPasswordModal(true);
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPassword: phone, // SĐT là mật khẩu mặc định ban đầu
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đổi mật khẩu không thành công');

      setPasswordSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'Lỗi xử lý');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRequestManualReview = async () => {
    if (!orderCode || manualReviewLoading) return;
    setManualReviewLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders/request-manual-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi gửi yêu cầu duyệt');
      setManualReviewSent(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi gửi yêu cầu');
    } finally {
      setManualReviewLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\s+/g, '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Email không đúng định dạng. Vui lòng nhập email hợp lệ (VD: name@gmail.com)');
      return;
    }

    if (!isLoggedIn) {
      const phoneRegex = /^0[0-9]{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        setError('Số điện thoại phải bao gồm đúng 10 chữ số (bắt đầu bằng 0, ví dụ: 0912345678)');
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: name,
          customerEmail: cleanEmail,
          customerPhone: cleanPhone || undefined,
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (recognizedCustomer) setRecognizedCustomer(false);
                  }}
                  onBlur={handleEmailBlur}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 shadow-xs"
                />
                {recognizedCustomer && (
                  <p className="mt-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Chào mừng bạn quay lại! Đã tự động nhận diện thông tin của bạn.</span>
                  </p>
                )}
              </div>

              {isLoggedIn ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tài khoản nhận: <strong>{email}</strong></span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/60 dark:bg-emerald-500/30 px-2 py-0.5 rounded">
                    ĐÃ ĐĂNG NHẬP
                  </span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
                      Số điện thoại (Đúng 10 số) <span className="text-indigo-700 dark:text-indigo-400">*</span>
                    </label>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Mật khẩu Kho Của Tôi</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    pattern="0[0-9]{9}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-700 shadow-xs"
                  />
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    *SĐT này sẽ là mật khẩu mặc định để bạn tra cứu và tải tài nguyên trong mục &quot;Kho Của Tôi&quot;.
                  </p>
                </div>
              )}

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
                  <span className="font-bold text-slate-900 dark:text-white">{bankInfo?.bankName || 'ACB (Ngân hàng TMCP Á Châu)'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5 font-mono text-sm font-black text-indigo-800 dark:text-indigo-400">
                    <span>{bankInfo?.accountNo || '4747827'}</span>
                    <button
                      onClick={() => copyToClipboard(bankInfo?.accountNo || '4747827', 'acc')}
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
                    <span>{bankInfo?.content || orderCode}</span>
                    <button
                      onClick={() => copyToClipboard(bankInfo?.content || orderCode, 'code')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Sao chép"
                    >
                      {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 60-Second Conditional Manual Review via Telegram */}
              {secondsElapsed >= 60 ? (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-500/30 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-xs">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>Nếu bạn chưa nhận được khóa học, hãy bấm vào:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Hệ thống sẽ gửi mã đơn <strong>{orderCode}</strong> trực tiếp đến bot Telegram cá nhân của quản trị viên để bấm duyệt kích hoạt tức thì cho bạn!
                  </p>

                  {!manualReviewSent ? (
                    <button
                      type="button"
                      onClick={handleRequestManualReview}
                      disabled={manualReviewLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg shadow-amber-900/20 transition-all active:scale-[0.98]"
                    >
                      {manualReviewLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang gửi mã đơn tới Telegram...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          ⚡ Gửi Mã Đơn Yêu Cầu Duyệt Nhanh Qua Telegram
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 border-2 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Đã gửi mã đơn tới Telegram Admin! Khi Admin bấm duyệt, màn hình này sẽ tự động chuyển trang tải khóa học ngay.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Hệ thống đang tự động kiểm tra giao dịch ngân hàng ({60 - secondsElapsed}s)...</span>
                </div>
              )}

              {/* Receipt Upload Section */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                    Đính kèm ảnh chụp biên lai (Tùy chọn)
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
                      Ngay khi Admin bấm DUYỆT, màn hình sẽ tự động kích hoạt đơn hàng và mở khóa khóa học trong tài khoản của bạn!
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
                <button
                  type="button"
                  onClick={handleNavigateToCourse}
                  className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-90 text-white font-extrabold text-sm shadow-xl shadow-indigo-950/30 transition-all active:scale-[0.98]"
                >
                  <FileText className="w-5 h-5" />
                  🚀 Vào Khu Vực Học Tập / Khóa Học Của Tôi
                </button>

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

      {/* POPUP HỎI ĐỔI MẬT KHẨU SAU KHI MUA HÀNG THÀNH CÔNG */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111116] border-2 border-indigo-400 dark:border-indigo-500/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-300 dark:border-indigo-500/30">
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Bảo Mật Tài Khoản Khách Hàng
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tài khoản của bạn đã được kích hoạt thành công với <strong>mật khẩu mặc định là Số điện thoại</strong> bạn vừa đăng ký. Bạn có muốn đổi mật khẩu mới để bảo mật hơn không?
              </p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-300 text-red-700 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Đổi mật khẩu thành công! Đang chuyển bạn vào khu vực học tập...</span>
              </div>
            )}

            {!showChangePasswordForm ? (
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordForm(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs shadow-md shadow-indigo-900/25 transition-all active:scale-[0.98]"
                >
                  🔐 Đổi Mật Khẩu Mới Ngay
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    window.location.href = '/dashboard';
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
                >
                  🚀 Để Sau, Vào Học Ngay
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu mới (tối thiểu 6 ký tự)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Xác nhận lại mật khẩu mới
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordForm(false)}
                    className="w-1/3 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading || passwordSuccess}
                    className="w-2/3 py-2.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Lưu Mật Khẩu
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
