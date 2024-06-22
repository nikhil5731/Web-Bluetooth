import React, { useState } from "react";

function App() {
  const [devices, setDevices] = useState([]);

  const scanForDevices = async () => {
    try {
      const options = {
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      };

      console.log("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice(options);

      console.log("Connecting to GATT Server...");
      const server = await device.gatt.connect();

      console.log("Getting Battery Service...");
      const service = await server.getPrimaryService("battery_service");

      console.log("Getting Battery Level Characteristic...");
      const characteristic = await service.getCharacteristic("battery_level");

      console.log("Reading Battery Level...");
      const value = await characteristic.readValue();
      const batteryLevel = value.getUint8(0);

      setDevices((prevDevices) => [
        ...prevDevices,
        {
          name: device.name,
          id: device.id,
          batteryLevel: batteryLevel,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Bluetooth Device Scanner</h1>
      <button
        onClick={scanForDevices}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Scan for Bluetooth Devices
      </button>
      <ul className="mt-4 w-full max-w-md">
        {devices.map((device, index) => (
          <li key={index} className="bg-white shadow-md rounded p-4 mb-4">
            <p className="font-semibold">Name: {device.name}</p>
            <p>ID: {device.id}</p>
            <p>Battery Level: {device.batteryLevel}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
