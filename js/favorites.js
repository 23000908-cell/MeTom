function renderFavorites() {
    const container = document.getElementById("favorites-list");
    const favorites = JSON.parse(localStorage.getItem("favoriteItems")) || [];

    if (favorites.length === 0) {
        container.innerHTML = "<p>Chưa có sản phẩm yêu thích nào được lưu. Hãy bấm nút ngôi sao ở trang Nhập liệu nhé!</p>";
        return;
    }

    container.innerHTML = "";
    favorites.forEach(item => {
        const card = document.createElement("div");
        card.className = "fav-card";
        card.innerHTML = `
            <h4><i class="fa-solid fa-star" style="color: #f1c40f;"></i> ${item.name}</h4>
            <p><small>Danh mục gợi ý: ${translateCategory(item.category)}</small></p>
        `;
        container.appendChild(card);
    });
}