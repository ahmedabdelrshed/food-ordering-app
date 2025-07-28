import { getOrders } from "@/server/db/orders";
import { ExpandableOrdersTable } from "./_components/ExpandableOrdersTable";

const OrdersPage = async () => {
  const orders = await getOrders();
  return (
    <main>
      <section className="section-gap">
        <div className="container  mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl  font-bold text-gray-900">
              Orders Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all customer orders
            </p>
          </div>
          <ExpandableOrdersTable initialOrders={orders} />
        </div>
      </section>
    </main>
  );
};

export default OrdersPage;
