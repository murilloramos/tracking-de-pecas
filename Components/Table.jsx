export default ({ setCreateShipmentModel, allShipmentsData }) => {
    const converTime = (time) => {
        const newTime = new Date(time)
        const dataTime = Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(newTime)

        return dataTime
    }

    console.log(allShipmentsData)

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="item-start justify-between md:flex">
                <div className="max-w-lg">
                    <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                        Create Tracking
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div className="mt-3 md:mt-0">
                    <p
                        onClick={() => setCreateShipmentModel(true)}
                        href="javascript:void(0)"
                        className="inline-block px-4 py-2 text-white duration-150 font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 md:text-sm rounded-lg md:inline-flex"
                    >
                        Add Tracking
                    </p>
                </div>
            </div>
            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">Sender</th>
                            <th className="py-3 px-6">Receiver</th>
                            <th className="py-3 px-6">PickupTime</th>
                            <th className="py-3 px-6">Distance</th>
                            <th className="py-3 px-6">Price</th>
                            <th className="py-3 px-6">Delivery Time</th>
                            <th className="py-3 px-6">Paid</th>
                            <th className="py-3 px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {allShipmentsData?.map((shipment, idx) => (
                        // Debugging log to check the shipment data
                        console.log(shipment),  // Add this line to inspect the shipment data
                        <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {shipment?.remetente ? shipment.remetente.slice(0, 15) : "No Sender"}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {shipment?.destinatario ? shipment.destinatario.slice(0, 15) : "No Receiver"}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {converTime(shipment?.horaColeta)}  {/* Check if shipment.horaColeta is valid */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {shipment?.distancia ?? "N/A"} Km  {/* Optional chaining and nullish coalescing */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {shipment?.custo ?? "N/A"} {/* Optional chaining and nullish coalescing */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {shipment?.horaEntrega ?? "N/A"} {/* Optional chaining and nullish coalescing */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {shipment?.estaPago ? "Completed" : "Not Complete"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {shipment?.status === 0
                                    ? "Pending"
                                    : shipment?.status === 1
                                    ? "IN_TRANSIT"
                                    : "Delivered"}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}