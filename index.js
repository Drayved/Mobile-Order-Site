import { menuArray } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const plusBtn = document.getElementsByClassName("plus-btn")
const completeOrderBtn = document.querySelector(".complete-order-btn")
const payBtn = document.querySelector(".pay-btn")
const thankYouContainer = document.querySelector(".thank-you-container")
const paymentForm = document.querySelector(".payment-form")
let orderTotal = 0
let orderSummaryArray = []

// event listeners

document.addEventListener("click", function(e){
    if(e.target.dataset.additem){
        handlePlusClick(e.target.dataset.additem)
    }
    else if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    }else if(e.target === completeOrderBtn){
        handleOrderClick()
        }
})

paymentForm.addEventListener("submit", function(e){
    const finalPrice = orderTotal * .06 + orderTotal
    const paymentFormData = new FormData(paymentForm)
    const name = paymentFormData.get("full-name")

    thankYouContainer.innerHTML = `
        <h3 class="thank-you-message">
            Thanks, ${name}! Your total plus tax was ${finalPrice}!
        </h3>
    `

    document.querySelector(".order-container").classList.add('hidden')
    document.querySelector(".form-container").classList.add('hidden')
    thankYouContainer.classList.remove('hidden')

    setTimeout(function(){
        window.location.reload();
     }, 5000);
})

// handles button clicks

function handlePlusClick(orderId){
    document.querySelector(".order-container").classList.remove('hidden')
   
    const addToOrder = menuArray.filter(function(order){
        return order.id == orderId
    })[0]
       
    orderSummaryArray.push(
       { 
        name: addToOrder.name,
        price: addToOrder.price,
        id: uuidv4()
    })
        
    renderOrderSummary()
}

function handleRemoveClick(orderId){
    const orderTarget = orderSummaryArray.filter(function(order){
        return order.id === orderId
      })[0]

    const deleteOrder = orderSummaryArray.findIndex(function(order) {
        return order.id === orderTarget.id;
    })

    orderSummaryArray.splice(deleteOrder, 1)
      renderOrderSummary();
}

function handleOrderClick(){
    document.querySelector(".form-container").classList.remove("hidden")
}

// render HTML
function getFeedHtml(){
    let feedHtml = ""
    menuArray.forEach(function(menu){
        feedHtml += `
        <div class="main-content">
            <div class="emoji">
                <p>${menu.emoji}</p>
            </div>

            <div class="menu-content">
                <h2>${menu.name}</h2>
                <p>${menu.ingredients}</p>
                <p class="menu-price">$${menu.price}</p>
                <span class="btn-container">
                    <i class="fa-solid fa-plus plus-btn" data-additem = "${menu.id}"></i>
                </span>
            </div>
        </div>
        `
    })
    return feedHtml
}

function getOrderHtml(){
    let orderSummary = ""
    orderSummaryArray.forEach(function(order){
        orderSummary += `
        <div class="list-items">
            <div class="list-items-left"> 
                <h4>${order.name}</h4>
                <button 
                    class="remove-btn" 
                    data-remove="${order.id}">
                    remove
                </button>   
            </div>
            <p class="price">$${order.price}</p>
        </div>
    `
    orderTotal += order.price
    })
    document.querySelector(".order-summary").innerHTML = orderSummary
    document.getElementById("total").textContent = "$" + orderTotal;
    
    return orderSummary
}

function renderFeed(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    getThankYouMessage()
}

function renderOrderSummary(){
    document.getElementById('order').innerHTML = getOrderHtml()
}
renderFeed()