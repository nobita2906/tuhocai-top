import pymysql
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_CONFIG = {
    'host': '103.127.195.56',
    'user': 'postgress_user',
    'password': 'Nvdang@1',
    'port': 3306,
    'database': 'tuhocai_top',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# 1. BÀI 3: Claude 3.7 Sonnet Hybrid Reasoning
POST_3_CONTENT = """Tôi là Nguyễn Văn Đăng - AI Solution Architect tại Tự Học AI (tuhocai.top).

Anthropic vừa chính thức ra mắt **Claude 3.7 Sonnet**, đánh dấu kỷ nguyên của mô hình AI Hybrid đầu tiên trên thế giới kết hợp cả hai chế độ: phản hồi tức thì (Standard mode) và suy luận mở rộng (Extended Thinking mode) trong cùng một kiến trúc duy nhất.

Thay vì người dùng phải phân vân giữa một mô hình suy luận sâu nhưng tốc độ chậm (như OpenAI o1/o3-mini) và một mô hình phản hồi nhanh nhưng thiếu logic nhiều bước, Claude 3.7 Sonnet cho phép lập trình viên kiểm soát trực tiếp số lượng Token dành cho quá trình tư duy (Thinking Budget).

---

## 1. Phân Tích Bản Chất Kỹ Thuật Của Cơ Chế Hybrid Reasoning

Kiến trúc Hybrid của Claude 3.7 Sonnet giải quyết bài toán lớn nhất của các kỹ sư phần mềm khi tích hợp AI:
* **Kiểm soát độ trễ (Latency Control):** Đối với các tác vụ đơn giản như format code hay dịch thuật, mô hình phản hồi ngay lập tức với chi phí thấp.
* **Suy luận chuỗi tư duy động (Dynamic Chain-of-Thought):** Đối với các bài toán refactor toàn bộ hệ thống monorepo hoặc tìm kiếm race-condition trong kiến trúc microservice, mô hình kích hoạt hàng nghìn token suy luận ngầm trước khi xuất ra dòng code đầu tiên.
* **Tích hợp sâu với Tool Use (Function Calling):** Không giống như các mô hình suy luận đời đầu bị cô lập trong hộp cát, Claude 3.7 có thể vừa suy luận vừa gọi các công cụ ngoại vi (MCP - Model Context Protocol) theo thời gian thực.

---

## 2. Bảng So Sánh Kỹ Thuật: Claude 3.7 Sonnet vs OpenAI o3-mini vs DeepSeek R1

Dưới đây là bảng đánh giá khách quan dựa trên thử nghiệm thực tế tại Tự Học AI cho các tác vụ lập trình và tự động hóa:

| Tiêu chí kỹ thuật | Claude 3.7 Sonnet (Anthropic) | OpenAI o3-mini (OpenAI) | DeepSeek R1 (DeepSeek) |
| :--- | :--- | :--- | :--- |
| **Cơ chế suy luận** | Hybrid (Bật/Tắt & Điều chỉnh Budget Token) | Bắt buộc suy luận (Low/Medium/High) | Bắt buộc suy luận qua thẻ `<think>` |
| **SWE-bench Verified** | **70.3%** (Dẫn đầu thế giới về Code) | 49.3% | 49.2% |
| **Khả năng gọi Tool (MCP)** | Cực kỳ xuất sắc, tương thích 100% MCP | Tốt | Còn hạn chế khi gọi Function phức tạp |
| **Độ trễ phản hồi** | Tùy biến (Từ 500ms đến 60s) | Thường trễ từ 5s - 25s | Thường trễ từ 8s - 35s |
| **Chi phí Input / Output** | $3.00 / $15.00 per 1M tokens | $1.10 / $4.40 per 1M tokens | **$0.55 / $2.19 per 1M tokens** |
| **Ứng dụng tối ưu nhất** | Fullstack Coding, System Architecture, Agentic Workflow | Toán học, Thuật toán thi đấu, Logic thuần | Tự host On-premise, Tác vụ tiết kiệm chi phí |

---

## 3. Khối Code Mẫu: Tích Hợp Claude 3.7 Sonnet Với Thinking Budget

Dưới đây là mã nguồn Python chuẩn sử dụng SDK chính thức của Anthropic để gọi Claude 3.7 Sonnet với tính năng suy luận mở rộng:

```python
import anthropic

client = anthropic.Anthropic(api_key="your-anthropic-api-key")

# Cấu hình gọi Claude 3.7 Sonnet ở chế độ Extended Thinking
response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=4096,
    thinking={
        "type": "enabled",
        "budget_tokens": 2048  # Cấp ngân sách tối đa 2048 token cho việc suy luận
    },
    system="Bạn là AI Solution Architect cao cấp. Hãy phân tích cấu trúc mã nguồn và tìm các lỗ hổng bảo mật tiềm ẩn.",
    messages=[
        {
            "role": "user",
            "content": "Hãy phân tích đoạn mã xử lý JWT Token sau và tối ưu cơ chế Refresh Token chống Replay Attack..."
        }
    ]
)

# In chuỗi suy luận ngầm (Thinking Process)
for block in response.content:
    if block.type == "thinking":
        print("=== QUÁ TRÌNH SUY LUẬN NGẦM (THINKING): ===")
        print(block.thinking)
    elif block.type == "text":
        print("=== KẾT QUẢ CUỐI CÙNG: ===")
        print(block.text)
```

---

## 4. Lỗi Thường Gặp & Cách Khắc Phục (Troubleshooting)

### Lỗi 1: `invalid_request_error: budget_tokens must be less than max_tokens`
* **Nguyên nhân:** Khi bật `thinking`, thông số `budget_tokens` phải luôn nhỏ hơn `max_tokens` (để dành chỗ cho nội dung phản hồi cuối cùng).
* **Cách khắc phục:** Đặt `max_tokens = budget_tokens + 2000` (ví dụ: budget 2048 thì max_tokens phải từ 4096 trở lên).

### Lỗi 2: Request Timeout khi giải quyết tác vụ phức tạp
* **Nguyên nhân:** Quá trình suy luận nhiều bước có thể kéo dài trên 30 giây khiến các HTTP client mặc định ngắt kết nối.
* **Cách khắc phục:** Thiết lập HTTP client timeout tối thiểu 120s hoặc sử dụng cơ chế Streaming (`client.messages.stream(...)`) để nhận token liên tục.

### Lỗi 3: Chi phí token tăng vọt ngoài dự tính
* **Nguyên nhân:** Để `budget_tokens` quá cao cho các prompt đơn giản.
* **Cách khắc phục:** Thiết lập bộ phân loại prompt (Prompt Router): Nếu tác vụ là CRUD cơ bản thì tắt thinking (`type: disabled`), chỉ kích hoạt khi tác vụ liên quan đến kiến trúc hoặc gỡ lỗi logic đa luồng.

---

## 5. Tải Tài Liệu Kỹ Thuật & Phễu Chuyển Đổi

Để hỗ trợ cộng đồng làm chủ công nghệ mới nhất từ Anthropic:

* **Tải Trọn Bộ Code Mẫu & Benchmark Claude 3.7 (Drive 0đ):** [Truy cập kho tài nguyên Google Drive Tự Học AI](https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing)
* **Gia nhập cộng đồng trao đổi kỹ thuật:** Tham gia ngay [Cộng đồng Zalo Tự Học AI](https://zalo.me/g/tuhocai) để thảo luận trực tiếp cùng các kỹ sư và chuyên gia AI.
* **Đăng ký lộ trình thực chiến:** Xem thông tin [Khóa học Làm chủ Agentic AI & n8n Automation](https://www.tuhocai.top/lp/n8n-tu-dong-hoa-kiem-tien) để tự xây dựng AI Agent cho doanh nghiệp.
* **Hợp tác Affiliate:** [Kiếm tiền Affiliate cùng Tự Học AI](https://www.tuhocai.top/affiliate) nhận hoa hồng lên tới 40%.
"""

# 2. BÀI 4: n8n Auto Đăng Bài Đa Kênh Tự Host
POST_4_CONTENT = """Tôi là Nguyễn Văn Đăng - AI Solution Architect tại Tự Học AI (tuhocai.top).

Tự động hóa đăng bài đa kênh (Facebook, Telegram, WordPress, Blogger) là bài toán sống còn của bất kỳ cá nhân hay doanh nghiệp nào muốn xây dựng thương hiệu số. Tuy nhiên, nếu sử dụng các nền tảng trả phí theo lượt chạy như Zapier hay Make.com, chi phí vận hành có thể lên tới hàng trăm USD mỗi tháng khi quy mô bài viết tăng lên.

Giải pháp tối ưu và bền vững nhất chính là **tự host n8n (Self-hosted n8n)** trên một máy chủ ảo (VPS) chỉ từ $4 - $5/tháng, cho phép bạn kích hoạt hàng triệu lần chạy tự động hóa hoàn toàn không giới hạn.

---

## 1. Bản Vẽ Kiến Trúc Hệ Thống Tự Động Hóa Đa Kênh

Mô hình vận hành của hệ thống bao gồm 4 khối module độc lập:
1. **Trigger Module:** Nhận tín hiệu từ Webhook nội bộ, RSS Feed hoặc lên lịch theo giờ (Cron Schedule).
2. **AI Processing Engine:** Kết nối API Gemini 2.5 Flash hoặc OpenAI để phân tích, viết lại bài chuẩn SEO E-E-A-T và bóc tách định dạng phù hợp từng nền tảng.
3. **Media Generation:** Tự động gọi API hình ảnh (Flux.1 qua Pollinations hoặc Cloudinary) để tạo thumbnail 16:9 sắc nét.
4. **Distribution Channels:** Bắn nội dung đồng thời tới:
   - **Telegram Channel:** Dạng thông báo vắn tắt kèm nút xem nhanh.
   - **Facebook Fanpage:** Định dạng status kèm ảnh tương tác cao.
   - **WordPress / Next.js / Blogger:** Đầy đủ định dạng bài viết chuẩn SEO có thẻ H1-H3, code block và internal link.

---

## 2. Bảng So Sánh Chi Phí & Hiệu Năng Vận Hành Hàng Tháng

| Tiêu chí so sánh | Tự Host n8n trên VPS | Nền tảng Make.com (Integromat) | Nền tảng Zapier Pro |
| :--- | :--- | :--- | :--- |
| **Chi phí cố định** | **~100.000đ - 120.000đ/tháng** (VPS 2GB RAM) | $29/tháng (10.000 ops) | $49 - $99/tháng (2.000 tasks) |
| **Giới hạn số tác vụ** | **KHÔNG GIỚI HẠN (Unlimited)** | Bị tính phí phụ trội nếu vượt | Bị ngắt quy trình nếu hết task |
| **Bảo mật dữ liệu** | Dữ liệu lưu 100% trên VPS riêng | Lưu trên đám mây của bên thứ ba | Lưu trên đám mây của bên thứ ba |
| **Khả năng cài thư viện ngoài** | Tùy biến tự do (Python, ffmpeg, npm) | Giới hạn theo môi trường đóng | Rất hạn chế |
| **Độ ổn định** | 99.9% (Tự kiểm soát tài nguyên) | Phụ thuộc vào server nhà cung cấp | Phụ thuộc vào server nhà cung cấp |

---

## 3. Khối Code Mẫu: Docker Compose Cài Đặt n8n Hoàn Chỉnh

Dưới đây là file `docker-compose.yml` chuẩn sản xuất (Production-ready) kèm cơ sở dữ liệu PostgreSQL giúp n8n hoạt động mượt mà, tự khởi động lại khi server reboot:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      - POSTGRES_USER=n8n_user
      - POSTGRES_PASSWORD=SecurePassword2026!
      - POSTGRES_DB=n8n_database
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - n8n_net

  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n_database
      - DB_POSTGRESDB_USER=n8n_user
      - DB_POSTGRESDB_PASSWORD=SecurePassword2026!
      - N8N_ENCRYPTION_KEY=your-custom-secret-key-32chars
      - WEBHOOK_URL=https://n8n.yourdomain.com/
      - GENERIC_TIMEZONE=Asia/Ho_Chi_Minh
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - n8n_net
    depends_on:
      - postgres

networks:
  n8n_net:

volumes:
  postgres_data:
  n8n_data:
```

---

## 4. Lỗi Thường Gặp & Cách Khắc Phục (Troubleshooting)

### Lỗi 1: `Execution failed: Request failed with status code 429 (Rate Limit)`
* **Nguyên nhân:** Bắn dữ liệu liên tiếp tới Facebook Graph API hoặc Telegram Bot mà không có khoảng nghỉ (delay).
* **Cách khắc phục:** Chèn thêm node **Wait** (hoặc node `Sleep`) đặt thời gian trễ từ 3 - 5 giây giữa các lượt gửi đa kênh.

### Lỗi 2: Tràn bộ nhớ RAM trên VPS nhỏ (Out of Memory - OOM)
* **Nguyên nhân:** n8n lưu trữ toàn bộ lịch sử chạy (execution history) trong bộ nhớ đệm và database khiến dung lượng phình to.
* **Cách khắc phục:** Cấu hình biến môi trường tự động dọn rác trong Docker:
  ```env
  EXECUTIONS_DATA_PRUNE=true
  EXECUTIONS_DATA_MAX_AGE=168
  EXECUTIONS_DATA_PRUNE_MAX_COUNT=50000
  ```

### Lỗi 3: Webhook không nhận được dữ liệu từ dịch vụ bên ngoài
* **Nguyên nhân:** Chưa cấu hình đúng biến `WEBHOOK_URL` kèm chứng chỉ SSL (HTTPS) hợp lệ.
* **Cách khắc phục:** Sử dụng Reverse Proxy (Nginx Proxy Manager hoặc Caddy) để cấp chứng chỉ SSL Let's Encrypt miễn phí và trỏ về port `5678`.

---

## 5. Tải Toàn Bộ Workflow JSON & Tài Liệu n8n Thực Chiến

Chúng tôi đã đóng gói toàn bộ luồng tự động hóa này thành file JSON hoàn chỉnh để bạn chỉ cần import vào n8n là có thể chạy ngay:

* **Tải Trọn Gói File Workflow n8n Auto Đăng Bài Đa Kênh (Drive 0đ):** [Truy cập kho Google Drive Tự Học AI](https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing)
* **Nhận trợ giúp kỹ thuật trực tiếp:** Gia nhập [Cộng đồng Zalo Tự Học AI](https://zalo.me/g/tuhocai) để được giải đáp thắc mắc cài đặt 24/7.
* **Nâng cấp kỹ năng chuyên nghiệp:** Đăng ký [Khóa Học n8n Tự Động Hóa Thực Chiến](https://www.tuhocai.top/lp/n8n-tu-dong-hoa-kiem-tien).
* **Kiếm thu nhập thụ động:** [Tham gia Chương Trình Affiliate Tự Học AI](https://www.tuhocai.top/affiliate).
"""

# 3. BÀI 5: Top 10 Kỹ Năng Agentic AI 2026
POST_5_CONTENT = """Tôi là Nguyễn Văn Đăng - AI Solution Architect tại Tự Học AI (tuhocai.top).

Năm 2026 đánh dấu bước chuyển dịch mang tính bước ngoặt từ thời kỳ **Chatbot hỏi-đáp thụ động** sang thời đại của **Agentic AI (AI Tự Hành)**. Một kỹ sư hay nhà sáng tạo nội dung không còn được định giá qua việc biết viết prompt đơn giản, mà nằm ở năng lực kiến trúc, điều phối và kiểm soát các hệ thống đa tác tử (Multi-Agent Systems) hoàn thành mục tiêu phức tạp một cách độc lập.

Dưới đây là 10 kỹ năng cốt lõi bắt buộc phải sở hữu để duy trì lợi thế cạnh tranh vượt trội trong kỷ nguyên AI tự hành.

---

## 1. Danh Sách 10 Kỹ Năng Agentic AI Trọng Yếu Năm 2026

1. **Context Window Optimization & Token Budgeting:** Nắm vững cấu trúc cửa sổ ngữ cảnh, nén thông tin và cấp phát ngân sách token suy luận (Thinking Budget) chuẩn xác.
2. **Multi-Agent Orchestration (Điều phối đa tác tử):** Khả năng thiết lập mô hình chỉ huy dạng Hierarchical (Quản lý - Thực thi) như Thùy Linh - Yến Nhi - Hân Hân - Ngọc Thúy.
3. **MCP (Model Context Protocol) & Tool Integration:** Kết nối AI với các hệ thống tệp tin, cơ sở dữ liệu và API bên ngoài thông qua chuẩn giao thức của Anthropic.
4. **Anti-AI Slop & Automated Fact-Checking:** Xây dựng các điểm chặn (Checkpoints) tự động để loại bỏ thông tin rác, kiểm tra trùng lặp và ngăn chặn ảo giác (hallucination).
5. **Local AI Deployment & Hybrid Inference:** Kỹ năng tự chạy các mô hình nguồn mở như DeepSeek R1, Llama 3 qua Ollama / vLLM để xử lý dữ liệu nội bộ bảo mật.
6. **Agentic Coding Pair Programming:** Sử dụng các công cụ lập trình AI thế hệ mới (Cursor AI, Claude Code, Windsurf) với file rules chuẩn mực để nhân 5 tốc độ phát triển.
7. **Event-Driven Workflow Automation:** Tự động hóa dựa trên sự kiện thông qua n8n, LangGraph và Webhook phản hồi thời gian thực.
8. **Vector DB & Hybrid RAG (Retrieval-Augmented Generation):** Xây dựng kho tri thức doanh nghiệp kết hợp tìm kiếm ngữ nghĩa (Semantic Search) và tìm kiếm từ khóa chính xác.
9. **Reverse-Engineering Web & Clean Extraction:** Kỹ năng bóc tách, làm sạch dữ liệu từ web và chuyển hóa thành cấu trúc Markdown chuẩn hóa.
10. **AI Ethics, Security & Guardrails:** Thiết lập hàng rào bảo vệ an toàn cho Agent, chống Prompt Injection và bảo vệ dữ liệu nhạy cảm của tổ chức.

---

## 2. Bảng Lộ Trình 30 Ngày Làm Chủ Kỹ Năng Agentic AI Cho Người Mới Bắt Đầu

| Giai đoạn | Mục tiêu kỹ năng | Đầu ra thực hành (Deliverables) |
| :--- | :--- | :--- |
| **Tuần 1: Nền tảng Context & Prompt** | Hiểu sâu về Token, System Prompt, Zero-shot & Few-shot | Bộ thư viện 50+ Prompt có cấu trúc cho công việc |
| **Tuần 2: Tự Động Hóa Quy Trình** | Cài đặt n8n, kết nối Webhook, tích hợp API LLM | Workflow tự động tổng hợp tin tức và gửi qua Telegram |
| **Tuần 3: Lập Trình Với AI Coding** | Sử dụng Cursor AI, cấu hình file `.cursorrules` chuyên sâu | Xây dựng hoàn chỉnh một ứng dụng Web tĩnh hoặc REST API |
| **Tuần 4: Kiến Trúc Multi-Agent** | Phối hợp nhiều Agent chuyên biệt (Research -> Fact-Check -> Write) | Hệ thống tự động nghiên cứu và xuất bản bài viết chuẩn SEO |

---

## 3. Khối Prompt Chuẩn: Mẫu Định Tuyến Nhiệm Vụ Cho AI Agent (Agent Router)

Dưới đây là System Prompt chuẩn hóa để định hình tư duy logic cho một AI Agent cấp quản lý:

```markdown
# AGENT ROLE: MASTER ORCHESTRATOR & TASK ROUTER

Bạn là Giám Đốc Kỹ Thuật (CTO) điều phối các tác tử AI chuyên trách.
Mục tiêu: Tiếp nhận yêu cầu người dùng, phân tích mức độ phức tạp và chia nhỏ nhiệm vụ cho các Subagent.

## NGUYÊN TẮC HOẠT ĐỘNG:
1. KHÔNG tự ý đưa ra kết luận nếu thiếu dữ kiện kiểm chứng.
2. Mọi nhiệm vụ phức tạp bắt buộc phải chia thành 3 bước:
   - Bước 1: Khai phá & Trích xuất dữ liệu gốc (Research Phase).
   - Bước 2: Thẩm định logic & Chống sai lệch (Verification Phase).
   - Bước 3: Tổng hợp đầu ra có cấu trúc (Execution Phase).
3. ĐẦU RA BẮT BUỘC ĐỊNH DẠNG:
   - Mục tiêu cốt lõi: [1 câu ngắn gọn]
   - Subagent phụ trách: [Tên Agent]
   - Tiêu chí nghiệm thu (Acceptance Criteria): [Checklist cụ thể]
```

---

## 4. Lỗi Thường Gặp & Cách Khắc Phục (Troubleshooting)

### Lỗi 1: Giao toàn quyền cho AI mà không có cơ chế Human-in-the-Loop
* **Nguyên nhân:** Quá tin tưởng vào AI dẫn tới việc phát sinh các hành động sai lầm ngoài tầm kiểm soát (tự xóa dữ liệu, gửi email nhầm).
* **Cách khắc phục:** Luôn cài đặt bước xác nhận (Approval Gate) trước các hành động quan trọng như thanh toán, xóa cơ sở dữ liệu hoặc deploy code lên môi trường production.

### Lỗi 2: Trôi ngữ cảnh (Context Drift) khi Agent chạy vòng lặp dài
* **Nguyên nhân:** Lịch sử hội thoại quá dài làm đầy context window khiến AI quên các chỉ thị ban đầu trong System Prompt.
* **Cách khắc phục:** Áp dụng kỹ thuật Context Summarization: định kỳ tóm tắt trạng thái công việc và chỉ truyền bản tóm tắt tinh gọn sang bước tiếp theo.

---

## 5. Tải Ebook & Tài Liệu Kỹ Năng AI 2026

* **Tải Ebook Cẩm Nang AI Thực Chiến 2026 (PDF Miễn Phí):** [Truy cập kho Google Drive Tự Học AI](https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing)
* **Gia nhập cộng đồng Tự Học AI:** Tham gia ngay [Cộng đồng Zalo Tự Học AI](https://zalo.me/g/tuhocai) để học tập và cập nhật kiến thức mỗi ngày.
* **Đăng ký lộ trình đào tạo:** [Khóa học Làm chủ AI & n8n Tự Động Hóa](https://www.tuhocai.top/lp/n8n-tu-dong-hoa-kiem-tien).
* **Kiếm thu nhập cùng chúng tôi:** [Chương trình Affiliate Tự Học AI](https://www.tuhocai.top/affiliate).
"""

# 4. BÀI 6: 50+ Prompt Cho Cursor AI & GitHub Copilot
POST_6_CONTENT = """Tôi là Nguyễn Văn Đăng - AI Solution Architect tại Tự Học AI (tuhocai.top).

Một trong những sai lầm phổ biến nhất của các lập trình viên khi sử dụng Cursor AI hoặc GitHub Copilot là đối xử với chúng như một công cụ tìm kiếm Google. Kết quả nhận về thường là những đoạn code chung chung, không tương thích với codebase dự án, thậm chí tạo ra các lỗi bảo mật nghiêm trọng.

Sự khác biệt giữa một lập trình viên bình thường và một kỹ sư sử dụng AI hiệu quả gấp 5 lần nằm ở **Cấu trúc ngữ cảnh dự án** và file cấu hình quy tắc cốt lõi (`.cursorrules`).

Dưới đây là bộ sưu tập các mẫu Prompt thực chiến và file quy tắc đã được tinh chỉnh, giúp bạn lập trình nhanh hơn, sạch hơn và hoàn toàn làm chủ mã nguồn.

---

## 1. Cấu Trúc Khung Prompt Chuẩn 4 Thành Phần Cho AI Coding

Mọi câu lệnh tối ưu cho Cursor AI cần tuân thủ cấu trúc **C-T-C-O**:
* **Context (Bối cảnh):** Khai báo phiên bản framework, kiến trúc hiện tại và vị trí file đang làm việc.
* **Task (Nhiệm vụ):** Mục tiêu kỹ thuật cụ thể (Viết logic, refactor, thêm test).
* **Constraints (Ràng buộc):** Cấm dùng `any`, giữ nguyên comment cũ, áp dụng TypeScript strict, tuân thủ Clean Architecture.
* **Output Format (Đầu ra mong muốn):** Yêu cầu trả về đoạn diff hoặc khối code hoàn chỉnh có giải thích logic.

---

## 2. Bảng Phân Loại 5 Nhóm Prompt Thực Chiến Hàng Ngày

| Nhóm tác vụ | Mục đích sử dụng | Hiệu quả đo lường được |
| :--- | :--- | :--- |
| **Nhóm 1: Refactoring & Clean Code** | Tách nhỏ hàm phức tạp, loại bỏ code trùng lặp, tối ưu SOLID | Giảm 40% độ phức tạp mã nguồn (Cyclomatic Complexity) |
| **Nhóm 2: Root-Cause Debugging** | Tìm nguyên nhân gốc rễ thay vì sửa tạm bợ phần ngọn | Giảm thời gian gỡ lỗi từ hàng giờ xuống dưới 5 phút |
| **Nhóm 3: Automated Unit Testing** | Viết test coverage cho các hàm nghiệp vụ trọng yếu | Đạt độ phủ kiểm thử (Test Coverage) >85% tự động |
| **Nhóm 4: Type Safety & API Contracts** | Định nghĩa Zod schema, interface TypeScript chặt chẽ | Loại bỏ hoàn toàn lỗi runtime type error |
| **Nhóm 5: UI Performance & Tailwind** | Tối ưu render React 19, chống giật layout, hỗ trợ Dark Mode | Đạt điểm Google Lighthouse Performance 95+ |

---

## 3. Khối Code Mẫu: File Cấu Hình `.cursorrules` Chuẩn Mực Cho Dự Án

Hãy copy toàn bộ nội dung dưới đây và lưu vào file `.cursorrules` tại thư mục gốc dự án của bạn:

```markdown
# SYSTEM RULES FOR CURSOR AI & COPILOT

## 1. KỸ THUẬT CỐT LÕI (CORE TECH STACK):
- Framework: Next.js 16 (App Router), React 19, TypeScript strict mode.
- Styling: Tailwind CSS v4, Lucide React icons, shadcn/ui.
- Database: MySQL / PostgreSQL với connection pool tối ưu.

## 2. NGUYÊN TẮC LẬP TRÌNH (CODE CONSTRAINTS):
- TUYỆT ĐỐI KHÔNG dùng kiểu dữ liệu `any`. Luôn định nghĩa interface hoặc type tường minh.
- Giữ nguyên các chú thích (comments) và logic quan trọng sẵn có khi chỉnh sửa.
- Viết code theo nguyên tắc DRY (Don't Repeat Yourself) và Single Responsibility.
- Xử lý triệt để các trường hợp ngoại lệ (Edge Cases) với khối try/catch và logging chi tiết.

## 3. ĐỊNH DẠNG ĐẦU RA (OUTPUT FORMAT):
- Đi thẳng vào giải pháp, không giải thích dài dòng vô ích.
- Cung cấp khối code hoàn chỉnh hoặc khối diff rõ ràng.
- Ghi chú các tác động phụ tiềm ẩn (nếu có) tới các module liên quan.
```

### Các Mẫu Prompt Thực Hành Tiêu Biểu Trong Cursor:

**Prompt 1: Gỡ lỗi logic phức tạp**
```text
Hãy phân tích file [tên_file] hiện tại. Tìm nguyên nhân gây ra memory leak hoặc re-render vô tận trong useEffect này. Đề xuất giải pháp sửa chữa và cung cấp mã nguồn sau khi tối ưu.
```

**Prompt 2: Viết Unit Test toàn diện**
```text
Hãy viết bộ kiểm thử Unit Test bằng Jest/Vitest cho hàm xử lý thanh toán dưới đây. Yêu cầu bao phủ tối thiểu 5 kịch bản: dữ liệu chuẩn, token hết hạn, số dư không đủ, timeout kết nối và dữ liệu đầu vào rỗng.
```

---

## 4. Lỗi Thường Gặp Khi Dùng Cursor AI & Cách Khắc Phục

### Lỗi 1: Cursor tự ý xóa hoặc thay đổi code không liên quan
* **Nguyên nhân:** Ngữ cảnh quá rộng khiến AI cố gắng viết lại toàn bộ file thay vì chỉ sửa đoạn được yêu cầu.
* **Cách khắc phục:** Luôn bôi đen đoạn mã cần sửa và nhấn `Ctrl + K` (Inline Edit), hoặc chỉ định rõ số dòng cần can thiệp.

### Lỗi 2: AI tự chế ra các hàm hoặc thư viện không tồn tại (Hallucination)
* **Nguyên nhân:** Mô hình AI dựa trên dữ liệu huấn luyện cũ hoặc suy đoán tên package.
* **Cách khắc phục:** Cung cấp file `package.json` vào ngữ cảnh bằng cách gõ `@package.json` trong khung chat Cursor để AI nắm rõ danh sách thư viện thực tế.

---

## 5. Tải Trọn Bộ 50+ Prompt & File Rules Tối Ưu

* **Tải Trọn Gói 50+ Prompt & Bộ File Cấu Hình `.cursorrules` (Drive 0đ):** [Truy cập kho Google Drive Tự Học AI](https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing)
* **Hỏi đáp và hỗ trợ kỹ thuật:** Tham gia ngay [Cộng đồng Zalo Tự Học AI](https://zalo.me/g/tuhocai) để giao lưu cùng các lập trình viên AI.
* **Đăng ký khóa học chuyên sâu:** [Khóa học Làm chủ AI & n8n Tự Động Hóa](https://www.tuhocai.top/lp/n8n-tu-dong-hoa-kiem-tien).
* **Chương trình Affiliate:** [Gia nhập mạng lưới Affiliate Tự Học AI](https://www.tuhocai.top/affiliate).
"""

def upgrade_posts():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            # Bài 3: Claude 3.7
            cursor.execute("""
                UPDATE posts 
                SET content = %s,
                    summary = 'Phân tích kiến trúc Hybrid Reasoning của Claude 3.7 Sonnet, so sánh với OpenAI o3-mini và DeepSeek R1, hướng dẫn code mẫu tích hợp Thinking Budget.',
                    thumbnail = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80'
                WHERE slug = 'claude-37-sonnet-ra-mat-mo-hinh-ai-hybrid-dau-tien-tich-hop-kha-nang-suy-luan-sau'
            """, [POST_3_CONTENT])
            print("[THÀNH CÔNG] Đã nâng cấp Bài 3: Claude 3.7 Sonnet")

            # Bài 4: n8n Đa Kênh
            cursor.execute("""
                UPDATE posts 
                SET content = %s,
                    summary = 'Hướng dẫn tự host n8n bằng Docker trên VPS chỉ từ 100k/tháng, tự động đăng bài Facebook, Telegram, WordPress không giới hạn lượt chạy.',
                    thumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
                WHERE slug = 'huong-dan-tu-dong-hoa-dang-bai-da-kenh-bang-n8n-khong-can-thue-server-dat-tien'
            """, [POST_4_CONTENT])
            print("[THÀNH CÔNG] Đã nâng cấp Bài 4: n8n Tự Động Đăng Bài Đa Kênh")

            # Bài 5: Top 10 Kỹ Năng
            cursor.execute("""
                UPDATE posts 
                SET content = %s,
                    summary = 'Top 10 kỹ năng Agentic AI không thể thiếu trong năm 2026 giúp bạn chuyển đổi từ người dùng chatbot thông thường sang kiến trúc sư AI tự hành.',
                    thumbnail = 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80'
                WHERE slug = 'top-10-ky-nang-skills-can-co-de-lam-chu-ai-trong-nam-2026'
            """, [POST_5_CONTENT])
            print("[THÀNH CÔNG] Đã nâng cấp Bài 5: Top 10 Kỹ Năng Agentic AI 2026")

            # Bài 6: 50+ Prompt Cursor AI
            cursor.execute("""
                UPDATE posts 
                SET content = %s,
                    summary = 'Bộ sưu tập 50+ Prompt chuyên dụng cho Cursor AI và GitHub Copilot kèm file cấu hình .cursorrules chuẩn mực giúp lập trình nhanh gấp 5 lần.',
                    thumbnail = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80'
                WHERE slug = 'bo-50-prompt-toi-uu-cho-cursor-ai-github-copilot-giup-code-nhanh-gap-5-lan'
            """, [POST_6_CONTENT])
            print("[THÀNH CÔNG] Đã nâng cấp Bài 6: Bộ 50+ Prompt Cursor AI")

        conn.commit()
    finally:
        conn.close()

if __name__ == '__main__':
    upgrade_posts()
