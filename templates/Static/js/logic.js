function markerSize(mass) {
    return mag * 20000;
}

console.log("hey");

d3.json("/api/landing_data")
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log(error);
    });



