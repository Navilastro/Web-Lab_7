import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export function Cart() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clear = useCartStore((state) => state.clear);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="page-container">
        <h2>Your Cart</h2>
        <p>Your cart is currently empty.</p>
        <Link to="/products" className="btn">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Your Shopping Cart</h2>

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.title}</h4>
              <p>${item.price} each</p>
            </div>

            <div className="cart-item-controls">
              <button
                type="button"
                onClick={() => setQuantity(item.id, item.quantity - 1)}
                className="btn"
              >
                -
              </button>
              <span className="qty-text">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.id, item.quantity + 1)}
                className="btn"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="btn remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        <button type="button" onClick={clear} className="btn">
          Clear Cart
        </button>
      </div>
    </div>
  );
}