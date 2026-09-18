document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Xử lý Menu Mobile ---
  const menuToggle = document.querySelector("#mobile-menu");
  const navLinks = document.querySelector("#nav-links");
  const navItems = document.querySelectorAll(".nav-item");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (menuToggle) menuToggle.classList.remove("active");
      if (navLinks) navLinks.classList.remove("active");
    });
  });

  // --- 2. Xử lý Dữ liệu các bộ ảnh Modal (Ảnh con bên trong) ---
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
      "image/album_02/01.jpg",
      "image/album_02/02.jpg",
      "image/album_02/03.jpg",
      "image/album_02/04.jpg",
      "image/album_02/05.jpg",
      "image/album_02/06.jpg",
      "image/album_02/07.jpg",
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

          // Tắt hành vi click mặc định trên ảnh bên trong modal
          img.addEventListener("click", (e) => {
            e.preventDefault();
          });

          modalTrack.appendChild(img);
        });

        currentImagesCount = images.length;
        currentIndex = 0;
        updateSliderPosition();

        if (modal) {
          modal.style.display = "block";
          // 🛑 KHÓA CUỘN DỌC TRANG KHI MỞ MODAL (Giúp vuốt ngang trên điện thoại mượt mà)
          document.body.classList.add("modal-open");
        }
        startAutoPlay();
      }
    });
  });

  // Hàm cập nhật vị trí thẻ trượt
  function updateSliderPosition() {
    if (modalTrack) {
      modalTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
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

  // Logic Tự động trượt (Auto roll)
  function startAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 2000); // 2 giây trượt 1 lần
  }

  // Reset tự động trượt khi người dùng tương tác
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // --- Bắt sự kiện bấm nút (Chỉ kích hoạt nếu không phải điện thoại hoặc chặn click trên di động) ---
  if (btnNext) {
    btnNext.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        return;
      }
      nextSlide();
      resetAutoPlay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        return;
      }
      prevSlide();
      resetAutoPlay();
    });
  }

  // Hàm đóng Modal dùng chung để tối ưu code
  function closeModalFunc() {
    if (modal) {
      modal.style.display = "none";
      // 🟢 MỞ LẠI CUỘN DỌC TRANG KHI ĐÓNG MODAL
      document.body.classList.remove("modal-open");
    }
    clearInterval(autoPlayInterval);
  }

  // Đóng Modal khi bấm nút X
  if (closeModal) {
    closeModal.addEventListener("click", closeModalFunc);
  }

  // Đóng Modal khi nhấp ra ngoài viền đen
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      closeModalFunc();
    }
  });

  // --- 4. TÍCH HỢP VUỐT CẢM ỨNG (TOUCH SWIPE) TRÊN ĐIỆN THOẠI CHO MODAL ---
  let touchStartX = 0;
  let touchEndX = 0;

  if (modal) {
    modal.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoPlayInterval); // Tạm dừng tự động chạy khi người dùng bắt đầu chạm vuốt
      },
      { passive: true },
    );

    modal.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleModalSwipe();
        startAutoPlay(); // Chạy lại auto play sau khi vuốt xong
      },
      { passive: true },
    );
  }

  function handleModalSwipe() {
    const swipeThreshold = 50; // Khoảng cách tối thiểu để nhận diện là vuốt (px)

    // Vuốt sang trái -> Xem ảnh tiếp theo
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide();
    }

    // Vuốt sang phải -> Quay lại ảnh trước
    if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide();
    }
  }

  // --- 5. Tính năng Tự động trượt ngang cho Portfolio ---
  const portfolioGrid = document.querySelector(".portfolio-grid");

  if (portfolioGrid) {
    let autoScrollInterval;
    const scrollSpeed = 1;
    let direction = 1;

    function startAutoScroll() {
      clearInterval(autoScrollInterval);

      autoScrollInterval = setInterval(() => {
        portfolioGrid.scrollLeft += scrollSpeed * direction;

        const maxScroll = portfolioGrid.scrollWidth - portfolioGrid.clientWidth;

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

    portfolioGrid.addEventListener("mouseenter", stopAutoScroll);
    portfolioGrid.addEventListener("mouseleave", startAutoScroll);
    portfolioGrid.addEventListener("touchstart", stopAutoScroll, {
      passive: true,
    });
    portfolioGrid.addEventListener("touchend", startAutoScroll, {
      passive: true,
    });
  }
});
