var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Movie = /** @class */ (function () {
    function Movie(title, genre, ticketPrice) {
        this.id = Movie.idCounter++;
        this.title = title;
        this.genre = genre;
        this.ticketPrice = ticketPrice;
        this.isShowing = false;
    }
    Movie.prototype.startShow = function () {
        this.isShowing = true;
    };
    Movie.prototype.stopShow = function () {
        this.isShowing = false;
    };
    Movie.prototype.calculateTicketCost = function (quantity) {
        return 0;
    };
    Movie.prototype.getSpecialOffers = function () {
        return [];
    };
    Movie.prototype.getMovieInfo = function () {
        return '';
    };
    Movie.idCounter = 1;
    return Movie;
}());
var ActionMovie = /** @class */ (function (_super) {
    __extends(ActionMovie, _super);
    function ActionMovie(title, price) {
        return _super.call(this, title, 'Hành động', price) || this;
    }
    ActionMovie.prototype.calculateTicketCost = function (quantity) {
        return this.ticketPrice * quantity * 1.15;
    };
    ActionMovie.prototype.getSpecialOffers = function () {
        return ['Miễn phí bắp rang', 'Tặng poster'];
    };
    ActionMovie.prototype.getMovieInfo = function () {
        return 'Phim hành động gay cấn, kỹ xảo hoành tráng';
    };
    return ActionMovie;
}(Movie));
var ComedyMovie = /** @class */ (function (_super) {
    __extends(ComedyMovie, _super);
    function ComedyMovie(title, price) {
        return _super.call(this, title, 'Hài', price) || this;
    }
    ComedyMovie.prototype.calculateTicketCost = function (quantity) {
        var subtotal = this.ticketPrice * quantity;
        return quantity >= 5 ? subtotal * 0.9 : subtotal;
    };
    ComedyMovie.prototype.getSpecialOffers = function () {
        return ['Giảm 10% cho nhóm trên 4 người'];
    };
    ComedyMovie.prototype.getMovieInfo = function () {
        return 'Phim hài nhẹ nhàng, vui nhộn';
    };
    return ComedyMovie;
}(Movie));
var AnimationMovie = /** @class */ (function (_super) {
    __extends(AnimationMovie, _super);
    function AnimationMovie(title, price) {
        return _super.call(this, title, 'Hoạt hình', price) || this;
    }
    AnimationMovie.prototype.calculateTicketCost = function (quantity) {
        return quantity >= 3
            ? this.ticketPrice * quantity * 0.85
            : this.ticketPrice * quantity;
    };
    AnimationMovie.prototype.getSpecialOffers = function () {
        return ['Giảm giá cho trẻ em dưới 12 tuổi'];
    };
    AnimationMovie.prototype.getMovieInfo = function () {
        return 'Phim hoạt hình với hình ảnh sống động';
    };
    return AnimationMovie;
}(Movie));
var Audience = /** @class */ (function () {
    function Audience(name, email, phone) {
        this.id = Audience.idCounter++;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    Audience.prototype.getDetails = function () {
        return "#".concat(this.id, " | ").concat(this.name, " | ").concat(this.email, " | ").concat(this.phone);
    };
    Audience.idCounter = 1;
    return Audience;
}());
var TicketBooking = /** @class */ (function () {
    function TicketBooking(audience, movie, quantity) {
        this.bookingId = TicketBooking.idCounter++;
        this.audience = audience;
        this.movie = movie;
        this.quantity = quantity;
        this.totalPrice = movie.calculateTicketCost(quantity);
    }
    TicketBooking.prototype.getDetails = function () {
        return "Booking#".concat(this.bookingId, " | Audience: ").concat(this.audience.name, " | Movie: ").concat(this.movie.title, " | Qty: ").concat(this.quantity, " | Total: ").concat(this.totalPrice.toFixed(2));
    };
    TicketBooking.idCounter = 1;
    return TicketBooking;
}());
function findById(collection, id, key) {
    return collection.find(function (item) { return Number(item[key]) === id; });
}
var Cinema = /** @class */ (function () {
    function Cinema() {
        this.movies = [];
        this.audiences = [];
        this.bookings = [];
    }
    Cinema.prototype.addMovie = function (movie) {
        this.movies.push(movie);
    };
    Cinema.prototype.addAudience = function (name, email, phone) {
        var a = new Audience(name, email, phone);
        this.audiences.push(a);
        return a;
    };
    Cinema.prototype.bookTickets = function (audienceId, movieId, quantity) {
        var audience = this.findAudienceById(this.audiences, audienceId);
        var movie = this.findMovieById(this.movies, movieId);
        if (!audience || !movie || !movie.isShowing || quantity <= 0)
            return null;
        var booking = new TicketBooking(audience, movie, quantity);
        this.bookings.push(booking);
        return booking;
    };
    Cinema.prototype.cancelMovie = function (movieId) {
        var idx = this.movies.findIndex(function (m) { return m.id === movieId; });
        if (idx !== -1)
            this.movies[idx].stopShow();
    };
    Cinema.prototype.listShowingMovies = function () {
        return this.movies.filter(function (m) { return m.isShowing; });
    };
    Cinema.prototype.listAudienceBookings = function (audienceId) {
        return this.bookings.filter(function (b) { return b.audience.id === audienceId; });
    };
    Cinema.prototype.calculateTotalRevenue = function () {
        return this.bookings.reduce(function (sum, b) { return sum + b.totalPrice; }, 0);
    };
    Cinema.prototype.getMovieGenreCount = function () {
        return this.movies.reduce(function (acc, m) {
            acc[m.genre] = (acc[m.genre] || 0) + 1;
            return acc;
        }, {});
    };
    Cinema.prototype.getMovieSpecialOffers = function (movieId) {
        var m = this.findMovieById(this.movies, movieId);
        return m ? m.getSpecialOffers() : [];
    };
    Cinema.prototype.findMovieById = function (collection, id) {
        return findById(collection, id, 'id');
    };
    Cinema.prototype.findAudienceById = function (collection, id) {
        return findById(collection, id, 'id');
    };
    Cinema.prototype.findTicketBookingById = function (collection, id) {
        return findById(collection, id, 'bookingId');
    };
    return Cinema;
}());
var readlineSync = require("readline-sync");
var cinema = new Cinema();
cinema.addMovie(new ActionMovie("Fast & Furious", 100000));
cinema.addMovie(new ComedyMovie("Mr. Bean", 80000));
cinema.addMovie(new AnimationMovie("Doraemon", 60000));
cinema.movies.forEach(function (m) { return m.startShow(); });
var running = true;
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
    var choice = readlineSync.question("Chọn chức năng: ");
    switch (choice) {
        case "1":
            var name_1 = readlineSync.question("Tên khán giả: ");
            var email = readlineSync.question("Email: ");
            var phone = readlineSync.question("Số điện thoại: ");
            var a = cinema.addAudience(name_1, email, phone);
            console.log("Đã thêm khán giả:", a.getDetails());
            break;
        case "2":
            var title = readlineSync.question("Tên phim: ");
            console.log("Chọn loại phim: 1-Action, 2-Comedy, 3-Animation");
            var type = readlineSync.question("Loại: ");
            var price = Number(readlineSync.question("Giá vé: "));
            var movie = null;
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
            var audienceId = Number(readlineSync.question("Nhập ID khán giả: "));
            var movieId = Number(readlineSync.question("Nhập ID phim: "));
            var quantity = Number(readlineSync.question("Số lượng vé: "));
            var booking = cinema.bookTickets(audienceId, movieId, quantity);
            if (booking) {
                console.log("Đặt vé thành công:", booking.getDetails());
            }
            else {
                console.log("Đặt vé thất bại! Kiểm tra lại thông tin.");
            }
            break;
        case "4":
            var stopId = Number(readlineSync.question("Nhập ID phim cần dừng chiếu: "));
            cinema.cancelMovie(stopId);
            console.log("Phim đã dừng chiếu.");
            break;
        case "5":
            console.log("\n--- DANH SÁCH PHIM ĐANG CHIẾU ---");
            cinema.listShowingMovies().forEach(function (m) {
                console.log("#".concat(m.id, " | ").concat(m.title, " | ").concat(m.genre, " | Gi\u00E1: ").concat(m.ticketPrice));
            });
            break;
        case "6":
            var audId = Number(readlineSync.question("Nhập ID khán giả: "));
            var bookings = cinema.listAudienceBookings(audId);
            if (bookings.length === 0) {
                console.log("Không có vé nào.");
            }
            else {
                bookings.forEach(function (b) { return console.log(b.getDetails()); });
            }
            break;
        case "7":
            console.log("Tổng doanh thu:", cinema.calculateTotalRevenue());
            break;
        case "8":
            var counts = cinema.getMovieGenreCount();
            console.log("Số lượng phim theo thể loại:");
            for (var genre in counts) {
                console.log("".concat(genre, ": ").concat(counts[genre]));
            }
            break;
        case "9":
            var searchType = readlineSync.question("Tìm kiếm theo (1-Phim, 2-Khán giả, 3-Booking): ");
            var searchId = Number(readlineSync.question("Nhập ID: "));
            var found = void 0;
            if (searchType === "1")
                found = cinema.findMovieById(cinema.movies, searchId);
            else if (searchType === "2")
                found = cinema.findAudienceById(cinema.audiences, searchId);
            else if (searchType === "3")
                found = cinema.findTicketBookingById(cinema.bookings, searchId);
            else
                console.log("Loại tìm kiếm không hợp lệ!");
            if (found) {
                if ("" in found)
                    console.log(found.getDetails());
                else
                    console.log(found);
            }
            else {
                console.log("Không tìm thấy đối tượng.");
            }
            break;
        case "10":
            var offerId = Number(readlineSync.question("Nhập ID phim: "));
            var offers = cinema.getMovieSpecialOffers(offerId);
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
