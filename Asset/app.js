window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Z5SBQCD2XR');

const API_URL =
"https://script.google.com/macros/s/AKfycbz3XTARB3Vd1pANXA5MZ1KqbquHLRC4eO3K6uZENRxfjtvnE1Nb7gv0AHEkxqDxyejGtA/exec?action=produk_web";

let produkShopee = [];
let filteredData = [];

const etalase = document.getElementById("etalase");
const pagination = document.getElementById("pagination");

const ITEMS_PER_PAGE = 10;
let currentPage = 1;

function searchProduk(){
  const keyword = document.getElementById("searchBox").value.toLowerCase();

  filteredData = produkShopee.filter(p =>
    (p.nama || "").toLowerCase().includes(keyword) ||
    (p.keterangan || "").toLowerCase().includes(keyword) ||
    (p.deskripsi || "").toLowerCase().includes(keyword)
  );

  currentPage = 1;
  renderProduk(currentPage);
}

function renderProduk(page){
  etalase.innerHTML = "";

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const data = filteredData.slice(start,end);

  if(data.length === 0){
    etalase.innerHTML = `
      <p class="empty-message">
        Produk tidak ditemukan.
      </p>
    `;
    pagination.innerHTML = "";
    return;
  }

  data.forEach(p => {
    etalase.innerHTML += `
      <div class="product">
        <img src="${p.gambar || './logo.png'}" alt="${p.nama || 'Produk Alkes PKY'}">

        <div class="name">${p.nama || ""}</div>

        <div class="price">${p.harga || ""}</div>

        <div class="keterangan">${p.keterangan || ""}</div>

        <div class="actions">
          <a class="ask detail" href="detail.html?id=${p.id || ''}">
            Detail Produk
          </a>

          <a class="ask"
          href="https://wa.me/6282253124745?text=Halo,%20saya%20ingin%20menanyakan%20barang%20ini%20%22${encodeURIComponent(p.nama || "")}%22">
            Tanya Barang ini
          </a>
        </div>
      </div>
    `;
  });

  renderPagination();
}

function renderPagination(){
  pagination.innerHTML = "";

  const totalPage = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  if(totalPage <= 1) return;

  for(let i=1; i<=totalPage; i++){
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "page-btn active" : "page-btn";
    btn.addEventListener("click", () => gotoPage(i));
    pagination.appendChild(btn);
  }
}

function gotoPage(page){
  currentPage = page;
  renderProduk(currentPage);
  window.scrollTo({top:0, behavior:"smooth"});
}

function nextPage(){
  const totalPage = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  if(currentPage < totalPage){
    currentPage++;
    renderProduk(currentPage);
    window.scrollTo({top:0, behavior:"smooth"});
  }
}

function prevPage(){
  if(currentPage > 1){
    currentPage--;
    renderProduk(currentPage);
    window.scrollTo({top:0, behavior:"smooth"});
  }
}

fetch(API_URL)
.then(res => res.json())
.then(data => {
  produkShopee = Array.isArray(data) ? data : [];
  filteredData = produkShopee;
  renderProduk(currentPage);
})
.catch(err => {
  console.error(err);
  etalase.innerHTML = `
    <p class="empty-message">
      Gagal memuat produk
    </p>
  `;
});

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  if(!deferredPrompt) return;

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;

  deferredPrompt = null;
  installBtn.style.display = "none";
});

const searchBox = document.getElementById("searchBox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if(searchBox){
  searchBox.addEventListener("input", searchProduk);
}

if(prevBtn){
  prevBtn.addEventListener("click", prevPage);
}

if(nextBtn){
  nextBtn.addEventListener("click", nextPage);
}
