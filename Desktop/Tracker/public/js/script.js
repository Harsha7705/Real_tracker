const socket = io();
const map = L.map('map').setView([0, 0], 10);

// Initialize the tile layer for the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

// Object to store markers with their corresponding IDs
const markers = {};

// Socket event listener for receiving location updates
socket.on("location", (data) => {
    const { id, latitude, longitude } = data;

    // Set the map view to the updated location
    map.setView([latitude, longitude], 10);

    // Check if a marker for this ID already exists
    if (markers[id]) {
        // If marker exists, update its position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // If marker doesn't exist, create a new marker and add it to the map
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Socket event listener for handling user disconnection
socket.on("user disconnected", (id) => {
    // Check if the marker exists for the disconnected user
    if (markers[id]) {
        // Remove the marker from the map
        map.removeLayer(markers[id]);
        // Remove the marker from the markers object
        delete markers[id];
    }
});

// Geolocation tracking setup (optional: depends on how you initialize it)
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('location', { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}
