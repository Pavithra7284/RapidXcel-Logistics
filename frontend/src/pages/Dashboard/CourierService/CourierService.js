import { useEffect, useState } from "react";
import "./style.css";

const CourierService = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    const fetchCouriers = async () => {
        const response = await fetch(`${BACKEND_URL}/api/orders`);
        let data = await response.json();
        // filter out orders with courier id
        // TODO: Replace 1 with the actual courier id
        data = data.filter(order => order.courier_id === 1);
        setOrders(data);
    };

    useEffect(() => {
        fetchCouriers();
    }, []);

    const handleUpdateStatus = async () => {
        if (selectedOrder && newStatus) {
            const response = await fetch(`${BACKEND_URL}/api/orders/${selectedOrder.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
                setSelectedOrder(null);
                setNewStatus("");
                fetchCouriers(); // Fetch the latest orders after update
            }
        }
    };

    return (
        <>
            <Modal order={selectedOrder} setNewStatus={setNewStatus} handleUpdateStatus={handleUpdateStatus} />
            <div id="courier_service">
                <h1>Courier Service</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Delivery Address</th>
                            <th>Weight</th>
                            <th>Items</th>
                            <th>Shipping Cost</th>
                            <th>Delivery Date</th>
                            <th>Order status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.created_at}</td>
                                <td>{order.shipping_address}</td>
                                <td>{order.consignment_weight}</td>
                                <td>{order.order_items.join(", ")}</td>
                                <td>{order.shipping_cost}</td>
                                <td>{order.delivery_date}</td>
                                <td>{order.status}</td>
                                <td>
                                    <button data-bs-toggle="modal" data-bs-target="#updateOrderStatus" onClick={() => setSelectedOrder(order)}>Update Status</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const Modal = ({ order, setNewStatus, handleUpdateStatus }) => {
    return (
        <div
            className="modal fade"
            id="updateOrderStatus"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Update Order Status
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="orderStatus" className="form-label">
                                    Order Status
                                </label>
                                <select
                                    className="form-select"
                                    id="orderStatus"
                                    aria-label="Default select example"
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option defaultValue>Open this select menu</option>
                                    <option value="Processing">Processing</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        <button data-bs-dismiss="modal" type="button" className="btn btn-primary" onClick={handleUpdateStatus}>
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourierService;