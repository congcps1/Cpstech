# Nội dung SEO cho cụm khóa tủ locker. Chạy: python3 seo/locker_content.py > /tmp/locker.sql
import json

PILLAR = """
<h2>Khóa tủ locker – khóa tủ đồ thông minh là gì?</h2>
<p><strong>Khóa tủ locker</strong> (còn gọi là <strong>khóa tủ đồ thông minh</strong>, <strong>khóa tủ đồ cá nhân</strong> hay khóa tủ điện tử) là loại khóa lắp cho tủ đựng đồ, mở bằng <a href="/khoa-tu-locker-the-tu/">thẻ từ</a>, <a href="/vong-deo-tay-the-tu/">vòng đeo tay</a>, <a href="/khoa-tu-locker-ma-so/">mã số</a> hoặc vân tay thay cho chìa cơ. Người dùng không phải giữ chìa, đơn vị quản lý không phải đánh lại chìa khi khách làm mất, và luôn có thẻ quản lý để mở hỗ trợ khi cần.</p>
<p>Khóa tủ đồ thông minh chạy bằng pin, lắp được cho tủ gỗ, tủ sắt, tủ nhựa, tủ inox, nên rất phổ biến tại phòng gym, bể bơi, spa, văn phòng, nhà máy, trường học và tủ gửi đồ siêu thị.</p>

<h2>Các loại khóa tủ đồ thông minh phổ biến</h2>
<ul>
<li><strong><a href="/khoa-tu-locker-the-tu/">Khóa tủ locker thẻ từ</a></strong>: chạm thẻ RFID hoặc vòng tay là mở. Nhanh nhất, không cần nhớ mã — hợp phòng gym, bể bơi, spa.</li>
<li><strong><a href="/khoa-tu-locker-ma-so/">Khóa tủ locker mã số</a></strong>: người dùng tự đặt mật mã, nhiều mẫu đọc thêm thẻ từ. Không lo mất thẻ — hợp văn phòng, trường học, tủ công cộng có khách vãng lai.</li>
<li><strong>Khóa tủ locker vân tay</strong>: mở bằng vân tay, dùng cho tủ cá nhân cố định của nhân viên.</li>
<li><strong>Khóa tủ lắp ẩn</strong>: thân khóa nằm bên trong cánh tủ, bên ngoài không lộ khóa, quẹt thẻ xuyên cánh — hợp tủ gỗ, nội thất cao cấp.</li>
<li><strong><a href="/vong-deo-tay-the-tu/">Vòng đeo tay thẻ từ</a></strong>: phụ kiện đi kèm khóa thẻ từ, silicon chống nước, đeo được khi bơi và tập luyện.</li>
</ul>

<h2>So sánh nhanh: thẻ từ, mã số hay vân tay?</h2>
<table>
<thead><tr><th>Tiêu chí</th><th>Thẻ từ / vòng tay</th><th>Mã số (có thể kèm thẻ)</th><th>Vân tay</th></tr></thead>
<tbody>
<tr><td>Cách mở</td><td>Chạm thẻ, vòng tay</td><td>Nhập mật mã (hoặc chạm thẻ)</td><td>Chạm ngón tay</td></tr>
<tr><td>Tốc độ</td><td>Nhanh nhất</td><td>Nhanh</td><td>Nhanh</td></tr>
<tr><td>Phát sinh khi vận hành</td><td>Cấp lại thẻ/vòng khi khách làm mất</td><td>Hỗ trợ khách quên mã</td><td>Đăng ký vân tay từng người</td></tr>
<tr><td>Phù hợp nhất</td><td>Gym, bể bơi, spa, khu vui chơi</td><td>Văn phòng, trường học, siêu thị, tủ công cộng</td><td>Tủ cá nhân cố định của nhân viên</td></tr>
</tbody>
</table>

<h2>Khóa tủ đồ dùng pin gì, bao lâu phải thay?</h2>
<p>Đa số khóa tủ đồ thông minh dùng <strong>pin AA hoặc AAA</strong> (thường 2–4 viên), một số mẫu dùng pin lithium sạc qua cổng USB. Thời gian dùng phụ thuộc số lần mở mỗi ngày; khi pin yếu, khóa sẽ <strong>báo pin yếu</strong> bằng âm thanh/đèn để thay kịp. Nếu pin cạn hẳn, chỉ cần cắm bộ cấp nguồn dự phòng vào <strong>cổng mở khẩn cấp</strong> để mở tủ rồi thay pin — không phải phá khóa.</p>

<h2>Cách chọn khóa tủ locker phù hợp</h2>
<ol>
<li><strong>Theo mô hình sử dụng</strong>: khách thay đổi liên tục (gym, bể bơi) nên chọn khóa thẻ từ + vòng tay, chế độ công cộng; tủ giao cố định cho từng người nên chọn chế độ cá nhân.</li>
<li><strong>Theo chất liệu và độ dày cánh tủ</strong>: tủ sắt, tủ gỗ, tủ nhựa mỗi loại hợp kiểu khóa và cách bắt vít khác nhau; tủ gỗ cao cấp có thể chọn khóa lắp ẩn.</li>
<li><strong>Theo môi trường</strong>: khu ẩm ướt như bể bơi, phòng xông hơi nên chọn mẫu vỏ kim loại chống gỉ và vòng tay silicon chống nước.</li>
<li><strong>Theo số lượng tủ</strong>: hệ thống nhiều tủ nên chọn mẫu có thẻ quản lý tổng, hủy được thẻ mất và in được số tủ trên mặt khóa.</li>
</ol>

<h2>Ứng dụng của khóa tủ đồ thông minh</h2>
<p>Phòng gym, yoga, bể bơi, spa, phòng xông hơi; tủ nhân viên nhà máy, văn phòng; tủ học sinh, ký túc xá; tủ gửi đồ siêu thị, trung tâm thương mại, khu vui chơi; tủ hồ sơ, ngăn kéo cần bảo mật.</p>

<h2>Mua khóa tủ locker tại CPSTECH</h2>
<ul>
<li>Hơn 60 mẫu khóa tủ thẻ từ, mã số, vân tay và vòng đeo tay; báo giá theo số lượng tủ.</li>
<li>Khảo sát, tư vấn đúng mẫu theo loại tủ; lắp đặt tận nơi tại Hà Nội, TP.HCM và giao hàng toàn quốc.</li>
<li>Đổi mới trong 1 tuần nếu có lỗi của nhà sản xuất; hỗ trợ kỹ thuật 24/24.</li>
</ul>
<p>Xem thêm: <a href="/khoa-tu-locker-thong-minh-la-gi/">Khóa tủ locker thông minh là gì</a> · <a href="/phan-loai-khoa-tu-locker-dien-tu/">Các loại khóa tủ locker phổ biến</a> · <a href="/huong-dan-su-dung-khoa-tu-locker/">Hướng dẫn sử dụng khóa tủ locker</a>.</p>
"""

