const connectButton = document.getElementById('connect');
const sendButton = document.getElementById('send');
const messageBox = document.getElementById('message');
const receivedMessages = document.getElementById('receivedMessages');

let device;
let server;
let service;
let characteristic;

connectButton.addEventListener('click', async () => {
    try {
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Example service UUID
        });
        
        server = await device.gatt.connect();
        service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb'); // Example characteristic UUID
        
        characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        
        console.log('Connected to device');
    } catch (error) {
        console.error('Error connecting to device:', error);
    }
});

sendButton.addEventListener('click', async () => {
    const message = messageBox.value;
    if (characteristic && message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        await characteristic.writeValue(data);
        console.log('Message sent:', message);
    }
});

function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    const decoder = new TextDecoder();
    const message = decoder.decode(value);
    const newMessageElement = document.createElement('div');
    newMessageElement.textContent = `Received: ${message}`;
    receivedMessages.appendChild(newMessageElement);
}
