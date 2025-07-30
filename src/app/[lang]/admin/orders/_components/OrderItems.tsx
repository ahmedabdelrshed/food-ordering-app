import { TOrderWithRelations } from "@/types/order";
import { OrderItem } from "@prisma/client";
import { formatCurrency } from "@/lib/formatCurrency";
import Image from "next/image";

interface OrderItemsProps {
  order: TOrderWithRelations;
}

function calculateItemTotal(item: OrderItem) {
  return item.price * item.quantity;
}

export function OrderItems({ order }: OrderItemsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">Order Items:</h4>
      {order.items.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h5 className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {item.product.description}
                  </p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Size:</span> {item.size.name}
                  <div className="text-gray-500">
                    {formatCurrency(item.size.price + item.product.basePrice)}{" "}
                    each
                  </div>
                </div>

                <div>
                  <span className="font-medium">Quantity:</span> {item.quantity}
                </div>

                {item.extras.length > 0 && (
                  <div>
                    <span className="font-medium">Extras:</span>
                    <ul className="text-gray-500 text-xs mt-1">
                      {item.extras.map((extra) => (
                        <li key={extra.id}>
                          {extra.name} (+{formatCurrency(extra.price)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(calculateItemTotal(item))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