PILLAR_FAQ = [
    {"q": "Khóa tủ locker và khóa tủ đồ thông minh có khác nhau không?", "a": "Không. Đây là các tên gọi khác nhau của cùng một loại khóa điện tử cho tủ đựng đồ, mở bằng thẻ từ, vòng tay, mã số hoặc vân tay thay cho chìa cơ."},
    {"q": "Nên chọn khóa tủ thẻ từ hay khóa tủ mã số?", "a": "Phòng gym, bể bơi, spa nên chọn khóa thẻ từ kèm vòng đeo tay vì mở nhanh, đeo khi tập/bơi được. Văn phòng, trường học, tủ công cộng có khách vãng lai nên chọn khóa mã số hoặc mã số kết hợp thẻ để không phụ thuộc thẻ."},
    {"q": "Khóa tủ đồ hết pin có mở được không?", "a": "Được. Khóa báo pin yếu trước khi hết; nếu pin cạn hẳn, cắm bộ cấp nguồn dự phòng vào cổng khẩn cấp để mở tủ rồi thay pin mới, không cần phá khóa."},
    {"q": "Khách làm mất thẻ hoặc quên mã thì xử lý thế nào?", "a": "Quản lý dùng thẻ master để mở tủ, sau đó hủy thẻ bị mất hoặc đặt lại mã. Khóa ở chế độ công cộng sẽ tự xóa mã/thẻ sau mỗi lượt sử dụng."},
    {"q": "Khóa tủ locker lắp được cho tủ gỗ và tủ sắt không?", "a": "Được. Mỗi mẫu có kiểu bắt vít, chốt phù hợp với độ dày cánh tủ khác nhau; CPSTECH tư vấn đúng mẫu và hỗ trợ lắp đặt tận nơi."},
]

