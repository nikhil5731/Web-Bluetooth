import React, { useState } from "react";

function App() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState("");

  let serviceID;
  let characteristicID;

  const scanForDevices = async () => {
    try {
      setError("");
      const options = {
        acceptAllDevices: true,
      };

      console.log("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice(options);
      setDevices(device);

      console.log("Establishing Connection...");
      const connection = await device.gatt.connect();

      console.log("Getting Service...");
      const service = await connection.getPrimaryService(serviceID);

      console.log("Getting Characteristics...");
      const characteristics = await service.getCharacteristics(
        characteristicID
      );

      console.log("Reading Value...");
      const value = await characteristics.readValue();

      console.log("Converting buffer...");
      const percent = value.getUint8(0);

      console.log(`Value: ${percent}%`);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <button
        className="bg-blue-500 p-5 rounded-xl text-white font-bold"
        onClick={scanForDevices}
      >
        Scan for bluetooth
      </button>
    </div>
  );
}

export default App;
