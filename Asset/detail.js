const API_URL =
  "https://script.google.com/macros/s/AKfycbz3XTARB3Vd1pANXA5MZ1KqbquHLRC4eO3K6uZENRxfjtvnE1Nb7gv0AHEkxqDxyejGtA/exec?action=produk_web";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const card = document.getElementById("detailCard");
const relatedBox = document.getElementById("relatedProducts");

let produkShopee = [];

function ambilDeskripsi(produk) {
  return (
    produk.deskripsi ||
    produk.Deskripsi ||
    produk.detail ||
    produk.Detail ||
    produk.detail_produk ||
    produk["detail produk"] ||
    produk["Detail Produk"] ||
    produk["deskripsi "] ||
    "Belum ada deskripsi produk."
  );
}

function ambilKeterangan(produk) {
  return (
    produk.keterangan ||
    produk.Keterangan ||
    produk.status ||
    produk.Status ||
    produk["keterangan "] ||
    ""
  );
}

function renderDetail(produk) {
  const keterangan = ambilKeterangan(produk);
  const deskripsi = ambilDeskripsi(produk);

  card.innerHTML = `
    <div class="detail-layout">
      <div>
        <img
          src="${produk.gambar || "./logo.png"}"
          class="product-img"
          alt="${produk.nama || "Produk Alkes PKY"}">
      </div>

      <div class="detail-info">
        <h2>${produk.nama || ""}</h2>

        <div class="price">${produk.harga || ""}</div>

        <div class="status tersedia">
          ${keterangan}
        </div>

        <div class="desc">
          ${deskripsi}
        </div>

        <div class="share-title">Bagikan Produk</div>

        <div class="share-buttons">
          <a class="share-btn share-wa" id="shareWA">WhatsApp</a>
          <a class="share-btn share-fb" id="shareFB">Facebook</a>
          <button class="share-btn share-ig" id="shareIG">Instagram</button>
        </div>

        <a class="btn wa"
          href="https://wa.me/6282253124745?text=Halo,%20saya%20ingin%20menanyakan%20produk%20${encodeURIComponent(produk.nama || "")}">
          Tanya via WhatsApp
        </a>

        <a class="btn home" href="index.html">
          ← Kembali ke Home
        </a>
      </div>
    </div>
  `;

  setupShare(produk);
}

function setupShare(produk) {
  const urlProduk = window.location.href;
  const textProduk = `Cek produk ${produk.nama || "ini"} di Alkes PKY 👇`;

  document.getElementById("shareWA").href =
    `https://wa.me/?text=${encodeURIComponent(textProduk + " " + urlProduk)}`;

  document.getElementById("shareFB").href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlProduk)}`;

  document.getElementById("shareIG").onclick = () => {
    navigator.clipboard.writeText(urlProduk);
    alert("Link produk disalin! Tempelkan di Instagram Story atau DM 📋");
  };
}

function getKeyword(nama) {
  return (nama || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)[0] || "";
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function renderRelated(produk) {
  relatedBox.innerHTML = "";

  const keyword = getKeyword(produk.nama);

  let related = produkShopee.filter(p =>
    String(p.id) !== String(produk.id) &&
    (
      (p.nama || "").toLowerCase().includes(keyword) ||
      (ambilKeterangan(p) || "").toLowerCase().includes(keyword)
    )
  );

  if (related.length === 0) {
    related = shuffle(
      produkShopee.filter(p => String(p.id) !== String(produk.id))
    );
  }

  related = related.slice(0, 5);

  related.forEach(p => {
    relatedBox.innerHTML += `
      <div class="product">
        <img src="${p.gambar || "./logo.png"}" alt="${p.nama || "Produk Alkes PKY"}">
        <div class="name">${p.nama || ""}</div>
        <div class="price">${p.harga || ""}</div>
        <a class="ask" href="detail.html?id=${p.id || ""}">
          Lihat Produk
        </a>
      </div>
    `;
  });
}

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    produkShopee = Array.isArray(data) ? data : [];

    const produk = produkShopee.find(p => String(p.id) === String(id));

    if (!produk) {
      card.innerHTML = `
        <p style="text-align:center;color:#6b7280;margin-top:24px">
          Produk tidak ditemukan.
        </p>
        <a class="btn home" href="index.html">
          ← Kembali ke Home
        </a>
      `;
      relatedBox.innerHTML = "";
      return;
    }

    renderDetail(produk);
    renderRelated(produk);
  })
  .catch(err => {
    console.error(err);

    card.innerHTML = `
      <p style="text-align:center;color:#6b7280;margin-top:24px">
        Gagal memuat detail produk.
      </p>
      <a class="btn home" href="index.html">
        ← Kembali ke Home
      </a>
    `;
  });