THE_TU = """
<h2>Khóa tủ đồ thẻ từ hoạt động như thế nào?</h2>
<p><strong>Khóa tủ locker thẻ từ</strong> (khóa tủ đồ thẻ từ, khóa từ tủ locker) có đầu đọc RFID ở mặt khóa. Người dùng chỉ cần chạm <strong>thẻ từ</strong>, <strong>móc khóa</strong> hoặc <a href="/vong-deo-tay-the-tu/">vòng đeo tay thẻ từ</a> vào vùng đọc là khóa mở; đóng cánh tủ, chốt tự bật lại. Hầu hết các mẫu đọc được cả thẻ EM 125kHz và Mifare 13,56MHz.</p>
<h2>Ưu điểm của khóa tủ locker thẻ từ</h2>
<ul>
<li>Mở nhanh nhất, không cần nhớ mật mã — hợp nơi đông người ra vào liên tục.</li>
<li>Dùng được với vòng tay silicon chống nước: đeo khi bơi, tập gym, xông hơi.</li>
<li>Chế độ <strong>công cộng</strong> (khách chạm thẻ bất kỳ để giữ tủ trống, chạm lại để trả tủ) và chế độ <strong>cá nhân</strong> (mỗi tủ gán thẻ riêng).</li>
<li>Thẻ quản lý mở mọi tủ, hủy được thẻ bị mất; báo pin yếu, có cổng cấp nguồn khẩn cấp.</li>
</ul>
<h2>Nên dùng khóa tủ thẻ từ ở đâu?</h2>
<p>Phòng gym, yoga, bể bơi, spa, phòng xông hơi, khu vui chơi, tủ nhân viên nhà máy. Nếu khách vãng lai không có thẻ, tham khảo thêm <a href="/khoa-tu-locker-ma-so/">khóa tủ locker mã số</a> hoặc mẫu mã số kết hợp thẻ từ.</p>
<p>Xem tổng quan các loại tại trang <a href="/khoa-tu-ca-nhan-locker-thong-minh/">khóa tủ locker – khóa tủ đồ thông minh</a>.</p>
"""
THE_TU_FAQ = [
    {"q": "Khóa tủ thẻ từ dùng loại thẻ nào?", "a": "Phần lớn các mẫu đọc thẻ EM 125kHz hoặc Mifare 13,56MHz (một số đọc được cả hai), dùng được thẻ nhựa, móc khóa và vòng đeo tay RFID tương thích."},
    {"q": "Mất thẻ từ thì có mở tủ được không?", "a": "Quản lý dùng thẻ master để mở tủ, sau đó hủy thẻ bị mất và cấp thẻ mới; thẻ đã hủy không mở được tủ nữa."},
    {"q": "Một khóa tủ thẻ từ dùng được mấy thẻ?", "a": "Tùy chế độ: ở chế độ công cộng mọi thẻ hợp lệ đều dùng được tủ trống; ở chế độ cá nhân mỗi tủ gán 1 hoặc 2 thẻ riêng."},
]

MA_SO = """
<h2>Khóa tủ đồ mã số là gì?</h2>
<p><strong>Khóa tủ locker mã số</strong> (khóa tủ đồ mã số, khóa số tủ locker, khóa mật mã tủ locker) mở bằng mật mã người dùng tự đặt trên bàn phím điện tử. Nhiều mẫu là <strong>khóa tủ mã số thẻ từ</strong>: vừa nhập mã vừa chạm thẻ đều mở được, linh hoạt cho cả nhân viên có thẻ lẫn khách vãng lai.</p>
<h2>Ưu điểm của khóa tủ locker mã số</h2>
<ul>
<li>Không phụ thuộc thẻ: khách tự đặt mã, không lo quên hay mất thẻ.</li>
<li>Chế độ <strong>công cộng</strong>: nhập mã bất kỳ để khóa, nhập lại đúng mã để mở, mã tự xóa sau lượt dùng. Chế độ <strong>cố định</strong>: mỗi tủ một mã riêng.</li>
<li>Bàn phím cảm ứng hoặc phím cơ có đèn nền; báo động khi nhập sai mã, báo pin yếu, có cổng nguồn khẩn cấp.</li>
<li>Có mẫu vỏ inox 304 chống gỉ cho khu ẩm ướt và mẫu cho tủ nhiều ngăn kéo.</li>
</ul>
<h2>Khóa số điện tử khác gì khóa số cơ?</h2>
<p>Khóa số cơ (xoay 3–4 số) không cần pin nhưng dễ dò mã và không có thẻ quản lý. Khóa tủ mã số điện tử bảo mật hơn, có thẻ master mở hỗ trợ, đổi mã nhanh, phù hợp hệ thống nhiều tủ cần quản lý tập trung.</p>
<p>Cần mở nhanh bằng thẻ hoặc vòng tay? Xem <a href="/khoa-tu-locker-the-tu/">khóa tủ locker thẻ từ</a>. Tổng quan tại <a href="/khoa-tu-ca-nhan-locker-thong-minh/">khóa tủ locker – khóa tủ đồ thông minh</a>.</p>
"""
MA_SO_FAQ = [
    {"q": "Quên mã khóa tủ thì làm sao?", "a": "Quản lý dùng thẻ hoặc mã master để mở tủ và đặt lại mã. Ở chế độ công cộng, mã tự xóa sau khi khách mở tủ trả đồ."},
    {"q": "Khóa tủ mã số có cần thẻ không?", "a": "Không bắt buộc. Mẫu chỉ mã số mở bằng mật mã; mẫu mã số thẻ từ mở được bằng cả mã lẫn thẻ, tiện cho đơn vị có cả nhân viên và khách vãng lai."},
    {"q": "Khóa tủ mã số dùng pin gì?", "a": "Thường dùng pin AA hoặc AAA, một số mẫu dùng pin lithium sạc USB; khóa báo pin yếu và có cổng nguồn khẩn cấp khi hết pin."},
]

