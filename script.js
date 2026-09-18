document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Xử lý Menu Mobile ---
  const menuToggle = document.querySelector("#mobile-menu");
  const navLinks = document.querySelector("#nav-links");
  const navItems = document.querySelectorAll(".nav-item");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // --- 2. Xử lý Dữ liệu các bộ ảnh Modal (Ảnh con bên trong) ---
  // Bạn hãy thay link ảnh bằng những bức ảnh thực tế của bạn nhé
  const albumData = {
    "nang-tho-01": [
      "image/album_01/01.jpg",
      "image/album_01/02.jpg",
      "image/album_01/03.jpg",
      "image/album_01/04.jpg",
      "image/album_01/05.jpg",
      "image/album_01/06.jpg",
    ],
    "nang-tho-02": [
      "image/album_01/01.jpg",
      "image/album_01/02.jpg",
      "image/album_01/03.jpg",
      "image/album_01/04.jpg",
      "image/album_01/05.jpg",
      "image/album_01/06.jpg",
      "image/album_01/07.jpg",
    ],
  };

  const modal = document.getElementById("image-modal");
  const modalTrack = document.getElementById("modal-track");
  const closeModal = document.querySelector(".close-modal");
  const btnPrev = document.getElementById("modal-prev");
  const btnNext = document.getElementById("modal-next");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  let currentIndex = 0;
  let autoPlayInterval;
  let currentImagesCount = 0;

  // --- 3. Logic mở Modal và đổ hình ảnh ---
  portfolioItems.forEach((item) => {
    item.addEventListener("click", function () {
      const albumKey = this.getAttribute("data-album");
      const images = albumData[albumKey];

      if (images && images.length > 0) {
        // Xóa ảnh cũ
        modalTrack.innerHTML = "";
        // Render ảnh mới
        images.forEach((imgUrl) => {
          const img = document.createElement("img");
          img.src = imgUrl;
          modalTrack.appendChild(img);
        });

        currentImagesCount = images.length;
        currentIndex = 0;
        updateSliderPosition();

        modal.style.display = "block";
        startAutoPlay();
      }
    });
  });

  // Hàm cập nhật vị trí thẻ trượt
  function updateSliderPosition() {
    modalTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Hàm chuyển sang slide kế tiếp
  function nextSlide() {
    if (currentIndex < currentImagesCount - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Quay về đầu nếu hết
    }
    updateSliderPosition();
  }

  // Hàm lùi về slide trước
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = currentImagesCount - 1;
    }
    updateSliderPosition();
  }

  // Logic Tự động cuộn (Auto roll)
  function startAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5000); // 5 giây trượt 1 lần
  }

  // Reset tự động trượt khi người dùng tự bấm nút
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // --- Bắt sự kiện bấm nút ---
  btnNext.addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
  });

  btnPrev.addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
  });

  // Đóng Modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    clearInterval(autoPlayInterval);
  });

  // Đóng Modal khi nhấp ra ngoài viền đen
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      clearInterval(autoPlayInterval);
    }
  });

  // --- Tính năng Tự động trượt ngang cho Portfolio (Không nhân đôi album) ---
  const portfolioGrid = document.querySelector(".portfolio-grid");
  let autoScrollInterval;
  const scrollSpeed = 1; // Tốc độ trượt
  let direction = 1; // 1: trượt sang phải, -1: trượt ngược lại sang trái

  function startAutoScroll() {
    clearInterval(autoScrollInterval);

    autoScrollInterval = setInterval(() => {
      portfolioGrid.scrollLeft += scrollSpeed * direction;

      const maxScroll = portfolioGrid.scrollWidth - portfolioGrid.clientWidth;

      // Khi trượt hết sang phải, tự động đảo chiều trượt mượt mà về lại bên trái
      if (portfolioGrid.scrollLeft >= maxScroll - 1) {
        direction = -1;
      } else if (portfolioGrid.scrollLeft <= 0) {
        direction = 1;
      }
    }, 20);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  startAutoScroll();

  // Tạm dừng khi người dùng tương tác
  portfolioGrid.addEventListener("mouseenter", stopAutoScroll);
  portfolioGrid.addEventListener("mouseleave", startAutoScroll);
  portfolioGrid.addEventListener("touchstart", stopAutoScroll);
  portfolioGrid.addEventListener("touchend", startAutoScroll);
});
