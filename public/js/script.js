const socket = io();


// this checks if my browser supports geolocation --
if(navigator.geolocation) { 
    navigator.geolocation.watchPosition((position) => {  //jabhi banda move karega toh iski position watch karo
        const { latitude, longitude } = position.coords; // isse hamko position mila aur usko coordinates ie, latitude and longitiude me nikal liya
        socket.emit("send-location", { latitude, longitude }); // yaha se coordinates backend pe bhej diye
    }, (error) => {
        console.error(error);
    },
    {    //watchposition ko tesri chiz apply kar sakte hai jo ki hai uski settings
       enableHighAccuracy: true,
       maximumAge: 0, // caching nhi karega , iska mtlb ki purani data mat lena abhi abhi wala data lena
       timeout: 5000, // phir 5 second baad check karega ki naya position kaha hai ya app kaha pe hai 
    }
); 
}

// now leaflet functions is gonna apply--
const map = L.map("map").setView([0, 0], 26); // this is a notification to get the location, uske baad uska view set karenge initially i.e, [0,0] aur zoom level set karo 16

// initialise a map cenetered at cordinates (0, 0) with a zoom level of 15 or 16 using leaflet
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Bineet Test"
}).addTo(map);

// create an empty object markers.
const markers = {};

socket.on("receive-location", (data) => {
    const { latitude, longitude, id } = data;
    // map.setView([latitude, longitude]);
    console.log(`Received location from user with ID: ${id}`);
    // now adding the marker at the particular user location--
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude]);
    }
})

// if user got disconnected--
socket.on("user-disconnected", (id) => {
    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }

})