VONG = """
<h2>Vòng đeo tay thẻ từ là gì?</h2>
<p><strong>Vòng đeo tay thẻ từ</strong> (thẻ từ nhựa đeo tay, vòng tay RFID) là thẻ từ được đúc trong vòng silicon/nhựa dẻo, dùng thay thẻ nhựa để mở <a href="/khoa-tu-locker-the-tu/">khóa tủ locker thẻ từ</a>. Khách đeo trên cổ tay suốt buổi tập, buổi bơi nên không lo rơi mất hay để quên thẻ.</p>
<h2>Ưu điểm của thẻ từ vòng đeo tay cho khóa tủ locker</h2>
<ul>
<li>Silicon chống nước, đeo được khi bơi, tắm, xông hơi.</li>
<li>Không dùng pin, độ bền cao, vệ sinh dễ dàng.</li>
<li>Nhiều màu để phân biệt khu vực/đối tượng; có thể in số tủ.</li>
<li>Chip EM 125kHz hoặc Mifare 13,56MHz — cần chọn đúng loại chip khóa đang dùng.</li>
</ul>
<h2>Lưu ý khi mua vòng đeo tay thẻ từ</h2>
<p>Hãy kiểm tra loại chip của khóa tủ (EM hay Mifare) trước khi mua. Nếu chưa rõ, gửi mã khóa hoặc ảnh khóa cho CPSTECH để được tư vấn đúng loại vòng tay. Xem thêm các mẫu <a href="/khoa-tu-ca-nhan-locker-thong-minh/">khóa tủ locker – khóa tủ đồ thông minh</a>.</p>
"""
VONG_FAQ = [
    {"q": "Vòng đeo tay thẻ từ dùng được cho mọi khóa tủ không?", "a": "Không. Vòng tay phải cùng loại chip với khóa (EM 125kHz hoặc Mifare 13,56MHz). CPSTECH kiểm tra mã khóa và tư vấn đúng loại trước khi giao."},
    {"q": "Vòng đeo tay thẻ từ có bị hỏng khi xuống nước không?", "a": "Không. Chip được đúc kín trong silicon nên chống nước, dùng được ở bể bơi, phòng tắm, phòng xông hơi."},
    {"q": "Có thể in số tủ lên vòng đeo tay không?", "a": "Có. Vòng tay có thể in hoặc gắn số tủ để khách dễ nhớ tủ của mình; liên hệ CPSTECH để đặt theo số lượng."},
]

def q(s):
    return "$c$" + s.strip() + "$c$"

def upd(slug, html, faq):
    return f"update cps_categories set content_html = {q(html)}, faq = {q(json.dumps(faq, ensure_ascii=False))}::jsonb where slug = '{slug}';"

print("begin;")
print(upd('khoa-tu-ca-nhan-locker-thong-minh', PILLAR, PILLAR_FAQ))
print(upd('khoa-tu-locker-the-tu', THE_TU, THE_TU_FAQ))
print(upd('khoa-tu-locker-ma-so', MA_SO, MA_SO_FAQ))
print(upd('vong-deo-tay-the-tu', VONG, VONG_FAQ))
print("commit;")
print("select slug, length(content_html) l, jsonb_array_length(faq) f from cps_categories where content_html is not null;")
