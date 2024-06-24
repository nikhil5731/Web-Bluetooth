import React, { useState } from "react";

function App() {
  const [devices, setDevices] = useState({});
  const [error, setError] = useState("");
  const [serviceID, setServiceID] = useState("");
  const [characteristicID, setCharacteristicID] = useState("");

  const handleChange = (event) => {
    if (event.target.name === "serviceID") {
      setServiceID(event.target.value);
    } else if (event.target.name === "characteristicID") {
      setCharacteristicID(event.target.value);
    }
  };

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
      setError(error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-300 flex flex-col justify-center gap-3 items-center p-4">
      <input
        type="text"
        name="serviceID"
        onChange={handleChange}
        className="py-4 px-3 rounded-xl outline-none w-[30%]"
        placeholder="Enter ServiceID"
      />
      <input
        type="text"
        name="characteristicID"
        onChange={handleChange}
        className="py-4 px-3 rounded-xl outline-none w-[30%]"
        placeholder="Enter CharacteristicID"
      />
      <button
        className="bg-blue-500 p-5 rounded-xl text-white font-bold"
        onClick={scanForDevices}
      >
        Scan for bluetooth
      </button>
      {devices?.gatt?.connected && (
        <div className="text-blue-900 font-bold text-xl">
          Connetion Established!
        </div>
      )}

      {error && (
        <div className="text-red-500 font-bold text-xl">
          Some Error Occured, Check console and Try Again!
        </div>
      )}
    </div>
  );
}

export default App;
