import React, { useState } from 'react';
import './App.css';

function App() {
  const [deviceName, setDeviceName] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [error, setError] = useState('');

  const connectBluetooth = async () => {
    setError('');
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }]
      });

      setDeviceName(device.name || 'Unknown Device');

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const value = await characteristic.readValue();
      setBatteryLevel(value.getUint8(0));
    } catch (err) {
      setError('Failed to connect to th e device. Make sure it supports Bluetooth and battery service.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Bluetooth Battery Level</h1>
        <button
          onClick={connectBluetooth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect to Bluetooth Device
        </button>
        {deviceName && (
          <div className="mt-4">
            <p className="text-lg">Device: {deviceName}</p>
            {batteryLevel !== null && (
              <p className="text-lg">Battery Level: {batteryLevel}%</p>
            )}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
