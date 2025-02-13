
const hot = document.querySelector('#hot')
const proCate1 = document.querySelector('#proCate1')
const proCate2 = document.querySelector('#proCate2')


//san pham hot
fetch('http://localhost:1234/api/products/hot')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            hot.innerHTML += `
<div class="colum">
<img src="http://localhost:1234/images/${product.img} ">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err => console.log(err))

//san pham hot sachthieunhi
fetch('http://localhost:1234/api/products/hot/categoryid/1')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            hotthieunhi.innerHTML += `
<div class="colum">
<img src="http://localhost:1234/images/${product.img} ">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err => console.log(err))

//san pham hot sachvanhoc
fetch('http://localhost:1234/api/products/hot/categoryid/2')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            hotvanhoc.innerHTML += `
<div class="colum">
<img src="http://localhost:1234/images/${product.img} ">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err => console.log(err))

//san pham hot sachtruyencamhung
fetch('http://localhost:1234/api/products/hot/categoryid/3')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            hottruyencamhung.innerHTML += `
    <div class="colum">
    <img src="http://localhost:1234/images/${product.img} ">
    <h3>${product.name}</h3>
    <p>${product.price}</p>
    <a href="./detail.html?id=${product.id}">Xem chi tiết</a>
    </div>
    `
        })
    })
    .catch(err => console.log(err))


//san pham dm1
fetch('http://localhost:1234/api/products/categoryname/sachthieunhi')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            proCate1.innerHTML += `
<div class="colum">
<img src="http://localhost:1234/images/${product.img}">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err => console.log(err))





//san pham dm2
fetch('http://localhost:1234/api/products/categoryname/sachvanhoc')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            proCate2.innerHTML += `
<div class="colum">
<img src="http://localhost:1234/images/${product.img}">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err => console.log(err))

//san pham dm3
fetch('http://localhost:1234/api/products/categoryname/sachtruyencamhung')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            proCate3.innerHTML += `
<div class="colum">
<img src="http://localhost:1234/images/${product.img}"">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err => console.log(err))

//hien thi tat ca san pham
fetch('http://localhost:1234/api/products', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            proAll.innerHTML += `
<div class="colum">
<img src="http://localhost:1234/images/${product.img}" ">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err => console.log(err))



//xem chi tiet san pham
const detail = document.querySelector('#detail');
const id = window.location.href.split('id=')[1];

fetch(`http://localhost:1234/api/productdetail/${id}`)
    .then(response => response.json())
    .then(product => {
        detail.innerHTML += `
            <div class="product-detail-image">  
                <img src="http://localhost:1234/images/${product.img}">
            </div>
            <div class="product-detail-info">
                <h3>${product.name}</h3>
                <p>Giá: ${product.price}</p>
                <p>Mô tả: ${product.description}</p>
                <div class="quantity-selector">
                    <label for="quantity">Số lượng:</label>
                    <input type="number" id="quantity" name="quantity" value="1" min="1">
                </div>
                <button class="add-to-cart-btn">Thêm vào giỏ hàng</button>
            </div>
        `;

        // Thêm sự kiện cho nút "Thêm vào giỏ hàng"
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(document.querySelector('#quantity').value);
            addToCart(product, quantity);
        });
    });

function addToCart(product, quantity) {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += quantity; // Cập nhật số lượng
    } else {
        // Thêm sản phẩm mới vào giỏ hàng
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: quantity });
    }

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Hiển thị thông báo hoặc cập nhật giao diện
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
}




