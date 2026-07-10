// Khởi tạo các mảng dữ liệu trong LocalStorage nếu chưa có
let currentMonthData = JSON.parse(localStorage.getItem("currentMonthData")) || [];
let historyData = JSON.parse(localStorage.getItem("historyData")) || [];
let favoriteItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];

document.addEventListener("DOMContentLoaded", () => {
    renderCurrentTable();

    // Sự kiện thêm sản phẩm mới vào danh sách tạm thời
    document.getElementById("btn-add-item").addEventListener("click", () => {
        const name = document.getElementById("item-name").value.trim();
        const price = parseFloat(document.getElementById("item-price").value);
        const category = document.getElementById("item-category").value;

        if (!name || isNaN(price)) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm và số tiền hợp lệ!");
            return;
        }

        const newItem = { id: Date.now(), name, price, category, isFavorite: false };
        currentMonthData.push(newItem);
        localStorage.setItem("currentMonthData", JSON.stringify(currentMonthData));
        
        renderCurrentTable();
        // Reset ô nhập liệu
        document.getElementById("item-name").value = "";
        document.getElementById("item-price").value = "";
    });

    // Sự kiện Chốt sổ tháng
    document.getElementById("btn-checkout").addEventListener("click", () => {
        if (currentMonthData.length === 0) {
            alert("Danh sách tháng này đang trống, không thể chốt sổ!");
            return;
        }

        const monthLabel = prompt("Nhập tên tháng để lưu trữ (Ví dụ: Tháng 05/2026):");
        if (!monthLabel) return;

        // Tính toán tổng số tiền theo từng danh mục cho tháng này
        const summary = {
            thuc_pham: 0,
            hoa_my_pham: 0,
            dien_nuoc: 0,
            y_te: 0,
            khac: 0
        };

        currentMonthData.forEach(item => {
            if (summary[item.category] !== undefined) {
                summary[item.category] += item.price;
            } else {
                summary.khac += item.price;
            }
        });

        // Tạo cục dữ liệu đóng gói lịch sử
        const historicalRecord = {
            id: Date.now(),
            month: monthLabel,
            details: currentMonthData,
            summary: summary
        };

        historyData.push(historicalRecord);
        localStorage.setItem("historyData", JSON.stringify(historyData));

        // Xóa sạch dữ liệu tháng hiện tại để reset trang nhập liệu
        currentMonthData = [];
        localStorage.removeItem("currentMonthData");
        renderCurrentTable();

        alert(`Đã chốt sổ thành công dữ liệu cho ${monthLabel}!`);
    });
});

// Hàm hiển thị bảng dữ liệu đang nhập
function renderCurrentTable() {
    const tbody = document.querySelector("#table-current-month tbody");
    tbody.innerHTML = "";

    currentMonthData.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${translateCategory(item.category)}</td>
            <td>${item.price.toLocaleString()} đ</td>
            <td><i class="fa-solid fa-star ${item.isFavorite ? 'starred' : ''}" onclick="toggleFavorite(${item.id})"></i></td>
        `;
        tbody.appendChild(tr);
    });
}

// Hàm xử lý Bật/Tắt yêu thích trực tiếp bằng ngôi sao
function toggleFavorite(itemId) {
    currentMonthData = currentMonthData.map(item => {
        if (item.id === itemId) {
            item.isFavorite = !item.isFavorite;
            
            if (item.isFavorite) {
                // Nếu chưa có trong danh sách yêu thích tổng thì add vào
                if (!favoriteItems.some(fav => fav.name.toLowerCase() === item.name.toLowerCase())) {
                    favoriteItems.push({ name: item.name, category: item.category });
                }
            } else {
                // Nếu bỏ sao, xóa khỏi danh sách yêu thích tổng
                favoriteItems = favoriteItems.filter(fav => fav.name.toLowerCase() !== item.name.toLowerCase());
            }
        }
        return item;
    });

    localStorage.setItem("currentMonthData", JSON.stringify(currentMonthData));
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    renderCurrentTable();
}

function translateCategory(cat) {
    const maps = { thuc_pham: "Thực phẩm", hoa_my_pham: "Hóa mỹ phẩm", dien_nuoc: "Điện nước, Internet", y_te: "Y tế & Sức khỏe", khac: "Chi phí khác" };
    return maps[cat] || "Khác";
}