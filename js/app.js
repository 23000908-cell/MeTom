document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page-content");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove active cũ ở menu
            document.querySelector(".nav-item.active").classList.remove("active");
            // Add active mới
            item.classList.add("active");

            // Lấy ID trang đích từ thuộc tính data-target
            const targetPageId = item.getAttribute("data-target");

            // Ẩn tất cả các trang và hiển thị trang đích
            pages.forEach(page => {
                if (page.id === targetPageId) {
                    page.classList.add("active");
                } else {
                    page.classList.remove("active");
                }
            });

            // Gọi các hàm tải lại dữ liệu tương ứng khi đổi trang
            if (targetPageId === "page-stats") { if (typeof loadStatsMenu === "function") loadStatsMenu(); }
            if (targetPageId === "page-favorites") { if (typeof renderFavorites === "function") renderFavorites(); }
        });
    });
});