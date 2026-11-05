const colors = ["var(--blue)", "var(--red)", "var(--yellow)", "var(--mint)"];
const categories = [...new Set(toys.map(t => t.category))].sort();
const colorOf = c => colors[categories.indexOf(c) % colors.length];
const money = n => "₹" + n.toLocaleString("en-IN");
let cart = 0;

const $ = id => document.getElementById(id);

function card(t) {
  return `<article class="card" style="--c:${colorOf(t.category)}">
    <div class="thumb" aria-hidden="true">${t.icon}</div>
    <div class="body">
      <span class="tag">${t.category}</span>
      <h3>${t.name}</h3>
      <div class="meta"><b>Toy ID:</b> ${t.toyId} &nbsp; <b>Brand:</b> ${t.brand}</div>
      <div class="meta"><b>Age:</b> ${t.minAge}+ years &nbsp; <b>In stock:</b> ${t.stock}</div>
      <div class="price">${money(t.price)}</div>
      <button class="add" data-name="${t.name}">Add to cart</button>
    </div>
  </article>`;
}

function renderStats() {
  const brands = new Set(toys.map(t => t.brand)).size;
  const items = [
    [toys.length, "Toys in stock"],
    [categories.length, "Categories"],
    [brands, "Brands"],
  ];
  $("stats").innerHTML = items.map((s, i) =>
    `<div class="stat" style="--c:${colors[i]}"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("");
  $("featured").innerHTML = [...toys].sort((a, b) => b.price - a.price).slice(0, 3).map(card).join("");
}

function renderToys() {
  const q = $("search").value.trim().toLowerCase();
  const cat = $("category").value;
  const sort = $("sort").value;
  let list = toys.filter(t =>
    (!cat || t.category === cat) &&
    (t.name + " " + t.brand).toLowerCase().includes(q));
  if (sort) list.sort((a, b) => sort === "asc" ? a.price - b.price : b.price - a.price);
  $("grid").innerHTML = list.length
    ? list.map(card).join("")
    : `<p class="empty">No toys match your search. Try a different name or category.</p>`;
}

function renderCategories() {
  $("catGrid").innerHTML = categories.map(c => {
    const names = toys.filter(t => t.category === c).map(t => t.name).join(", ");
    return `<a class="card catcard" href="#toys" data-cat="${c}" style="--c:${colorOf(c)}">
      <h3>${c}</h3><div class="meta">${names}</div></a>`;
  }).join("");
}

function showPage() {
  const page = (location.hash || "#home").slice(1);
  const id = ["home", "toys", "categories", "contact"].includes(page) ? page : "home";
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("show", p.id === id));
  document.querySelectorAll("nav a").forEach(a => a.classList.toggle("active", a.dataset.page === id));
  window.scrollTo(0, 0);
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("on");
  setTimeout(() => t.classList.remove("on"), 1800);
}

document.addEventListener("click", e => {
  const add = e.target.closest(".add");
  if (add) {
    cart++;
    $("cartCount").textContent = cart;
    toast(add.dataset.name + " added to cart");
  }
  const cat = e.target.closest("[data-cat]");
  if (cat) { $("category").value = cat.dataset.cat; renderToys(); }
});

$("category").innerHTML = `<option value="">All categories</option>` +
  categories.map(c => `<option>${c}</option>`).join("");
["input", "change"].forEach(ev => {
  $("search").addEventListener(ev, renderToys);
  $("category").addEventListener(ev, renderToys);
  $("sort").addEventListener(ev, renderToys);
});

$("form").addEventListener("submit", e => {
  e.preventDefault();
  $("formNote").textContent = "Thanks, " + $("fname").value + ". We will reply to " + $("femail").value + " soon.";
  e.target.reset();
});

window.addEventListener("hashchange", showPage);
renderStats(); renderToys(); renderCategories(); showPage();
