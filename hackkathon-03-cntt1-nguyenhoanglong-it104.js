"use strict";
class Movie {
    constructor(title, genre, ticketPrice) {
        this.id = Movie.idCounter++;
        this.title = title;
        this.genre = genre;
        this.ticketPrice = ticketPrice;
        this.isShowing = false;
    }
    startShow() {
        this.isShowing = true;
    }
    stopShow() {
        this.isShowing = false;
    }
    calculateTicketCost(quantity) {
        return 0;
    }
    getSpecialOffers() {
        return [];
    }
    getMovieInfo() {
        return '';
    }
}
Movie.idCounter = 1;
class ActionMovie extends Movie {
    constructor(title, price) {
        super(title, 'Hành động', price);
    }
    calculateTicketCost(quantity) {
        return this.ticketPrice * quantity * 1.15;
    }
    getSpecialOffers() {
        return ['Miễn phí bắp rang', 'Tặng poster'];
    }
    getMovieInfo() {
        return 'Phim hành động gay cấn, kỹ xảo hoành tráng';
    }
}
class ComedyMovie extends Movie {
    constructor(title, price) {
        super(title, 'Hài', price);
    }
    calculateTicketCost(quantity) {
        const subtotal = this.ticketPrice * quantity;
        return quantity >= 5 ? subtotal * 0.9 : subtotal;
    }
    getSpecialOffers() {
        return ['Giảm 10% cho nhóm trên 4 người'];
    }
    getMovieInfo() {
        return 'Phim hài nhẹ nhàng, vui nhộn';
    }
}
class AnimationMovie extends Movie {
    constructor(title, price) {
        super(title, 'Hoạt hình', price);
    }
    calculateTicketCost(quantity) {
        return quantity >= 3
            ? this.ticketPrice * quantity * 0.85
            : this.ticketPrice * quantity;
    }
    getSpecialOffers() {
        return ['Giảm giá cho trẻ em dưới 12 tuổi'];
    }
    getMovieInfo() {
        return 'Phim hoạt hình với hình ảnh sống động';
    }
}
class Audience {
    constructor(name, email, phone) {
        this.id = Audience.idCounter++;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    getDetails() {
        return `#${this.id} | ${this.name} | ${this.email} | ${this.phone}`;
    }
}
Audience.idCounter = 1;
class TicketBooking {
    constructor(audience, movie, quantity) {
        this.bookingId = TicketBooking.idCounter++;
        this.audience = audience;
        this.movie = movie;
        this.quantity = quantity;
        this.totalPrice = movie.calculateTicketCost(quantity);
    }
    getDetails() {
        return `Booking#${this.bookingId} | Audience: ${this.audience.name} | Movie: ${this.movie.title} | Qty: ${this.quantity} | Total: ${this.totalPrice.toFixed(2)}`;
    }
}
TicketBooking.idCounter = 1;
function findById(collection, id, key) {
    return collection.find(item => Number(item[key]) === id);
}
class Cinema {
    constructor() {
        this.movies = [];
        this.audiences = [];
        this.bookings = [];
    }
    addMovie(movie) {
        this.movies.push(movie);
    }
    addAudience(name, email, phone) {
        const a = new Audience(name, email, phone);
        this.audiences.push(a);
        return a;
    }
    bookTickets(audienceId, movieId, quantity) {
        const audience = this.findAudienceById(this.audiences, audienceId);
        const movie = this.findMovieById(this.movies, movieId);
        if (!audience || !movie || !movie.isShowing || quantity <= 0)
            return null;
        const booking = new TicketBooking(audience, movie, quantity);
        this.bookings.push(booking);
        return booking;
    }
    cancelMovie(movieId) {
        const idx = this.movies.findIndex(m => m.id === movieId);
        if (idx !== -1)
            this.movies[idx].stopShow();
    }
    listShowingMovies() {
        return this.movies.filter(m => m.isShowing);
    }
    listAudienceBookings(audienceId) {
        return this.bookings.filter(b => b.audience.id === audienceId);
    }
    calculateTotalRevenue() {
        return this.bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    }
    getMovieGenreCount() {
        return this.movies.reduce((acc, m) => {
            acc[m.genre] = (acc[m.genre] || 0) + 1;
            return acc;
        }, {});
    }
    getMovieSpecialOffers(movieId) {
        const m = this.findMovieById(this.movies, movieId);
        return m ? m.getSpecialOffers() : [];
    }
    findMovieById(collection, id) {
        return findById(collection, id, 'id');
    }
    findAudienceById(collection, id) {
        return findById(collection, id, 'id');
    }
    findTicketBookingById(collection, id) {
        return findById(collection, id, 'bookingId');
    }
}
const readlineSync = require("readline-sync");
const cinema = new Cinema();
cinema.addMovie(new ActionMovie("Fast & Furious", 100000));
cinema.addMovie(new ComedyMovie("Mr. Bean", 80000));
cinema.addMovie(new AnimationMovie("Doraemon", 60000));
cinema.movies.forEach(m => m.startShow());
let running = true;
while (running) {
    console.log("\n===== QUẢN LÝ ĐẶT VÉ XEM PHIM =====");
    console.log("1. Thêm khán giả mới (10đ)");
    console.log("2. Thêm phim mới (10đ)");
    console.log("3. Đặt vé (10đ)");
    console.log("4. Ngừng chiếu phim (10đ)");
    console.log("5. Hiển thị danh sách phim đang chiếu (10đ)");
    console.log("6. Hiển thị các đặt vé của một khán giả (10đ)");
    console.log("7. Tính và hiển thị tổng doanh thu (10đ)");
    console.log("8. Đếm số lượng từng thể loại phim (10đ)");
    console.log("9. Tìm kiếm và hiển thị thông tin bằng mã định danh (10đ)");
    console.log("10. Hiển thị ưu đãi của một phim (5đ)");
    console.log("0. Thoát chương trình (5đ)");
    const choice = readlineSync.question("Chọn chức năng: ");
    switch (choice) {
        case "1":
            const name = readlineSync.question("Tên khán giả: ");
            const email = readlineSync.question("Email: ");
            const phone = readlineSync.question("Số điện thoại: ");
            const a = cinema.addAudience(name, email, phone);
            console.log("Đã thêm khán giả:", a.getDetails());
            break;
        case "2":
            const title = readlineSync.question("Tên phim: ");
            console.log("Chọn loại phim: 1-Action, 2-Comedy, 3-Animation");
            const type = readlineSync.question("Loại: ");
            const price = Number(readlineSync.question("Giá vé: "));
            let movie = null;
            switch (type) {
                case "1":
                    movie = new ActionMovie(title, price);
                    break;
                case "2":
                    movie = new ComedyMovie(title, price);
                    break;
                case "3":
                    movie = new AnimationMovie(title, price);
                    break;
                default:
                    console.log("Loại phim không hợp lệ!");
            }
            if (movie) {
                cinema.addMovie(movie);
                movie.startShow();
                console.log("Đã thêm phim mới:", movie.title);
            }
            break;
        case "3":
            const audienceId = Number(readlineSync.question("Nhập ID khán giả: "));
            const movieId = Number(readlineSync.question("Nhập ID phim: "));
            const quantity = Number(readlineSync.question("Số lượng vé: "));
            const booking = cinema.bookTickets(audienceId, movieId, quantity);
            if (booking) {
                console.log("Đặt vé thành công:", booking.getDetails());
            }
            else {
                console.log("Đặt vé thất bại! Kiểm tra lại thông tin.");
            }
            break;
        case "4":
            const stopId = Number(readlineSync.question("Nhập ID phim cần dừng chiếu: "));
            cinema.cancelMovie(stopId);
            console.log("Phim đã dừng chiếu.");
            break;
        case "5":
            console.log("\n--- DANH SÁCH PHIM ĐANG CHIẾU ---");
            cinema.listShowingMovies().forEach(m => {
                console.log(`#${m.id} | ${m.title} | ${m.genre} | Giá: ${m.ticketPrice}`);
            });
            break;
        case "6":
            const audId = Number(readlineSync.question("Nhập ID khán giả: "));
            const bookings = cinema.listAudienceBookings(audId);
            if (bookings.length === 0) {
                console.log("Không có vé nào.");
            }
            else {
                bookings.forEach(b => console.log(b.getDetails()));
            }
            break;
        case "7":
            console.log("Tổng doanh thu:", cinema.calculateTotalRevenue());
            break;
        case "8":
            const counts = cinema.getMovieGenreCount();
            console.log("Số lượng phim theo thể loại:");
            for (let genre in counts) {
                console.log(`${genre}: ${counts[genre]}`);
            }
            break;
        case "9":
            const searchType = readlineSync.question("Tìm kiếm theo (1-Phim, 2-Khán giả, 3-Booking): ");
            const searchId = Number(readlineSync.question("Nhập ID: "));
            let found;
            if (searchType === "1")
                found = cinema.findMovieById(cinema.movies, searchId);
            else if (searchType === "2")
                found = cinema.findAudienceById(cinema.audiences, searchId);
            else if (searchType === "3")
                found = cinema.findTicketBookingById(cinema.bookings, searchId);
            else
                console.log("Loại tìm kiếm không hợp lệ!");
            if (found) {
                if ("getDetails" in found)
                    console.log(found.getDetails());
                else
                    console.log(found);
            }
            else {
                console.log("Không tìm thấy đối tượng.");
            }
            break;
        case "10":
            const offerId = Number(readlineSync.question("Nhập ID phim: "));
            const offers = cinema.getMovieSpecialOffers(offerId);
            console.log("Ưu đãi:", offers.length ? offers.join(", ") : "Không có ưu đãi.");
            break;
        case "0":
            console.log("Thoát chương trình...");
            running = false;
            break;
        default:
            console.log("Lựa chọn không hợp lệ!");
    }
}
