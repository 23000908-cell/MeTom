function loadStatsMenu() {
    const select = document.getElementById("select-month-history");
    const history = JSON.parse(localStorage.getItem("historyData")) || [];
    
    // Lưu lại giá trị đang chọn hiện tại để tránh bị reset mất khi load lại menu
    const currentSelected = select.value;
    
    select.innerHTML = '<option value="">-- Chọn tháng --</option>';
    history.forEach((record, index) => {
        const opt = document.createElement("option");
        opt.value = index; // Dùng index làm pointer định vị cục dữ liệu
        opt.innerText = record.month;
        select.appendChild(opt);
    });

    select.value = currentSelected;
}

document.getElementById("select-month-history").addEventListener("change", (e) => {
    const index = e.target.value;
    const history = JSON.parse(localStorage.getItem("historyData")) || [];
    const display = document.getElementById("stats-display");

    if (index === "") {
        display.innerHTML = "<p>Vui lòng chọn một tháng để xem chi tiết hoặc so sánh biến động.</p>";
        return;
    }

    const currentRecord = history[index];
    const prevRecord = history[index - 1]; // Lấy bản ghi tháng liền trước đó (nếu có) để tính toán biến động

    let html = `<h3>Dữ liệu tổng hợp: ${currentRecord.month}</h3>`;
    html += `<table>
                <thead>
                    <tr>
                        <th>Danh mục</th>
                        <th>Chi tiêu tháng này</th>
                        <th>Biến động so với tháng trước</th>
                    </tr>
                </thead>
                <tbody>`;

    const categories = [
        { key: "thuc_pham", label: "Thực phẩm" },
        { key: "hoa_my_pham", label: "Hóa mỹ phẩm" },
        { key: "dien_nuoc", label: "Điện nước, Internet" },
        { key: "y_te", label: "Y tế & Sức khỏe" },
        { key: "khac", label: "Chi phí khác" }
    ];

    categories.forEach(cat => {
        const currentAmount = currentRecord.summary[cat.key] || 0;
        let trendHtml = `<span style="color: gray;">-- (Không có dữ liệu gốc)</span>`;

        if (prevRecord) {
            const prevAmount = prevRecord.summary[cat.key] || 0;
            if (prevAmount > 0) {
                const diffPercent = ((currentAmount - prevAmount) / prevAmount) * 100;
                if (diffPercent > 0) {
                    trendHtml = `<span style="color: red;"><i class="fa-solid fa-arrow-up"></i> Tăng ${diffPercent.toFixed(1)}%</span>`;
                } else if (diffPercent < 0) {
                    trendHtml = `<span style="color: green;"><i class="fa-solid fa-arrow-down"></i> Giảm ${Math.abs(diffPercent).toFixed(1)}%</span>`;
                } else {
                    trendHtml = `<span style="color: blue;">Không đổi</span>`;
                }
            } else if (currentAmount > 0) {
                trendHtml = `<span style="color: red;"><i class="fa-solid fa-arrow-up"></i> Mới phát sinh toán bộ</span>`;
            }
        }

        html += `<tr>
                    <td>${cat.label}</td>
                    <td>${currentAmount.toLocaleString()} đ</td>
                    <td>${trendHtml}</td>
                 </tr>`;
    });

    html += `</tbody></table>`;
    display.innerHTML = html;
});