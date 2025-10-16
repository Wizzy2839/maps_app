// OpenStreetMap tidak memerlukan API Key, jadi variabel ini tidak digunakan.
// const apiKey = 'YOUR_API_KEY'; 

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const mapInfoText = document.getElementById('info-text');

// Inisialisasi peta dan pusatkan di Indonesia
// Koordinat [-2.5, 118.0] adalah perkiraan tengah Indonesia
const map = L.map('map').setView([-2.5, 118.0], 5);
let marker;

// Tambahkan layer peta dari OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/**
 * Fungsi untuk mencari lokasi berdasarkan input pengguna
 */
async function searchLocation() {
    const query = searchInput.value.trim();
    if (query === '') {
        mapInfoText.textContent = 'Harap masukkan lokasi untuk dicari.';
        return;
    }

    mapInfoText.textContent = `Mencari "${query}"...`;

    // Menggunakan API Nominatim dari OpenStreetMap untuk Geocoding
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Gagal mengambil data dari server.');
        }
        const data = await response.json();

        if (data && data.length > 0) {
            const location = data[0];
            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);
            
            // Perbarui tampilan peta
            map.setView([lat, lon], 13);

            // Hapus marker lama jika ada
            if (marker) {
                map.removeLayer(marker);
            }

            // Tambahkan marker baru
            marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>${location.display_name}</b>`)
                .openPopup();

            mapInfoText.textContent = `Menampilkan hasil untuk: ${location.display_name}`;
        } else {
            mapInfoText.textContent = `Lokasi "${query}" tidak ditemukan. Coba kata kunci lain.`;
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        mapInfoText.textContent = 'Gagal terhubung ke layanan peta. Silakan coba lagi nanti.';
    }
}

// Tambahkan event listener untuk tombol cari
searchButton.addEventListener('click', searchLocation);

// Tambahkan event listener untuk menekan 'Enter' di kolom input
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchLocation();
    }
});
