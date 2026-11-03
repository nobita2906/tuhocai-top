# scripts/publish_claude_prompts_post.py
import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

title = "7 Câu Lệnh Prompt Claude Giúp “Hồi Sinh” Máy Tính Chậm Chạp Nhanh Chóng & An Toàn"
slug = "7-cau-lenh-prompt-claude-toi-uu-may-tinh-cham"
category = "PROMPT"
tags = "Claude, Prompt AI, Tối ưu máy tính, Claude Desktop, Tự Học AI"
thumbnail = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1280&q=80"
summary = "Khám phá 7 câu lệnh prompt Claude chuyên sâu biến AI thành kỹ thuật viên IT riêng: chẩn đoán nguyên nhân gây lag, dọn dẹp ổ đĩa, chặn app khởi động ngầm và tăng tốc PC/Mac an toàn 100%."

content = """
> **Tác giả:** Nguyễn Văn Đăng - AI Solution Architect tại Tự Học AI (tuhocai.top)  
> **Chủ đề:** Tối ưu hóa hiệu năng hệ thống máy tính bằng Claude AI (Claude Desktop / Claude Code / Coworker Claude)  
> **Thời gian thực hiện:** ~10 - 15 phút | **Cấp độ:** Mọi đối tượng (từ người dùng phổ thông đến chuyên gia)

---

## 1. Bối Cảnh: Khi Chiếc Máy Tính Trở Thành "Rùa Bò" Sau Thời Gian Dài Hoạt Động

Nếu bạn sử dụng máy tính Windows hoặc macOS phục vụ công việc hàng ngày, chắc chắn bạn đã từng trải qua cảm giác bực bội này: chiếc máy tính từng chạy mượt mà ngày nào giờ khởi động mất vài phút, mở trình duyệt Chrome ngốn sạch 80–90% RAM, quạt tản nhiệt kêu vù vù dù bạn chỉ gõ văn bản, và mỗi thao tác click chuột đều có độ trễ gây ức chế.

Phản xạ thông thường của đa số người dùng là gì?
1. Lên Google tìm kiếm và tải về các phần mềm "dọn rác", "tăng tốc PC" trôi nổi — kết quả là máy tính bị cài thêm hàng tá bloatware và adware gián điệp.
2. Sao lưu vội vàng dữ liệu rồi tốn cả buổi mang ra tiệm cài lại hệ điều hành.
3. Chấp nhận bỏ ra vài triệu đồng để nâng cấp thêm thanh RAM hoặc ổ cứng SSD mới dù phần cứng hiện tại vẫn chưa khai thác hết.

Nhưng với sự tiến hóa vượt bậc của **Claude AI** (đặc biệt là phiên bản **Claude Desktop** có tích hợp công cụ Terminal / Computer Use hoặc Claude Code), bạn hoàn toàn không cần phải tốn tiền hay cài đặt phần mềm bên thứ ba rườm rà. Bạn có thể biến Claude thành một **chuyên gia IT Support cao cấp** ngồi ngay bên cạnh, tự động soi chiếu toàn bộ ngóc ngách của hệ thống và giải phóng tài nguyên với **nguyên tắc an toàn tuyệt đối (Safe-Mode Execution)**.

Dưới đây là trọn bộ **7 câu lệnh Prompt Claude độc quyền** được thiết kế có cấu trúc kiểm soát chặt chẽ: AI chỉ được phép quan sát, lập danh sách, cảnh báo và **tuyệt đối không được tự ý xóa bỏ hay tắt dịch vụ** nếu chưa có sự phê duyệt đích danh từ bạn.

---

## 2. Trọn Bộ 7 Câu Lệnh Prompt Claude Tinh Chỉnh Máy Tính Thực Chiến

### Prompt 1: Chẩn Đoán Tức Thì Thủ Phạm Khiến Máy Bị Chậm (Find What's Slowing It Down)

* **Mục tiêu kỹ thuật:** Giám sát liên tục các tiến trình đang chạy trong 60 giây, xếp hạng top 10 tiến trình ngốn CPU, RAM và Disk I/O nhất, đồng thời phát hiện các tiến trình lạ không rõ nguồn gốc.
* **Nguyên tắc an toàn:** *Look only. Close nothing.* (Chỉ quan sát và ghi nhận, cấm can thiệp tắt ứng dụng).

```text
Watch this computer for 60 seconds, then tell me what's slowing it down. Rank the top 10 by processor, memory and disk use, explain each in plain English, and flag anything you can't identify. Look only. Close nothing.
```

> **Bản dịch ý nghĩa câu lệnh:**  
> *"Hãy theo dõi chiếc máy tính này trong vòng 60 giây, sau đó báo cáo cho tôi biết nguyên nhân gì đang làm chậm máy. Hãy xếp hạng top 10 tiến trình ngốn vi xử lý (CPU), bộ nhớ (RAM) và ổ đĩa (Disk) nhiều nhất, giải thích chức năng của từng tiến trình bằng ngôn ngữ bình dân dễ hiểu, và gắn cờ cảnh báo bất kỳ tiến trình nào bạn không xác định được danh tính. Chỉ quan sát. Không được tự ý tắt bất kỳ tiến trình nào."*

---

### Prompt 2: Tạo Bản Sao Lưu An Toàn Trước Khi Đụng Vào Hệ Thống (Back Up Before You Touch Anything)

* **Mục tiêu kỹ thuật:** Rà soát lại phương án bảo vệ dữ liệu. Điểm mấu chốt ở đây là Claude sẽ giúp bạn phân biệt giữa **"Đồng bộ hóa đám mây" (Cloud Sync như OneDrive, iCloud, Google Drive)** và **"Sao lưu dự phòng thực thụ" (True Backup)**. Hãy nhớ: nếu bạn xóa nhầm một file ở máy tính, các dịch vụ Cloud Sync cũng sẽ xóa luôn file đó trên đám mây!
* **Nguyên tắc an toàn:** *Change nothing else.* (Không thay đổi bất kỳ cài đặt nào khác).

```text
Before we touch anything, check whether this computer is backed up, where, and when the last backup ran. Tell me if it's only syncing rather than a real backup. If there's no backup, walk me through setting one up. Change nothing else.
```

> **Bản dịch ý nghĩa câu lệnh:**  
> *"Trước khi chúng ta can thiệp vào bất cứ điều gì, hãy kiểm tra xem máy tính này đã được sao lưu (backup) hay chưa, lưu ở đâu và lần sao lưu gần nhất diễn ra khi nào. Cho tôi biết rõ đây chỉ là dịch vụ đồng bộ hóa đám mây hay là một bản sao lưu độc lập thực thụ. Nếu máy chưa có bản backup nào, hãy hướng dẫn tôi từng bước thiết lập. Không thay đổi bất kỳ thiết lập nào khác."*

---

### Prompt 3: Chặn Đứng Các Ứng Dụng Khởi Động Cùng Máy Tính (Stop What Launches At Startup)

* **Mục tiêu kỹ thuật:** Một trong những nguyên nhân số 1 khiến máy tính khởi động chậm là hàng tá phần mềm (Spotify, Discord, Teams, Adobe Creative Cloud, Skype...) âm thầm đăng ký chạy cùng hệ điều hành. Câu lệnh này yêu cầu Claude liệt kê toàn bộ, đánh số thứ tự và phân loại rõ ràng.
* **Nguyên tắc an toàn:** Gắn nhãn *"Do Not Touch"* cho các dịch vụ cốt lõi của hệ thống. Chỉ vô hiệu hóa khi bạn trả lời số thứ tự cụ thể, đồng thời cung cấp hướng dẫn cách hoàn tác (undo).

```text
List everything that starts with this computer, numbered, with what it does and whether I need it. Mark anything the system needs as do not touch. Change nothing until I reply with numbers, and tell me how to undo each change.
```

> **Bản dịch ý nghĩa câu lệnh:**  
> *"Hãy liệt kê danh sách đánh số thứ tự tất cả những ứng dụng và dịch vụ tự động khởi động cùng máy tính này, giải thích rõ chức năng của chúng và đánh giá xem tôi có thực sự cần thiết hay không. Đánh dấu 'Không được chạm vào' (Do not touch) đối với bất kỳ thành phần nào hệ thống bắt buộc phải có. Không được thay đổi bất cứ điều gì cho đến khi tôi phản hồi bằng số thứ tự, và phải chỉ rõ cho tôi cách hoàn tác lại từng thay đổi nếu cần."*

---

### Prompt 4: Rà Soát Và Thu Hồi Dung Lượng Ổ Đĩa Bị Chiếm Dụng (Find What's Eating Your Storage)

* **Mục tiêu kỹ thuật:** Khi ổ đĩa hệ thống (ổ C trên Windows hoặc phân vùng chính trên macOS) đầy trên 85%, hệ điều hành sẽ mất không gian bộ nhớ ảo (paging file / swap), khiến toàn bộ tác vụ bị nghẽn. Câu lệnh này quét ra 20 tệp/thư mục nặng nhất, file download cũ, file cài đặt (.exe, .msi, .dmg) và file trùng lặp.
* **Nguyên tắc an toàn:** Cảnh báo các file đang nằm trong OneDrive/Dropbox/iCloud; chỉ chuyển file vào Thùng rác (Recycle Bin / Trash), **tuyệt đối không xóa vĩnh viễn (Permanent Delete)**.

```text
Show me the 20 biggest files and folders, plus old downloads, used installers and exact duplicates, with sizes. Flag anything inside OneDrive, iCloud or Dropbox. Delete nothing until I pick by number, then move it to the Recycle Bin or Trash, never permanently.
```

> **Bản dịch ý nghĩa câu lệnh:**  
> *"Hãy hiển thị cho tôi danh sách 20 tệp và thư mục có dung lượng lớn nhất, kèm theo các tệp tải về đã cũ, các bộ cài đặt đã dùng xong và các tệp tin trùng lặp chính xác, hiển thị rõ dung lượng từng mục. Đánh dấu cảnh báo đối với bất kỳ tệp nào đang nằm bên trong thư mục đồng bộ OneDrive, iCloud hoặc Dropbox. Tuyệt đối không xóa thứ gì cho đến khi tôi chọn theo số thứ tự, và khi xóa chỉ được di chuyển vào Thùng rác (Recycle Bin/Trash), không bao giờ được xóa vĩnh viễn."*

---

### Prompt 5: Gỡ Bỏ Tận Gốc Các Ứng Dụng Không Còn Sử Dụng (Remove The Apps You Don't Use)

* **Mục tiêu kỹ thuật:** Liệt kê toàn bộ các phần mềm đã cài đặt kèm dung lượng chiếm dụng, ngày cài đặt và lần mở ứng dụng gần nhất.
* **Nguyên tắc an toàn:** Đánh dấu rõ ràng ứng dụng nào an toàn để gỡ bỏ. Chỉ gỡ bỏ ứng dụng mà người dùng chỉ định thông qua trình gỡ cài đặt chuẩn (Uninstaller chính thức) của hệ thống.

```text
List my installed apps with size and install date, and when each was last used if you can tell. Say so when you can't. Mark which are safe to remove. Remove only the ones I pick, using the normal uninstaller.
```

> **Bản dịch ý nghĩa câu lệnh:**  
> *"Hãy liệt kê danh sách các ứng dụng đã cài đặt trên máy kèm theo dung lượng và ngày cài đặt, đồng thời cho biết thời điểm ứng dụng đó được mở lần cuối (nếu có thể trích xuất thông tin). Hãy nói rõ nếu bạn không xác định được lần dùng cuối. Đánh dấu các ứng dụng nào an toàn để gỡ bỏ. Chỉ gỡ bỏ đúng những ứng dụng tôi đã chọn và bắt buộc sử dụng trình gỡ cài đặt tiêu chuẩn của hệ điều hành."*

---

### Prompt 6: Rà Soát Tiến Trình Đáng Ngờ & Quét Mã Độc Ngầm (Look For Anything Suspicious)

* **Mục tiêu kỹ thuật:** Kích hoạt công cụ bảo mật có sẵn của máy tính (Windows Defender / Quick Scan trên Windows hoặc XProtect / Gatekeeper trên Mac), đồng thời rà soát các tiến trình đang chạy, các tiện ích mở rộng (browser extensions) trên trình duyệt và các kết nối mạng ngầm (background connections) lạ.
* **Nguyên tắc an toàn:** Yêu cầu Claude nêu rõ tên nhà phát hành (Publisher), vị trí lưu file (File path), và phân biệt rạch ròi giữa việc "đã xác nhận là an toàn/độc hại" hay "chỉ là phỏng đoán". Không tự ý xóa bỏ.

```text
Run this computer's built-in security scan if it has one, then review running programs, browser extensions and background connections. For anything suspicious, show its publisher and file location, and say whether that's confirmed or your guess. Remove nothing.
```

> **Bản dịch ý nghĩa câu lệnh:**  
> *"Hãy khởi chạy trình quét bảo mật tích hợp sẵn của máy tính này nếu có, sau đó kiểm tra lại các chương trình đang hoạt động, các tiện ích mở rộng của trình duyệt và các kết nối mạng chạy ngầm. Đối với bất kỳ mục nào đáng ngờ, hãy hiển thị rõ tên nhà phát hành và vị trí lưu tệp, đồng thời ghi rõ đó là dữ liệu đã xác thực hay chỉ là phỏng đoán của bạn. Tuyệt đối không xóa bất cứ thứ gì."*

---

### Prompt 7: Tự Động Hóa Lịch Trình Kiểm Tra Định Kỳ Hàng Tháng (Repeat It Every Month)

* **Mục tiêu kỹ thuật:** Biến quy trình bảo trì thủ công thành một lịch trình tự động (Scheduled Task / Cron Job) chạy vào ngày mùng 1 hàng tháng trên chính chiếc máy tính đó.
* **Nguyên tắc an toàn:** Chỉ xuất báo cáo so sánh những gì đã thay đổi; cấm tự ý xóa hay tắt dịch vụ. Khởi chạy thử nghiệm 1 lần đầu và cấp quyền *"Always allow"* để tác vụ tự động không bị treo chờ xác nhận khi chạy định kỳ.

```text
Set up a monthly scheduled task that runs only on this computer. On the first of each month, repeat the slowdown, storage and security checks and tell me what changed. Report only: never delete, remove or turn off anything.
Run the task once right after you set it up and approve its checks with "always allow". Otherwise a monthly run can stall while it waits for you. It only runs while your computer is awake and the app is open.
```

> **Bản dịch ý nghĩa câu lệnh:**  
> *"Hãy thiết lập một tác vụ tự động hàng tháng chỉ chạy trên chiếc máy tính này. Vào ngày mùng 1 hàng tháng, hãy tự động lặp lại quy trình kiểm tra: chẩn đoán chậm máy, dung lượng ổ đĩa và rà soát bảo mật, sau đó báo cáo cho tôi biết những điểm gì đã thay đổi so với tháng trước. Chỉ lập báo cáo: không bao giờ được tự ý xóa, gỡ bỏ hay tắt bất kỳ thứ gì.  
> Hãy khởi chạy tác vụ này một lần ngay sau khi thiết lập và phê duyệt các bước kiểm tra bằng tùy chọn 'Always allow' (Luôn cho phép). Nếu không, tác vụ định kỳ có thể bị đình trệ khi chờ lệnh từ người dùng. Tác vụ này chỉ kích hoạt khi máy tính đang thức và ứng dụng đang mở."*

---

## 3. Bảng Tổng Hợp So Sánh 7 Prompt & Checklist Bảo Vệ Dữ Liệu

| STT | Tên Prompt | Mục Tiêu Kỹ Thuật | Phạm Vi Can Thiệp | Khuyến Nghị Thực Hiện |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Chẩn đoán nghẽn tài nguyên** | Top 10 tiến trình ăn CPU/RAM/Disk | Chỉ đọc (Read-only) | Mỗi khi máy có dấu hiệu giật lag |
| **02** | **Kiểm tra trạng thái sao lưu** | Phân biệt Cloud Sync vs True Backup | Chỉ đọc & Tư vấn | Luôn làm trước mọi đợt dọn dẹp |
| **03** | **Quản lý ứng dụng khởi động** | Tắt bớt phần mềm chạy cùng Windows/Mac | Cần bạn gõ số xác nhận | 1 lần/tháng hoặc sau khi cài app mới |
| **04** | **Giải phóng dung lượng ổ đĩa** | Quét file nặng, installer, tệp trùng lặp | Chuyển vào Thùng rác | Khi dung lượng ổ đĩa vượt quá 80% |
| **05** | **Gỡ bỏ phần mềm rác** | Thanh lọc các app không dùng trong 6 tháng | Dùng Uninstaller chuẩn | 1 - 2 tháng một lần |
| **06** | **Rà soát bảo mật & kết nối ngầm**| Quét extension lạ, kết nối IP bất thường | Chỉ đọc & Lập báo cáo | Khi lướt web thấy quảng cáo lạ |
| **07** | **Lịch bảo trì tự động định kỳ** | Duy trì máy luôn ở trạng thái tối ưu | Tự động lập lịch | Chạy ngầm ngày mùng 1 mỗi tháng |

### Checklist 5 Quy Tắc An Toàn Sống Còn Khi Để AI Can Thiệp Hệ Thống:
- [x] **Luôn giữ quy tắc "Read-only First":** Bắt buộc AI liệt kê danh sách và giải thích trước, không bao giờ ra lệnh "dọn dẹp máy giúp tôi" chung chung.
- [x] **Xác nhận số thứ tự:** Chỉ gõ số thứ tự các mục bạn muốn tắt/xóa sau khi đã đọc kỹ mô tả.
- [x] **Không xóa vĩnh viễn (No Shift + Delete):** Mọi tệp tin bị loại bỏ đều phải chuyển vào Thùng rác để có thể phục hồi trong trường hợp phát hiện thiếu sót.
- [x] **Cẩn trọng với thư mục Cloud:** Các tệp nằm trong OneDrive/Dropbox/iCloud nếu bị xóa cục bộ có thể làm mất dữ liệu trên đám mây.
- [x] **Tạo điểm khôi phục (System Restore Point):** Trên Windows, bạn nên bật System Restore trước khi tiến hành can thiệp sâu vào các dịch vụ hệ thống.

---

## 4. Những Sai Lầm Thường Gặp & Cách Khắc Phục (Troubleshooting)

Trong quá trình đồng hành cùng học viên và các đối tác triển khai ứng dụng AI, tôi đã ghi nhận 4 lỗi phổ biến nhất mà người dùng thường mắc phải:

1. **Hiểu lầm tai hại giữa "Đồng bộ đám mây" và "Sao lưu thực tế":**
   * *Hiện tượng:* Người dùng thấy máy đầy ổ đĩa liền xóa bớt ảnh/tài liệu trong thư mục OneDrive/iCloud trên máy tính vì nghĩ trên đám mây vẫn còn lưu.
   * *Hậu quả:* Dịch vụ đám mây lập tức đồng bộ lệnh xóa, toàn bộ dữ liệu trên web biến mất hoàn toàn.
   * *Giải pháp:* Trước khi xóa, hãy ngắt liên kết thư mục hoặc chuyển các tệp quan trọng vào một ổ cứng rời (External Hard Drive) không có phần mềm sync tự động.

2. **Tắt nhầm các dịch vụ hệ thống (System Services):**
   * *Hiện tượng:* Thấy các tiến trình như `svchost.exe`, `Runtime Broker`, `mds_stores` (trên Mac) ăn nhiều CPU liền yêu cầu AI tắt bỏ.
   * *Hậu quả:* Hệ điều hành bị mất âm thanh, không kết nối được Wi-Fi hoặc đứng máy (BSOD).
   * *Giải pháp:* Prompt số 3 đã cài sẵn lệnh gắn nhãn *"Do not touch"* cho các tiến trình bắt buộc. Nếu nghi ngờ, hãy hỏi thêm Claude: *"Tiến trình này thuộc hệ điều hành hay phần mềm của bên thứ 3?"*.

3. **Tác vụ định kỳ hàng tháng (Prompt 7) bị treo không chạy:**
   * *Nguyên nhân:* Khi chạy lần đầu, Claude Desktop yêu cầu cấp quyền truy cập hệ thống. Nếu bạn chưa bấm chọn "Always allow" (Luôn cho phép), đến ngày mùng 1 hệ thống sẽ tạm dừng để chờ click chuột của bạn.
   * *Khắc phục:* Mở phần thiết lập quyền (Permissions) trong Claude Desktop, cấp quyền chạy ngầm cho tác vụ kiểm tra hệ thống.

---

## 5. Kết Luận & Lộ Trình Nâng Cấp Kỹ Năng Tự Động Hóa Cùng Tự Học AI

Việc sử dụng Claude để dọn dẹp và tối ưu máy tính chỉ là một lát cắt rất nhỏ trong tiềm năng to lớn của các mô hình AI thế hệ mới. Thay vì coi AI chỉ là một chatbot trả lời câu hỏi, bạn hoàn toàn có thể biến nó thành một **cộng sự số (AI Agent / AI Co-worker)** có khả năng tương tác trực tiếp với máy tính, xử lý luồng công việc phức tạp và tự động hóa hàng trăm giờ thao tác thủ công.

Nếu bạn muốn tiến xa hơn trên hành trình làm chủ công nghệ và tạo ra những dòng thu nhập thực chiến từ AI:

* 🎁 **Tầng 1 (Cộng Đồng Miễn Phí):** Tham gia ngay **Nhóm Zalo VIP Tự Học AI** ([https://zalo.me/g/tuhocai](https://zalo.me/g/tuhocai)) để nhận trọn bộ tài liệu Prompt thương mại và trao đổi trực tiếp cùng đội ngũ chuyên gia.
* ⚡ **Tầng 2 (Sở Hữu Công Cụ & Kỹ Năng Thực Chiến):** Truy cập **Kho Sản Phẩm & Workflow n8n Tự Động Hóa** ([https://www.tuhocai.top/san-pham](https://www.tuhocai.top/san-pham)) để tải về các kịch bản tự động hóa cào tin tức, viết bài đa kênh và vận hành kinh doanh tự động không cần biết code.
* 💰 **Tầng 3 (Gia Tăng Thu Nhập Thụ Động):** Đăng ký tham gia **Chương Trình Đối Tác CTV Tiếp Thị (Affiliate) Tự Học AI** ([https://www.tuhocai.top/affiliate](https://www.tuhocai.top/affiliate)) để nhận mức chiết khấu hoa hồng khủng **60% trọn đời**, rút tiền linh hoạt về VietQR trong 24 giờ.

*Chúc chiếc máy tính của bạn luôn hoạt động với hiệu năng đỉnh cao!*
"""

# Call Webhook to publish post
url = "http://localhost:8899/api/webhook/publish-post"
token = "tuhocai-auto-publish-secret-key-2026"

payload = {
    "title": title,
    "slug": slug,
    "summary": summary,
    "content": content,
    "category": category,
    "tags": tags,
    "thumbnail": thumbnail,
    "isFeatured": True,
    "isPublished": True,
}

data_bytes = json.dumps(payload, ensure_ascii=False).encode('utf-8')
req = urllib.request.Request(
    url,
    data=data_bytes,
    headers={
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Bearer {token}",
    },
    method="POST",
)

try:
    print(f"🚀 Đang gửi bài viết tới Webhook API: {url}...")
    with urllib.request.urlopen(req, timeout=15) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))
        print("✅ Kết quả xuất bản thành công:", res_data)
        print(f"👉 Link bài viết trên localhost: http://localhost:8899/bai-viet/{res_data.get('slug', slug)}")
        print(f"👉 Link bài viết trên production: https://www.tuhocai.top/bai-viet/{res_data.get('slug', slug)}")
except Exception as e:
    print("❌ Lỗi xuất bản bài viết:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
    sys.exit(1)

